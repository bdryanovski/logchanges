import { ChangelogConfiguration, GitCommit, FormaterOptions } from '../interfaces';

export class Formater {
  public config: ChangelogConfiguration;

  constructor({ config }: FormaterOptions) {
    this.config = config;
  }

  public getCommitUrl(baseUrl: string, commitHash: string): string {
    const path = baseUrl.includes('bitbucket') ? 'commits' : 'commit';

    if (baseUrl.includes('gitlab') && baseUrl.slice(-4) === '.git') {
      baseUrl = baseUrl.slice(0, -4);
    }

    return `${baseUrl}/${path}/${commitHash}`;
  };

  public getType(commit: GitCommit): string {
    return this.config.types[commit.type] || this.config.allowUnknown ? commit.type : this.config.default_type;
  }

  public render(commits: GitCommit[]): any {
    return commits;
  }
}
