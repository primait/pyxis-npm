import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import fs from "fs";
import config from "./config";
import {
  logFailure,
  logSuccess,
  omitIsMobile,
  screenshotNameToBaselinePath,
  screenshotNameToDiffPath,
  screenshotNameToPath,
} from "./helpers";

interface Test {
  name: String;
  relativeURL: String;
}

const tests: Array<Test> = [
  {
    name: "Accordion",
    relativeURL: "src/test/accordions.html",
  },
];

let allTestsSucceeded = true;

(async () => {
  for (const browserType of config.browsers) {
    const browserName = browserType.name();
    const browser = await browserType.launch();

    for (const { name: deviceName, deviceDescriptor } of config.devices) {
      // Omit `isMobile`: it's not supported in Firefox.
      const device =
        browserName == "firefox"
          ? omitIsMobile(deviceDescriptor)
          : deviceDescriptor;

      const context = await browser.newContext({ ...device });
      const page = await context.newPage();

      for (const test of tests) {
        await page.goto(config.baseUrl + test.relativeURL, {
          waitUntil: "networkidle",
        });
        const name = `${test.name}-${browserName}-${deviceName}`;
        const buffer = await page.screenshot({ fullPage: true });
        const testSucceeded = handleScreenshot(name, buffer);
        allTestsSucceeded &&= testSucceeded;
      }
    }
    await browser.close();
  }

  // Exit with a meaningful UNIX exit status
  process.exit(allTestsSucceeded ? 0 : 1);
})();

const handleScreenshot = (name, buffer): boolean => {
  const currentPath = screenshotNameToPath(name);
  const baselinePath = screenshotNameToBaselinePath(name);
  const diffPath = screenshotNameToDiffPath(name);

  // If flagUpdateBaseline has been passed, update baseline with current
  if (config.flagUpdateBaseline) {
    fs.writeFileSync(baselinePath, buffer);
    logSuccess(`${name} baseline updated`);
    return true;
  }

  // If baseline is missing, update baseline with current
  if (!fs.existsSync(baselinePath)) {
    fs.writeFileSync(baselinePath, buffer);
    logSuccess(`${name} baseline was missing`);
    return true;
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
    logFailure(`${name} diff is above ${config.tolerance}`);
    return false;
  }

  logSuccess(`${name} diff is below ${config.tolerance}`);
  return true;
};
