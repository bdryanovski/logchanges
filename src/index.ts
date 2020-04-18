import { FetchCommits } from './fetch.commits';
import { MarkdownFormater } from './formaters/markdown.formater';
import { JsonFormater } from './formaters/json.formater';
import { GitCommit, JsonOutput, ChangelogConfiguration } from './interfaces';
import { Configuration } from './configuration';

export function generate(options: ChangelogConfiguration): JsonOutput | string {
  const config = (new Configuration(options)).config;
  const commits = (new FetchCommits(options)).fetch();

  if (options.format === 'json') {
    return (new JsonFormater({ config })).render(commits)
  }

  return (new MarkdownFormater({ config })).render(commits)

}

export function Changelog(options: ChangelogConfiguration, callback: (commits: GitCommit[], config: ChangelogConfiguration) => {}): void {
  const cfg = new Configuration(options);
  const commits = (new FetchCommits(options)).fetch();
  callback(commits, cfg.config);
}