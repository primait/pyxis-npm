import yargs from "yargs/yargs";

interface Arguments {
  [x: string]: unknown;
  poolSize: number;
  testFilter: string;
  updateBaseline: boolean;
  verbose: number;
}

const argv: Arguments = yargs(process.argv.slice(2))
  .option("poolSize", {
    type: "number",
    default: 16,
    description: "Number of maximum concurrent test runs",
  })
  .option("testFilter", {
    alias: "t",
    default: "",
    type: "string",
    description:
      "If a test name doesn't include the given string, it won't be run",
  })
  .option("updateBaseline", {
    alias: "u",
    type: "boolean",
    description: "Update baseline with screenshots from the current run",
  })
  .option("verbose", {
    alias: "v",
    type: "count",
    description: "Run with verbose logging",
  }).argv;
export default argv;
