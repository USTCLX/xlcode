#! /usr/bin/env node

import module from './index';
import pkg from '../package.json';
import path from 'path';
import chalk from 'chalk';
import tildify from 'tildify';
import yargs from 'yargs';

const { argv } = yargs
  .usage(`Usage: ${chalk.cyan(pkg.name, chalk.underline("<dir>"))}`)
  .demand(0, 1, chalk.red("Too many directories specified."))
  .option("h", { alias: "help", describe: "Show help", type: "boolean" })
  .option("v", { alias: "version", describe: "Show version", type: "boolean" });

if (argv.help || argv.h) {
  yargs.showHelp();
  process.exit();
}

if (argv.version || argv.v) {
  console.log(pkg.version);
  process.exit();
}

Promise.resolve(
  path.resolve(process.cwd(), argv._.length > 0 ? String(argv._[0]) : ".")
).then(dir => {
  console.log(chalk.green("Creating module..."));
  return module(dir);
}).then(files => {
  files.map(tildify).forEach(file => console.log(chalk.green('+', file)));
  process.exit();
}).catch((err) => {
  console.log(chalk.red("An error occurred.", err));
  process.exit();
})