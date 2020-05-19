import { FetchCommits } from './fetch.commits';
import { MarkdownFormater } from './formaters/markdown.formater';
import { JsonFormater } from './formaters/json.formater';
import { TerminalFormater } from './formaters/terminal.terminal';
import { GitCommit, JsonOutput, ChangelogConfiguration } from './interfaces';
import { Configuration } from './configuration';

/** Export interfaces */
export * from './interfaces';

/**
 *  Generate Markdown or JSON output dependent on the configuration `format`
 *
 * @param options configuration to be passed to internal methods
 */
export function generate(options: ChangelogConfiguration): JsonOutput | string {
  const config = (new Configuration(options)).config;
  const commits = (new FetchCommits(options)).fetch();

  if (options.format === 'json') {
    return (new JsonFormater({ config })).render(commits)
  }

  if (options.format === 'terminal') {
    return (new TerminalFormater({ config })).render(commits)
  }

  return (new MarkdownFormater({ config })).render(commits)

}

/**
 * Extend changelog with custom formatter
 *
 * @param options
 * @param callback
 */
export function Changelog(options: ChangelogConfiguration, callback: (commits: GitCommit[], config: ChangelogConfiguration) => {}): void {
  const cfg = new Configuration(options);
  const commits = (new FetchCommits(options)).fetch();
  callback(commits, cfg.config);
}