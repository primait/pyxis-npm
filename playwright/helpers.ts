import chalk from "chalk";
import argv from "./argv";
import config from "./config";
import { Test, TestResult } from "./types";

/**
 * `console.log` wrapper which only logs when verbosity setting is appropriate
 */
export const logInfo = (...args: any[]) =>
  argv.verbose >= 0 && console.log(args);

/**
 * `console.log` wrapper which only logs when verbosity setting is appropriate
 */
export const logDebug = (...args: any[]) =>
  argv.verbose >= 1 && console.log(args);

/**
 * Omit `isMobile` from a device descriptor: it's not supported in Firefox.
 */
export const omitIsMobile = (deviceDescriptor) => {
  const { isMobile, ...other } = deviceDescriptor;
  return other;
};

export const testToURL = (test: Test) => {
  return config.baseUrl + test.testDefinition.relativeURL;
};

export const testToName = (test: Test) =>
  `${test.testDefinition.name}/${test.browserName}-${test.deviceName}`;

export const testToPath = (test: Test) =>
  `${config.screenshotsPath}${test.testDefinition.name}/${test.browserName}-${test.deviceName}.png`;

export const testToBaselinePath = (test: Test) =>
  `${config.screenshotsPath}${test.testDefinition.name}/${test.browserName}-${test.deviceName}.baseline.png`;

export const testToDiffPath = (test: Test) =>
  `${config.screenshotsPath}${test.testDefinition.name}/${test.browserName}-${test.deviceName}.diff.png`;

export const logTestResult = (result: TestResult) =>
  result.succeeded ? logTestSuccess(result) : logTestFailure(result);

const logTestSuccess = (result: TestResult) =>
  logInfo(`${chalk.green("✓", result.name)} ${result.comment}`);

const logTestFailure = (result: TestResult) =>
  logInfo(`${chalk.red("✗", result.name)}, ${result.comment}`);

const GREEN_MARK = chalk.green("✓");
const RED_CROSS = chalk.red("✗");

export const logTestResultPreview = (result: TestResult) => {
  process.stdout.write(result.succeeded ? GREEN_MARK : RED_CROSS);
};
