import { ChangelogConfiguration, GitCommit, FormaterOptions } from '../interfaces';
/**
 * Basic Formater layout
 */
export declare class Formater {
    config: ChangelogConfiguration;
    constructor({ config }: FormaterOptions);
    /**
     * Create link to commit
     * @param baseUrl url
     * @param commitHash commit id
     */
    getCommitUrl(baseUrl: string, commitHash: string): string;
    /**
     * Get category of the commit
     * @TODO We could optimize it here and ask only for the `type`
     *
     * @param commit GitCommit object
     *
     */
    getType(commit: GitCommit): string;
    /**
     * Render commits to any format we need
     *
     * @param commits array of commits
     */
    render(commits: GitCommit[]): any;
}
