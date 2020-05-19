import { ChangelogConfiguration, GitCommit, FormaterOptions, OrganizeStructure } from '../interfaces';

/**
 * Basic Formater layout
 */
export class Formater {
  public config: ChangelogConfiguration;

  constructor({ config }: FormaterOptions) {
    this.config = config;
  }

  /**
   * Create link to commit
   * @param baseUrl url
   * @param commitHash commit id
   */
  public getCommitUrl(baseUrl: string, commitHash: string): string {
    const path = baseUrl.includes('bitbucket') ? 'commits' : 'commit';

    if (baseUrl.includes('gitlab') && baseUrl.slice(-4) === '.git') {
      baseUrl = baseUrl.slice(0, -4);
    }

    return `${baseUrl}/${path}/${commitHash}`;
  };

  /**
   * Get category of the commit
   * @TODO We could optimize it here and ask only for the `type`
   *
   * @param commit GitCommit object
   *
   */
  public getType(commit: GitCommit): string {
    return this.config.types[commit.type] || this.config.allowUnknown ? commit.type : this.config.default_type;
  }

  /**
   * Render commits to any format we need
   *
   * @param commits array of commits
   */
  public render(commits: GitCommit[]): any {
    return commits;
  }

  /**
   * Organize commits into object grouped by type and category
   *
   * @param commits array of git commits
   *
   * @return OrganizeStructure
   */
  public organizeCommits(commits: GitCommit[]): OrganizeStructure {
    const scopes: any = {};

    commits.forEach((commit: GitCommit) => {
      const type: string = this.getType(commit);
      const category: string = commit.category;
      scopes[type] = scopes[type] || {};
      scopes[type][category] = scopes[type][category] || [];
      scopes[type][category].push(commit);
    });

    return scopes;
  }
}
