import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import config from "./config";

const fs = require("fs");

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

const omitIsMobile = (descriptor) => {
  const { isMobile, ...other } = descriptor;
  return other;
};

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
        await page.goto(config.baseUrl + test.relativeURL);
        const name = `${test.name}-${browserName}-${deviceName}`;
        const buffer = await page.screenshot({ fullPage: true });
        handleScreenshot(name, buffer);
      }
    }
    await browser.close();
  }
})();

const screenshotNameToPath = (name) => `${config.screenshotsPath}${name}.png`;
const screenshotNameToBaselinePath = (name) =>
  `${config.screenshotsPath}${name}.baseline.png`;
const screenshotNameToDiffPath = (name) =>
  `${config.screenshotsPath}${name}.diff.png`;

const handleScreenshot = (name, buffer): Boolean => {
  const currentPath = screenshotNameToPath(name);
  const baselinePath = screenshotNameToBaselinePath(name);
  const diffPath = screenshotNameToDiffPath(name);

  // If baseline is missing, current becomes baseline
  if (!fs.existsSync(baselinePath)) {
    fs.writeFileSync(baselinePath, buffer);
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

  const testPassed = result <= config.tolerance;
  if (!testPassed) {
    fs.writeFileSync(currentPath, PNG.sync.write(current));
    fs.writeFileSync(diffPath, PNG.sync.write(diff));
  }
  return testPassed;
};
