import { Formater } from './formater';
import { GitCommit, JsonOutput, FormaterOptions } from '../interfaces';
/**
 * JSON Formater
 */
export declare class JsonFormater extends Formater {
    constructor({ config }: FormaterOptions);
    /**
     * Render JSON output
     *
     * @param commits array of git commits
     */
    render(commits: GitCommit[]): JsonOutput;
}
