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
  const tests = Array.from(prepareTests(launchedBrowsers));

  // Run tests
  const results = await runVisualRegressionTests(tests);

  // Close browsers
  await Promise.all(launchedBrowsers.map(({ browser }) => browser.close()));

  // Log results
  process.stdout.write("\n\n");
  for (const result of results) {
    result.succeeded && logTestResult(result);
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

const prepareTests = function* (launchedBrowsers): Generator<Test> {
  for (const testDefinition of config.testDefinitions) {
    for (const { browser, browserName } of launchedBrowsers) {
      for (const { name: deviceName, deviceDescriptor } of config.devices) {
        // Omit `isMobile`: it's not supported in Firefox.
        const device =
          browserName == "firefox"
            ? omitIsMobile(deviceDescriptor)
            : deviceDescriptor;

        yield { browser, browserName, device, deviceName, testDefinition };
      }
    }
  }
};

const runVisualRegressionTests = async (testQueue: Array<Test>) => {
  const results = await Promise.all(
    testQueue.map((testDef) => runVisualRegressionTest(testDef))
  );
  return results;
};

const runVisualRegressionTest = async (test: Test): Promise<TestResult> => {
  try {
    const context = await test.browser.newContext({ ...test.device });
    const page = await context.newPage();
    await page.goto(testToURL(test), {
      waitUntil: "networkidle",
      timeout: config.worstCaseTimeout,
    });
    await disableAnimationsOnPage(page);
    await page.waitForTimeout(config.renderingTimeout);
    const buffer = await page.screenshot({
      fullPage: true,
      timeout: config.worstCaseTimeout,
    });
    const result = await handleScreenshot(test, buffer);

    logTestResultPreview(result);
    return result;
  } catch (error) {
    // Something unexpected happened: log this error. TODO: handle this properly
    console.log(testToName(test), error);
    return {
      name: testToName(test),
      comment: "unexpected error",
      succeeded: false,
    };
  }
};

const handleScreenshot = async (test: Test, buffer): Promise<TestResult> => {
  const name = testToName(test);
  const baselinePath = testToBaselinePath(test);

  if (config.flagUpdateBaseline) {
    // flagUpdateBaseline has been passed: update baseline with current
    await fs.writeFile(baselinePath, buffer);
    return { name, succeeded: true, comment: `baseline updated` };
  }

  let baselineFile;
  try {
    baselineFile = await fs.readFile(baselinePath);
  } catch (error) {
    // Baseline is missing: update baseline with current
    await fs.writeFile(baselinePath, buffer);
    return { name, succeeded: true, comment: `baseline was missing` };
  }

  const current = PNG.sync.read(buffer);
  const baseline = PNG.sync.read(baselineFile);
  const diff = new PNG({
    width: baseline.width,
    height: baseline.height,
  });

  const result = pixelmatch(
    baseline.data,
    current.data,
    diff.data,
    baseline.width,
    baseline.height,
    {
      threshold: config.tolerance,
      includeAA: true,
    }
  );

  if (result > config.tolerance) {
    // Screenshot doesn't match: save current and diff to filesystem
    await Promise.all([
      fs.writeFile(testToPath(test), buffer),
      fs.writeFile(testToDiffPath(test), PNG.sync.write(diff)),
    ]);
    return {
      name,
      succeeded: false,
      comment: `diff is above ${config.tolerance}`,
    };
  }

  // Screenshot does match: succeed
  return {
    name,
    succeeded: true,
    comment: `diff is below ${config.tolerance}`,
  };
};

main();
