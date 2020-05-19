import { Formater } from './formater';
import { GitCommit, JsonOutput, FormaterOptions } from '../interfaces';

/**
 * JSON Formater
 */
export class JsonFormater extends Formater {
  constructor({ config }: FormaterOptions) {
    super({ config });
  }

  /**
   * Render JSON output
   *
   * @param commits array of git commits
   */
  render(commits: GitCommit[]): JsonOutput {
    const version = this.config.version || this.config.target || '';

    /* Output */
    const content: JsonOutput = {
      [version]: {
        version,
        date: new Date().getTime(),
        changes: {},
      }
    }

    const scopes = this.organizeCommits(commits);

    Object.keys(scopes)
      .sort()
      .forEach((type: string) => {
        let typeDescription: string = this.config.types[type];

        if (!typeDescription && this.config.allowUnknown) {
          typeDescription = `${this.config.types.other} (${type})`;
        }

        content[version].changes[type] = {
          description: typeDescription,
          changes: []
        };

        // category
        Object.keys(scopes[type]).forEach((category: string) => {
          // @ts-ignore
          content[version].changes[type].changes =
            [
              ...content[version].changes[type].changes,
              ...scopes[type][category].map((commit: GitCommit): GitCommit => {
                  commit.hash = commit.hash.substring(0, 8);
                  if (this.config.repoUrl) {
                    commit.githubLink = this.getCommitUrl(this.config.repoUrl, commit.hash);
                  }
                  return commit;
                })
            ];
        });
      });

    return content;
  }
}