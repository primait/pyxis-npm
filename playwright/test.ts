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
import { TestDefinition, TestResult, BrowserSpec, Test } from "./types";

const testDefinitions: Array<TestDefinition> = [
  { name: "Accordion", relativeURL: "src/test/accordions.html" },
  { name: "Alertmessage", relativeURL: "src/test/alertmessage.html" },
  { name: "Badges", relativeURL: "src/test/badges.html" },
  { name: "Buttons", relativeURL: "src/test/buttons.html" },
  { name: "Containers", relativeURL: "src/test/containers.html" },
  { name: "Form", relativeURL: "src/test/form.html" },
  { name: "Hero", relativeURL: "src/test/hero.html" },
  { name: "Jumbotron", relativeURL: "src/test/jumbotron.html" },
  { name: "Links", relativeURL: "src/test/links.html" },
  { name: "List", relativeURL: "src/test/list-chooser.html" },
  { name: "Loader", relativeURL: "src/test/loader.html" },
  { name: "Messages", relativeURL: "src/test/messages.html" },
  { name: "Modal", relativeURL: "src/test/modal.html" },
  { name: "Pills", relativeURL: "src/test/pills.html" },
  { name: "Shadows", relativeURL: "src/test/shadows.html" },
  { name: "Slider", relativeURL: "src/test/slider.html" },
  { name: "Tooltip", relativeURL: "src/test/tooltip.html" },
  { name: "Typography", relativeURL: "src/test/typography.html" },
];

const main = async () => {
  // Open browsers
  const launchedBrowsers = await prepareBrowsers();

  // Enqueue tests
  const testQueue = Array.from(prepareTests(launchedBrowsers));

  // Run tests
  const results = await runVisualRegressionTests(testQueue);

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

const prepareBrowsers = async (): Promise<Array<BrowserSpec>> => {
  const browsers = await Promise.all(config.browsers.map((b) => b.launch()));
  const browserNames = config.browsers.map((b) => b.name());
  return browsers.map((browser, i) => ({
    browser,
    browserName: browserNames[i],
  }));
};

const prepareTests = function* (launchedBrowsers): Generator<Test> {
  for (const { browser, browserName } of launchedBrowsers) {
    for (const { name: deviceName, deviceDescriptor } of config.devices) {
      // Omit `isMobile`: it's not supported in Firefox.
      const device =
        browserName == "firefox"
          ? omitIsMobile(deviceDescriptor)
          : deviceDescriptor;

      for (const test of testDefinitions) {
        yield { browser, browserName, device, deviceName, test };
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

const runVisualRegressionTest = async ({
  browser,
  browserName,
  device,
  deviceName,
  test,
}: Test): Promise<TestResult> => {
  const testName = `${test.name}-${browserName}-${deviceName}`;
  try {
    const context = await browser.newContext({ ...device });
    const page = await context.newPage();
    await page.goto(config.baseUrl + test.relativeURL, {
      waitUntil: "networkidle",
      timeout: 300000, // 5 minutes
    });
    const buffer = await page.screenshot({
      fullPage: true,
      timeout: 300000, // 5 minutes
    });
    const result = handleScreenshot(testName, buffer);

    logTestResultPreview(result);
    return result;
  } catch (e) {
    console.log(testName, e);
    return { name: testName, comment: "malissimo", succeeded: false };
  }
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
