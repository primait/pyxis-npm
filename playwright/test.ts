import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import fs from "fs/promises";
import config from "./config";
import {
  disableAnimationsOnPage,
  logTestResult,
  logTestResultPreview,
  omitIsMobile,
  testToBaselinePath,
  testToDiffPath,
  testToName,
  testToPath,
  testToURL,
} from "./helpers";
import { TestResult, BrowserSpec, Test } from "./types";

const main = async () => {
  // Make screenshot folders
  await prepareFolders();

  // Launch browsers
  const launchedBrowsers = await prepareBrowsers();

  // Enqueue tests
  const tests = await prepareTests(launchedBrowsers);

  // Run tests
  const results = await runVisualRegressionTests(tests);

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
    config.testDefinitions.map((testDefinition) => {
      fs.mkdir(`${config.screenshotsPath}${testDefinition.name}/`, {
        recursive: true, // Prevents failure when folder already exists
      });
    })
  );
};

const prepareTests = async (
  launchedBrowsers: BrowserSpec[]
): Promise<Array<Test>> => {
  const tests: Array<Test> = [];
  for (const { browser, browserName } of launchedBrowsers) {
    for (const { name: deviceName, device } of config.deviceDefinitions) {
      const device_ = browserName == "firefox" ? omitIsMobile(device) : device;
      const context = await browser.newContext({ ...device_ });

      for (const testDefinition of config.testDefinitions) {
        tests.push({
          browser,
          browserName,
          context,
          deviceName,
          testDefinition,
        });
      }
    }
  }
  return tests;
};

const runVisualRegressionTests = async (testQueue: Array<Test>) => {
  return await Promise.all(
    testQueue.map((testDef) => runVisualRegressionTest(testDef))
  );
};

const runVisualRegressionTest = async (test: Test): Promise<TestResult> => {
  try {
    const page = await test.context.newPage();
    await page.goto(testToURL(test), {
      waitUntil: "networkidle",
      timeout: config.worstCaseTimeout,
    });
    await disableAnimationsOnPage(page);
    await page.waitForTimeout(config.timeoutBeforeScreenshot);

    // Finally, take the actual screenshot
    const buffer = await page.screenshot({
      fullPage: true,
      timeout: config.worstCaseTimeout,
    });

    const result = await handleScreenshot(test, buffer);

    logTestResultPreview(result);
    return result;
  } catch (error) {
    // Something unexpected happened: log this error
    return {
      name: testToName(test),
      comment: `${error}`,
      succeeded: false,
    };
  }
};

const handleScreenshot = async (test: Test, buffer): Promise<TestResult> => {
  const name = testToName(test);
  const baselinePath = testToBaselinePath(test);

  const current = PNG.sync.read(buffer);

  if (config.flagUpdateBaseline) {
    // CLI update flag has been passed: update baseline with current
    await fs.writeFile(baselinePath, PNG.sync.write(current));
    return { name, succeeded: true, comment: `baseline updated via flag` };
  }

  let baselineFile;
  try {
    baselineFile = await fs.readFile(baselinePath);
  } catch (error) {
    // Baseline is missing: update baseline with current
    await fs.writeFile(baselinePath, PNG.sync.write(current));
    return { name, succeeded: true, comment: `baseline was missing` };
  }

  const baseline = PNG.sync.read(baselineFile);
  const diff = new PNG({
    width: baseline.width,
    height: baseline.height,
  });

  let result, error;
  try {
    result = pixelmatch(
      baseline.data,
      current.data,
      diff.data,
      baseline.width,
      baseline.height,
      {
        threshold: config.threshold,
        includeAA: true,
      }
    );
  } catch (error_) {
    error = error_;
    // Not-fully-loaded or otherwise unstable pages' sizes can differ from baseline
    // console.log(
    //   "w",
    //   baseline.width,
    //   current.width,
    //   "h",
    //   baseline.height,
    //   current.height
    // );
  }

  if (result > config.threshold || error !== undefined) {
    // Screenshot didn't match, or an error occurred: save `current` and `diff`
    await Promise.all([
      fs.writeFile(testToPath(test), PNG.sync.write(current)),
      fs.writeFile(testToDiffPath(test), PNG.sync.write(diff)),
    ]);
    return {
      name,
      succeeded: false,
      comment:
        `Pixelmatch error: ${error}` || `diff is above ${config.threshold}`,
    };
  }

  // Screenshot does match: succeed
  return {
    name,
    succeeded: true,
    comment: `diff is below ${config.threshold}`,
  };
};

main();
