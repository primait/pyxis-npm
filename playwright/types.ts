export interface TestSpec {
  name: String;
  relativeURL: String;
}

export interface TestResult {
  name: String;
  succeeded: boolean;
  comment: String;
}
