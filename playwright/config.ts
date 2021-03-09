import { chromium, devices, firefox, webkit } from "playwright";

interface Config {
  baseUrl: string;
  browsers: Array<any>;
  deviceDefinitions: Array<any>;
  fullSuiteRuntimeEstimate: number;
  pixelmatchThreshold: number;
  screenshotsPath: string;
  timeoutBeforeScreenshot: number;
}

const deviceNames = [
  "iPhone 8",
  "iPhone X",
  "iPad (gen 7)",
  "iPad Pro 11",
  "Galaxy S5",
  "Pixel 2 XL",
  "Nexus 10",
];

const config: Config = {
  baseUrl: "http://0.0.0.0:8080/",
  browsers: [chromium, firefox, webkit],
  deviceDefinitions: deviceNames.map((deviceName) => ({
    name: deviceName,
    device: devices[deviceName],
  })),
  fullSuiteRuntimeEstimate: 600000, // 10min in ms, should be longer than the sane-case runtime for the whole test suite
  pixelmatchThreshold: 0.1,
  screenshotsPath: "screenshots/",
  timeoutBeforeScreenshot: 10000, // 10s in ms, time to wait after page load before taking a screenshot
};

export default config;
