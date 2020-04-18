
import fs from 'fs';
import CLI from './cli';
import { generate } from './index';
import { CliOptions, ChangelogConfiguration } from './interfaces';
import deepmerge from './helpers/deepmerge';
import { Configuration, CONFIG } from './configuration';

const STDOUT_PATH = '-';

CLI.parse(process.argv);

(function (cli: CliOptions) {

  const cfg = new Configuration({
    target: cli.target,
    range: cli.range,
    exclude: cli.exclude,
    output: cli.output,
    repoUrl: cli.repoUrl,
    format: cli.format,
    nobody: cli.nobody,
    allowUnknown: cli.allowUnknown,
  } as ChangelogConfiguration);

  if (cli.config) {
    cfg.loadFromPath(cli.config)
  }

  const newChanges = generate(cfg.config);

  let content = '';
  let output = '';

  if (CLI.format === 'json') {
    output = cfg.config.outputJSON || '';
    // merge objects
    let currentContent: Record<string, string> | string = {};
    if (fs.existsSync(output)) {
      currentContent = fs.readFileSync(output, 'utf8');
      try {
        currentContent = JSON.parse(currentContent)
      } catch {
        // do nothing
      }
    }

    content = JSON.stringify(deepmerge(currentContent, newChanges));
  }

  if (CLI.format === 'markdown') {
    output = cfg.config.outputMarkdown || '';
    let currentContent = '';
    if (fs.existsSync(output)) {
      currentContent = fs.readFileSync(output, 'utf8');
    }
    content = newChanges + currentContent;
  }


  if (process.argv[process.argv.length - 1] === STDOUT_PATH) {
    // @ts-ignore
    return fs.writeSync(process.stdout.fd, content);
  }

  return fs.writeFileSync(output, content)
})(CLI)