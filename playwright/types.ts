import { Browser, BrowserContext } from "playwright";

/**
 * The definition for a visual regression test.
 *
 * In the future, this may specify a custom number of timeouts / retries
 */
export interface TestDefinition {
  name: String;
  relativeURL: String;
}

/**
 * A test that's ready to be executed
 */
export interface PreparedTest {
  browser: Browser;
  browserName: String;
  context: BrowserContext;
  deviceName: String;
  testDefinition: TestDefinition;
}

export interface TestResult {
  name: String;
  succeeded: boolean;
  comment: String;
}

/**
 * Contains a _launched_ browser and its name
 */
export interface BrowserSpec {
  browser: Browser;
  browserName: String;
}
