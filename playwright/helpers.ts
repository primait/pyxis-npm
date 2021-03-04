import chalk from "chalk";
import config from "./config";
import { TestResult } from "./types";

export const omitIsMobile = (descriptor) => {
  const { isMobile, ...other } = descriptor;
  return other;
};

export const screenshotNameToPath = (name) =>
  `${config.screenshotsPath}${name}.png`;

export const screenshotNameToBaselinePath = (name) =>
  `${config.screenshotsPath}${name}.baseline.png`;

export const screenshotNameToDiffPath = (name) =>
  `${config.screenshotsPath}${name}.diff.png`;

export const logTestResult = (result: TestResult) => {
  if (result.succeeded) {
    console.log(chalk.green("✓", result.name), result.comment);
  } else {
    console.log(chalk.red("✗", result.name), result.comment);
  }
};

export const logTestResultPreview = (result: TestResult) => {
  if (result.succeeded) {
    process.stdout.write(chalk.green("✓"));
  } else {
    process.stdout.write(chalk.red("✗"));
  }
};
