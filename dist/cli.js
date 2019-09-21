#! /usr/bin/env node
"use strict";

var _index = _interopRequireDefault(require("./index"));

var _package = _interopRequireDefault(require("../package.json"));

var _path = _interopRequireDefault(require("path"));

var _chalk = _interopRequireDefault(require("chalk"));

var _tildify = _interopRequireDefault(require("tildify"));

var _yargs = _interopRequireDefault(require("yargs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  argv
} = _yargs.default.usage(`Usage: ${_chalk.default.cyan(_package.default.name, _chalk.default.underline("<dir>"))}`).demand(0, 1, _chalk.default.red("Too many directories specified.")).option("h", {
  alias: "help",
  describe: "Show help",
  type: "boolean"
}).option("v", {
  alias: "version",
  describe: "Show version",
  type: "boolean"
});

if (argv.help || argv.h) {
  _yargs.default.showHelp();

  process.exit();
}

if (argv.version || argv.v) {
  console.log(_package.default.version);
  process.exit();
}

Promise.resolve(_path.default.resolve(process.cwd(), argv._.length > 0 ? String(argv._[0]) : ".")).then(dir => {
  console.log(_chalk.default.green("Creating module..."));
  return (0, _index.default)(dir);
}).then(files => {
  files.map(_tildify.default).forEach(file => console.log(_chalk.default.green('+', file)));
  process.exit();
}).catch(err => {
  console.log(_chalk.default.red("An error occurred.", err));
  process.exit();
});