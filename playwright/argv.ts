import yargs from "yargs/yargs";

interface Arguments {
  [x: string]: unknown;
  updateBaseline: boolean;
  verbose: number;
}

const argv: Arguments = yargs(process.argv.slice(2))
  .option("verbose", {
    alias: "v",
    type: "count",
    description: "Run with verbose logging",
  })
  .option("updateBaseline", {
    alias: "u",
    type: "boolean",
    description: "Update baseline with screenshots from the current run",
  }).argv;

export default argv;
