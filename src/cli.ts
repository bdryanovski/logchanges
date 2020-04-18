import CLI from 'commander';
import { CONFIG } from './configuration';

const LocalPackage: Record<string, string> = require('../package.json');

function list(val: string) {
  return val.split(',');
}

export default CLI
  .description('Generate a changelog from git commits.')
  .version(LocalPackage.version, '-v, --vers', 'output the current version')
  .option('-t, --target <target>', 'specify version ex: 2.3.52')
  .option('-c, --config <path>', 'path to changelogrc.json')
  .option('-r, --range <range>', 'generate from specific tag or range (e.g. v1.2.3 or v1.2.3..v1.2.4)')
  .option('-x, --exclude <types>', 'exclude selected commit types (comma separated)', list)
  .option('-o, --output [file]', 'file to write to, defaults to ./CHANGELOG.md, use - for stdout', CONFIG.outputMarkdown)
  .option('-u, --repo-url [url]', 'specify the repo URL for commit links, defaults to checking the package.json')
  .option('-f, --format [format]', 'specify the output format defualt is markdown', CONFIG.format)
  .option('-nb --nobody [boolean]', 'don\'t include body from commit message', CONFIG.nobody)
  .option('-a, --allow-unknown', 'allow unknown commit types', CONFIG.allowUnknown);