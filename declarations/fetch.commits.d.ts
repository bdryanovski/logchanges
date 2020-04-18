import { GitCommit, ChangelogConfiguration } from './interfaces';
/**
 * Extract commits from git and format them in usable form
 */
export declare class FetchCommits {
    private options;
    private commits;
    private revisions;
    constructor(options: ChangelogConfiguration);
    /**
     * Extract commits from git based on revisions range
     *
     * @param revisions
     */
    fetch(revisions?: string): GitCommit[];
}
