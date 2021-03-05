import { chromium, devices, firefox, webkit } from "playwright";
import { TestDefinition } from "./types";

const deviceNames = [
  "iPhone 8",
  "iPhone X",
  "iPad (gen 7)",
  "iPad Pro 11",
  "Galaxy S5",
  "Pixel 2 XL",
  "Nexus 10",
];

const flagUpdateBaseline =
  process.argv.includes("-u") || process.argv.includes("--update-baseline");

const config: {
  baseUrl: string;
  browsers: Array<any>;
  deviceDefinitions: Array<any>;
  flagUpdateBaseline: boolean;
  timeoutBeforeScreenshot: number;
  screenshotsPath: string;
  testDefinitions: Array<TestDefinition>;
  threshold: number;
  worstCaseTimeout: number;
} = {
  baseUrl: "http://0.0.0.0:8080/",
  browsers: [chromium, firefox, webkit],
  deviceDefinitions: deviceNames.map((deviceName) => ({
    name: deviceName,
    device: devices[deviceName],
  })),
  flagUpdateBaseline,
  timeoutBeforeScreenshot: 10000, // 10s in ms, time to wait after page load before taking a screenshot
  screenshotsPath: "screenshots/",
  testDefinitions: [
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
  ],
  threshold: 0.1, // Pixelmatch threshold
  worstCaseTimeout: 600000, // 10min in ms, should be longer than the sane-case runtime for the whole test suite
};

export default config;
