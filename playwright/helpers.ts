import chalk from "chalk";
import config from "./config";

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

export const logSuccess = (string: String) => {
  console.log(chalk.green(string));
};

export const logFailure = (string: String) => {
  console.log(chalk.red(string));
};
