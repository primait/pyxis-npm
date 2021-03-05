import chalk from "chalk";
import { Page } from "playwright";
import config from "./config";
import { Test, TestResult } from "./types";

export const omitIsMobile = (descriptor) => {
  const { isMobile, ...other } = descriptor;
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

export const logTestResult = (result: TestResult) => {
  if (result.succeeded) {
    console.log(chalk.green("✓", result.name), result.comment);
  } else {
    console.log(chalk.red("✗", result.name), result.comment);
  }
};

const GREEN_MARK = chalk.green("✓");
const RED_CROSS = chalk.red("✗");

export const logTestResultPreview = (result: TestResult) => {
  process.stdout.write(result.succeeded ? GREEN_MARK : RED_CROSS);
};

/**
 * Disable animations (they make visual regression tests non-reproducible)
 */
export const disableAnimationsOnPage = async (page: Page) => {
  await page.addStyleTag({
    content: `

*,
*::before,
*::after {
  -moz-transition: none !important;
  transition: none !important;
  -moz-animation: none !important;
  animation: none !important;
}

#jsCookies {
  display: none!important;
}

svg,
img,
#waves,
#jsTrustpilotRoot,
#jsSocietyTypewriterCaret,
.clock-header__clock,
.a-trustpilotWidget,
.plate-number__wrapper.is-fixed {
    visibility: hidden!important;
}

.o-jumbotron--animatedBg {
    background-image: none!important;
}

.footer {
    position: relative!important;
}
`,
  });
};
