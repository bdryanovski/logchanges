import { Formater } from './formater';
import { GitCommit, JsonOutput, FormaterOptions } from '../interfaces';

export class JsonFormater extends Formater {
  private date: number = new Date().getTime();
  constructor({ config }: FormaterOptions) {
    super({ config });
  }

  render(commits: GitCommit[]): JsonOutput {
    const version = this.config.version || this.config.target || '';

    /* Output */
    const content: JsonOutput = {
      [version]: {
        version,
        date: this.date,
        changes: {},
      }
    }

    const scopes: any = {};

    commits.forEach((commit: GitCommit) => {
      const type: string = this.getType(commit);
      const category: string = commit.category;
      scopes[type] = scopes[type] || {};
      scopes[type][category] = scopes[type][category] || [];
      scopes[type][category].push(commit);
    });

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
          content[version].changes[type].changes =
            [...content[version].changes[type].changes,
              ...scopes[type][category].map((commit: GitCommit) => {
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