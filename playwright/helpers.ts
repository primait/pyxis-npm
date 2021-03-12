import chalk from "chalk";
import argv from "./argv";
import config from "./config";
import { Test, TestResult } from "./types";

/**
 * Cartesian product of arrays
 *
 * e.g. cartesian([1, 2], [A, B], [X]) => [[1, A], [1, B], [2, A], [2, B]]
 */
export const cartesian = <aa, bb, cc>(
  a: Array<aa>,
  b: Array<bb>,
  c: Array<cc>
): Array<[aa, bb, cc]> =>
  [a, b, c].reduce((a, b) => a.flatMap((d) => b.map((e) => [d, e].flat())));

/**
 * `console.log` wrapper which only logs when verbosity setting is appropriate
 */
export const logInfo = (...args: any[]) =>
  argv.verbose >= 0 && console.log(...args);

/**
 * `console.log` wrapper which only logs when verbosity setting is appropriate
 */
export const logDebug = (...args: any[]) =>
  argv.verbose >= 1 && console.log(chalk.gray(...args));

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
