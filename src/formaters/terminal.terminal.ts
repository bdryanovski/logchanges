import { Formater } from './formater';
import { GitCommit, TerminalOutput, FormaterOptions } from '../interfaces';

/**
 * Terminal Formater
 */
export class TerminalFormater extends Formater {
  constructor({ config }: FormaterOptions) {
    super({ config });
  }

  /**
   * Render JSON output
   *
   * @param commits array of git commits
   */
  render(commits: GitCommit[]): TerminalOutput {
    const version = this.config.version || this.config.target || '';
    let output = "\n";

    output += `version: ${version} \n`

    // @TODO this could be done into helper function (scopes)
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

        output += `\n  ${typeDescription} (${type}):\n`;

        Object.keys(scopes[type]).forEach((category) => {
          scopes[type][category].forEach((entry: any) => {
            output += `\t${(entry['hash'] || '').substring(0, 8)} - ${entry['subject'].trim()}\n`
          })
        })
      });

    output +="\n"
    return output;
  }
}