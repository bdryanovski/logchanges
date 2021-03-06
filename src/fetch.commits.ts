import { GitCommit, ChangelogConfiguration } from './interfaces';
import { execSync } from 'child_process';

const SEPARATOR = '===END===';
const COMMIT_PATTERN = /^([^)]*)(?:\(([^)]*?)\)|):(.*?(?:\[([^\]]+?)\]|))\s*$/;
const FORMAT = '%H%n%s%n%b%n' + SEPARATOR;

/**
 * Extract commits from git and format them in usable form
 */
export class FetchCommits {
  private options: ChangelogConfiguration;
  private commits: any;
  private revisions: string;
  constructor(options: ChangelogConfiguration) {
    this.options = options;
    let tag: string;
    let revisions: string;

    if (this.options.range) {
      tag = this.options.range;
    } else {
      try {
        tag = execSync('git describe --tags --abbrev=0', { stdio: 'pipe' }).toString().trim();
      } catch {
        tag = '';
      }
    }

    revisions = tag.includes('..') ? tag : tag ? tag + '..HEAD' : ''

    this.revisions = revisions;
  }

  /**
   * Extract commits from git based on revisions range
   *
   * @param revisions
   */
  public fetch(revisions?: string): GitCommit[] {

    this.commits = execSync(
      `git log -E --format=${FORMAT} ${revisions || this.revisions}`,
      { maxBuffer: Number.MAX_SAFE_INTEGER }
    )
      .toString()
      .split('\n' + SEPARATOR + '\n');

    if (this.commits[0] === '' || this.commits.length <= 1) {
      // tslint:disable-next-line: no-console
      console.log('No commits found');
      return [];
    }

    return this.commits.map((rawCommit: any): GitCommit | null => {
      if (!rawCommit) {
        return null;
      }

      const lines = rawCommit.split('\n');
      const commit: GitCommit = {
        type: '',
        category: '',
        hash: lines.shift(),
        subject: lines.shift(),
        body: lines.join('\n'),
      };

      const parsed = commit.subject.match(COMMIT_PATTERN);

      if (!parsed || !parsed[1] || !parsed[3]) {
        return null;
      }

      commit.type = parsed[1].toLowerCase();
      commit.category = parsed[2] || '';
      commit.subject = parsed[3];

      if (parsed[4]) {
        parsed[4].toLowerCase().split(',').forEach(function (flag: string) {
          flag = flag.trim();

          switch (flag) {
            case 'breaking':
              commit.type = flag;
              break;
          }
        });
      }

      return commit;
    })
      .filter((commit: GitCommit | null) => {
        if (!commit) {
          return false;
        }
        // drop body
        if (this.options.nobody) {
          delete commit.body
        }
        return this.options.exclude ? !this.options.exclude.includes(commit.type) : true;
      });
  }
}