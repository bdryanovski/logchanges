import { CommanderStatic } from 'commander';
export interface FormaterOptions {
    config: ChangelogConfiguration;
}
export interface ChangelogConfiguration {
    default_type: string;
    types: {
        [type: string]: string;
    };
    dateFormat: string;
    repoUrl?: string;
    outputMarkdown: string;
    outputJSON: string;
    format?: 'markdown' | 'json';
    range?: string;
    exclude?: string;
    output?: string;
    nobody?: boolean;
    allowUnknown?: boolean;
    target?: string;
    version?: string;
}
export interface PackageJsonFile {
    version: string;
    changelog?: ChangelogConfiguration;
    repository: {
        url: string;
    };
}
export interface CliOptions extends CommanderStatic {
    target?: string;
    config?: string;
    range?: string;
    exclude?: string;
    output?: string;
    repoUrl?: string;
    format?: 'markdown' | 'json';
    nobody?: boolean;
    allowUnknown?: boolean;
}
export interface ChangeEntry {
    hash: string;
    subject: string;
    body: string;
}
export interface JsonOutput {
    [key: string]: {
        date: number;
        version: string;
        changes: {
            [key: string]: {
                description: string;
                changes: ChangeEntry[];
            };
        };
    };
}
export interface GitCommit {
    hash: string;
    subject: string;
    body?: string;
    type: string;
    category: string;
    githubLink?: string;
}
