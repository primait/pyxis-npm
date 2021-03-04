import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import fs from "fs";
import config from "./config";
import {
  logTestResult,
  logTestResultPreview,
  omitIsMobile,
  screenshotNameToBaselinePath,
  screenshotNameToDiffPath,
  screenshotNameToPath,
} from "./helpers";
import { TestSpec, TestResult } from "./types";

const testSpecs: Array<TestSpec> = [
  {
    name: "Accordion",
    relativeURL: "src/test/accordions.html",
  },
];

const main = async () => {
  // Open browsers
  const launchedBrowsers = await prepareBrowsers();

  // Enqueue tests
  const testQueue = Array.from(prepareTests(launchedBrowsers));

  // Run tests
  const results = await Promise.all(
    testQueue.map((testDef) => runTest(testDef))
  );

  // Close browsers
  await Promise.all(launchedBrowsers.map(({ browser }) => browser.close()));

  // Log results
  process.stdout.write("\n\n");
  for (const result of results) {
    logTestResult(result);
  }

  // Evaluate results
  const allTestsSucceeded = results
    .map((result) => result.succeeded)
    .reduce((prev, curr) => prev && curr);

  // Exit with a meaningful UNIX exit status
  process.exit(allTestsSucceeded ? 0 : 1);
};

const prepareBrowsers = async () => {
  const launchedBrowsers = [];
  for (const browserType of config.browsers) {
    const browserName = browserType.name();
    const browser = await browserType.launch();
    launchedBrowsers.push({ browser, browserName });
  }
  return launchedBrowsers;
};

const prepareTests = function* (launchedBrowsers) {
  for (const { browser, browserName } of launchedBrowsers) {
    for (const { name: deviceName, deviceDescriptor } of config.devices) {
      // Omit `isMobile`: it's not supported in Firefox.
      const device =
        browserName == "firefox"
          ? omitIsMobile(deviceDescriptor)
          : deviceDescriptor;

      for (const test of testSpecs) {
        yield { browser, browserName, device, deviceName, test };
      }
    }
  }
};

const runTest = async ({
  browser,
  browserName,
  device,
  deviceName,
  test,
}): Promise<TestResult> => {
  const context = await browser.newContext({ ...device });
  const page = await context.newPage();
  await page.goto(config.baseUrl + test.relativeURL, {
    waitUntil: "networkidle",
  });
  const name = `${test.name}-${browserName}-${deviceName}`;
  const buffer = await page.screenshot({ fullPage: true });
  const result = handleScreenshot(name, buffer);
  logTestResultPreview(result);
  return result;
};

const handleScreenshot = (name, buffer): TestResult => {
  const currentPath = screenshotNameToPath(name);
  const baselinePath = screenshotNameToBaselinePath(name);
  const diffPath = screenshotNameToDiffPath(name);

  // If flagUpdateBaseline has been passed, update baseline with current
  if (config.flagUpdateBaseline) {
    fs.writeFileSync(baselinePath, buffer);
    return { name, succeeded: true, comment: `baseline updated` };
  }

  // If baseline is missing, update baseline with current
  if (!fs.existsSync(baselinePath)) {
    fs.writeFileSync(baselinePath, buffer);
    return { name, succeeded: true, comment: `baseline was missing` };
  }

  const current = PNG.sync.read(buffer);
  const baseline = PNG.sync.read(fs.readFileSync(baselinePath));
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

  if (!(result <= config.tolerance)) {
    fs.writeFileSync(currentPath, PNG.sync.write(current));
    fs.writeFileSync(diffPath, PNG.sync.write(diff));
    return {
      name,
      succeeded: false,
      comment: `diff is above ${config.tolerance}`,
    };
  }

  return {
    name,
    succeeded: true,
    comment: `diff is below ${config.tolerance}`,
  };
};

main();
