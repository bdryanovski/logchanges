import { Formater } from './formater';
import { GitCommit, FormaterOptions } from '../interfaces';
/**
 * Markdown Foramter
 */
export declare class MarkdownFormater extends Formater {
    constructor({ config }: FormaterOptions);
    /**
     * Markdown render
     *
     * @param commits array of git commits
     */
    render(commits: GitCommit[]): string;
}
