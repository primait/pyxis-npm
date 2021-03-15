import { PNG } from "pngjs";
import asyncPool from "tiny-async-pool";
import pixelmatch from "pixelmatch";
import fs from "fs/promises";
import argv from "./argv";
import config from "./config";
import {
  cartesian3Product,
  logDebug,
  logInfo,
  logTestResult,
  logTestResultPreview,
  omitIsMobile,
  testToBaselinePath,
  testToDiffPath,
  testToName,
  testToPath,
  testToURL,
} from "./helpers";
import { stabilizePage } from "./stabilize-page";
import { TestResult, BrowserSpec, PreparedTest } from "./types";
import TEST_DEFINITIONS from "./test-definitions";

const main = async () => {
  // Make screenshot folders
  await prepareFolders();

  // Launch browsers
  const launchedBrowsers = await prepareBrowsers();

  // Enqueue tests
  const tests = await prepareTests(launchedBrowsers);

  // Run tests
  const results = await runVisualRegressionTests(tests, argv.poolSize);

  // Close browsers
  await Promise.all(launchedBrowsers.map(({ browser }) => browser.close()));

  // Log results
  process.stdout.write("\n\n");
  for (const result of results) {
    !result.succeeded && logTestResult(result);
  }

  // Evaluate results
  const allTestsSucceeded = results
    .map((result) => result.succeeded)
    .reduce((prev, curr) => prev && curr);

  // Exit with a meaningful UNIX exit status
  process.exit(allTestsSucceeded ? 0 : 1);
};

const prepareBrowsers = async (): Promise<Array<BrowserSpec>> => {
  const browsers = await Promise.all(config.browsers.map((b) => b.launch()));
  const browserNames = config.browsers.map((b) => b.name());
  return browsers.map((browser, i) => ({
    browser,
    browserName: browserNames[i],
  }));
};

const prepareFolders = async () => {
  await Promise.all(
    TEST_DEFINITIONS.map((testDefinition) => {
      fs.mkdir(`${config.screenshotsPath}${testDefinition.name}/`, {
        recursive: true, // Prevents failure when folder already exists
      });
    })
  );
};

const prepareTests = async (
  launchedBrowsers: BrowserSpec[]
): Promise<Array<PreparedTest>> => {
  const combinations = [
    ...cartesian3Product(
      launchedBrowsers,
      config.deviceDefinitions,
      TEST_DEFINITIONS
    ),
  ];

  return Promise.all(
    combinations.map(
      async ([{ browser, browserName }, { device, name }, testDefinition]) => {
        const device_ =
          browserName == "firefox" ? omitIsMobile(device) : device;
        const context = await browser.newContext({ ...device_ });

        return {
          browser,
          browserName,
          context,
          deviceName: name,
          testDefinition,
        };
      }
    )
  );
};

/**
 * Runs visual regression tests in parallel, using a pool of the given size
 */
const runVisualRegressionTests = async (
  testQueue: Array<PreparedTest>,
  poolSize: number
): Promise<TestResult[]> => {
  return asyncPool(poolSize, testQueue, runVisualRegressionTest);
  // return await Promise.all(
  //   testQueue.map((testDef) => runVisualRegressionTest(testDef))
  // );
};

const runVisualRegressionTest = async (
  test: PreparedTest
): Promise<TestResult> => {
  try {
    // Load and stabilize page
    logDebug(`${testToName(test)}: Loading page`);
    const page = await test.context.newPage();
    await page.goto(testToURL(test), {
      waitUntil: "networkidle",
      timeout: config.fullSuiteRuntimeEstimate,
    });
    await stabilizePage(page);

    // Wait some more to avoid false negatives
    logDebug(`${testToName(test)}: Waiting to avoid false negatives`);
    await page.waitForTimeout(config.timeoutBeforeScreenshot);

    // Finally, take the actual screenshot
    logDebug(`${testToName(test)}: Page ready. Taking screenshot`);
    const buffer = await page.screenshot({
      fullPage: true,
      timeout: config.fullSuiteRuntimeEstimate,
    });

    // Match the screenshot against baseline
    const testResult = await handleScreenshot(test, buffer);
    logTestResultPreview(testResult);
    return testResult;
  } catch (error) {
    // TODO: if the error is a timeout, retry the test
    handleUnexpectedError({ test, error });
  }
};

