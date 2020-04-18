import { GitCommit, JsonOutput, ChangelogConfiguration } from './interfaces';
/** Export interfaces */
export * from './interfaces';
/**
 *  Generate Markdown or JSON output dependent on the configuration `format`
 *
 * @param options configuration to be passed to internal methods
 */
export declare function generate(options: ChangelogConfiguration): JsonOutput | string;
/**
 * Extend changelog with custom formatter
 *
 * @param options
 * @param callback
 */
export declare function Changelog(options: ChangelogConfiguration, callback: (commits: GitCommit[], config: ChangelogConfiguration) => {}): void;
