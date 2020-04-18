import { CliOptions, ChangelogConfiguration, GitCommit, FormaterOptions } from '../interfaces';

export class Formater {
  public config: ChangelogConfiguration;

  constructor({ config }: FormaterOptions) {
    this.config = config;
  }

  public getCommitUrl(baseUrl: string, commitHash: string): string {
    let urlCommitName = 'commit';

    if (baseUrl.indexOf('bitbucket') !== -1) {
      urlCommitName = 'commits';
    }

    if (baseUrl.indexOf('gitlab') !== -1 && baseUrl.slice(-4) === '.git') {
      baseUrl = baseUrl.slice(0, -4);
    }

    return `${baseUrl}/${urlCommitName}/${commitHash}`;
  };

  public getType(commit: GitCommit): string {
    return this.config.types[commit.type] || this.config.allowUnknown ? commit.type : this.config.default_type;
  }

  public render(commits: GitCommit[]): any {
    return '';
  }
}