const handleScreenshot = async (
  test: PreparedTest,
  buffer
): Promise<TestResult> => {
  const name = testToName(test);
  const baselinePath = testToBaselinePath(test);

  const current = PNG.sync.read(buffer);

  if (argv.updateBaseline) {
    // CLI update flag has been passed: update baseline with current
    return await handleBaselineUpdate({
      baselineWasMissing: false,
      test,
      baselinePath,
      current,
    });
  }

  let baselineFile;
  try {
    baselineFile = await fs.readFile(baselinePath);
  } catch (error) {
    // Baseline is missing: update baseline with current
    return await handleBaselineUpdate({
      baselineWasMissing: true,
      test,
      baselinePath,
      current,
    });
  }

  const baseline = PNG.sync.read(baselineFile);
  const diff = new PNG({
    width: baseline.width,
    height: baseline.height,
  });

  try {
    const diffRatio = pixelmatch(
      baseline.data,
      current.data,
      diff.data,
      baseline.width,
      baseline.height,
      {
        threshold: config.pixelmatchThreshold,
        includeAA: true,
      }
    );

    if (diffRatio > config.pixelmatchThreshold) {
      // Screenshot wasn't a good enough match: save `current` and `diff`
      return await handleTestFailure({ test, current, diff });
    }
  } catch (error) {
    return await handlePixelmatchError({ test, current, diff, error });
  }

  // Screenshot was a good enough match: succeed
  return handleTestSuccess(name);
};

const handleBaselineUpdate = async ({
  baselineWasMissing,
  test,
  baselinePath,
  current,
}): Promise<TestResult> => {
  const comment = baselineWasMissing
    ? "baseline was missing"
    : "baseline updated via flag";
  logDebug(`${testToName(test)}: Saving to ${baselinePath} because ${comment}`);
  await fs.writeFile(baselinePath, PNG.sync.write(current));
  return {
    name: testToName(test),
    succeeded: true,
    comment,
  };
};

/**
 * Just return a successful TestResult
 */
const handleTestSuccess = (testName: string): TestResult => {
  logDebug(`${testName} success`);
  return {
    name: testName,
    succeeded: true,
    comment: `diff is below ${config.pixelmatchThreshold}`,
  };
};

/**
 * Write `current` and `diff` to fs, return failure
 */
const handleTestFailure = async ({
  test,
  current,
  diff,
}): Promise<TestResult> => {
  const comment = `diff is above ${config.pixelmatchThreshold}`;
  logDebug(`${testToName(test)} failure: ${comment}`);
  await Promise.all([
    fs.writeFile(testToPath(test), PNG.sync.write(current)),
    fs.writeFile(testToDiffPath(test), PNG.sync.write(diff)),
  ]);
  return {
    name: testToName(test),
    succeeded: false,
    comment,
  };
};

/**
 * Write `current` and `diff` to fs, return failure
 */
const handlePixelmatchError = async ({
  test,
  current,
  diff,
  error,
}): Promise<TestResult> => {
  logInfo(`${testToName(test)} pixelmatch error:`, error);
  await Promise.all([
    fs.writeFile(testToPath(test), PNG.sync.write(current)),
    fs.writeFile(testToDiffPath(test), PNG.sync.write(diff)),
  ]);
  return {
    name: testToName(test),
    succeeded: false,
    comment: `Pixelmatch error: ${error}`,
  };
};

/**
 * Something unexpected happened, return failure
 */
const handleUnexpectedError = async ({ test, error }): Promise<TestResult> => {
  logInfo(`${testToName(test)} unexpected error:`, error);
  return {
    name: testToName(test),
    comment: `${error}`,
    succeeded: false,
  };
};

main();
