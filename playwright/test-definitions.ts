import { TestDefinition } from "./types";

/**
 * The list of routes for which we need to measure visual regressions
 */
const TEST_DEFINITIONS: Array<TestDefinition> = [
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
];

export default TEST_DEFINITIONS;
