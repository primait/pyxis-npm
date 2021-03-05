import { Browser, BrowserContext } from "playwright";

export interface TestDefinition {
  name: String;
  relativeURL: String;
}
export interface Test {
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

export interface BrowserSpec {
  browser: Browser;
  browserName: String;
}
