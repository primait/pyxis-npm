import chalk from "chalk";
import argv from "./argv";
import config from "./config";
import { PreparedTest, TestResult } from "./types";

/**
 * Cartesian product of 3 arrays
 *
 * e.g. cartesian([1, 2], [A, B], [X]) => [[1, A, X], [1, B, X], [2, A, X], [2, B, X]]
 *
 * I was unable to use the cool one-liner flatMap version because I couldn't reliably type it.
 */
export function* cartesian3Product<t0, t1, t2>(
  a: Array<t0>,
  b: Array<t1>,
  c: Array<t2>
): Generator<[t0, t1, t2]> {
  for (const ax of a) {
    for (const bx of b) {
      for (const cx of c) {
        yield [ax, bx, cx];
      }
    }
  }
}

/**
 * `console.log` wrapper which always logs, in red.
 */
export const logError = (...args: any[]) => console.log(chalk.red(...args));

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

export const testToURL = (test: PreparedTest) => {
  return config.baseUrl + test.testDefinition.relativeURL;
};

export const testToName = (test: PreparedTest) =>
  `${test.testDefinition.name}/${test.browserName}-${test.deviceName}`;

export const testToPath = (test: PreparedTest) =>
  `${config.screenshotsPath}${test.testDefinition.name}/${test.browserName}-${test.deviceName}.png`;

export const testToBaselinePath = (test: PreparedTest) =>
  `${config.screenshotsPath}${test.testDefinition.name}/${test.browserName}-${test.deviceName}.baseline.png`;

export const testToDiffPath = (test: PreparedTest) =>
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
