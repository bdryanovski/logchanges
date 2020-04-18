import dateformat from 'dateformat';
import { Formater } from './formater';
import { GitCommit, FormaterOptions } from '../interfaces';

export class MarkdownFormater extends Formater {
  constructor({ config }: FormaterOptions) {
    super({ config });
  }

  render(commits: GitCommit[]): string {
    const version = this.config.version || this.config.target || '';
    const content: string[] = [];
    const date = dateformat(new Date(), this.config.dateFormat);
    let heading = '';

    heading = '##';

    if (version) {
      heading += ` ${version} (${date})`;
    } else {
      heading += date.toString();
    }

    content.push(heading);
    content.push('');

    const types: any = {};

    commits.forEach((commit: GitCommit) => {
      const type: string = this.getType(commit);
      const category: string = commit.category;
      types[type] = types[type] || {};
      types[type][category] = types[type][category] || [];
      types[type][category].push(commit);
    });

    Object.keys(types).sort().forEach((type: string) => {
      let typeDescription = this.config.types[type];

      if (!typeDescription && this.config.allowUnknown) {
        typeDescription = `${this.config.types.other} (${type})`;
      }

      content.push('##### ' + typeDescription);
      content.push('');

      Object.keys(types[type]).forEach((category: string) => {
        let prefix = '*';
        const nested = types[type][category].length > 1;
        const categoryHeading = prefix + (category ? ' **' + category + ':**' : '');

        if (nested && category) {
          content.push(categoryHeading);
          prefix = '  *';
        } else {
          prefix = categoryHeading;
        }

        types[type][category].forEach((commit: GitCommit) => {
          let shorthash = commit.hash.substring(0, 8);
          const subject = commit.subject;

          if (this.config.repoUrl) {
            shorthash = `[${shorthash}](${this.getCommitUrl(this.config.repoUrl, commit.hash)})`;
          }

          content.push(`${prefix} ${subject} (${shorthash})`);

          if (commit.body) {
            content.push(`\n${nested ? '  ' : ''}${commit.body}`);
          }

        });
      });


      content.push('');
    });

    content.push('');

    return content.join('\n');
  }
}