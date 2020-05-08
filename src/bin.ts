
import fs from 'fs';
import CLI from './cli';
import { generate } from './index';
import { CliOptions, ChangelogConfiguration, JsonOutput } from './interfaces';
import merge from './helpers/merge';
import { Configuration } from './configuration';

const STDOUT_PATH = '-';

CLI.parse(process.argv);

/**
 * Get and run task based on the CLI props
 */
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

  let content = '';
  let output = '';

  if (CLI.format === 'json') {
    output = cli.output || cfg.config.outputJSON || '';
    // merge objects
    let currentContent: Record<string, string> = {};
    let currentString = '{}'
    if (fs.existsSync(output)) {
      currentString = fs.readFileSync(output, 'utf8');
      try {
        currentContent = JSON.parse(currentString)
      } catch {
        // do nothing
      }
    }

    content = JSON.stringify(merge(currentContent, generate(cfg.config) as JsonOutput));
  }

  if (CLI.format === 'markdown') {
    output = cli.output || cfg.config.outputMarkdown || '';
    let currentContent = '';
    if (fs.existsSync(output)) {
      currentContent = fs.readFileSync(output, 'utf8');
    }
    content = generate(cfg.config) as string + currentContent;
  }


  if (process.argv[process.argv.length - 1] === STDOUT_PATH) {
    // @ts-ignore
    return fs.writeSync(process.stdout.fd, content);
  }

  return fs.writeFileSync(output, content)
})(CLI)