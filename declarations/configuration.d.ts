import { ChangelogConfiguration } from './interfaces';
/**
 * Default configuration
 */
export declare const CONFIG: ChangelogConfiguration;
/**
 * Get access to the configration
 *
 * If needed, fetch it from changelogrc.json, package.json or create it on the fly
 */
export declare class Configuration {
    constructor(config?: ChangelogConfiguration);
    /**
     * Load external content and replace the _config
     * @param path path to file
     */
    loadFromPath(path: string): void;
    /**
     * Get config
     */
    private _config?;
    get config(): ChangelogConfiguration;
    /**
     * Get version
     */
    get version(): string;
    /**
     * Get repository
     */
    get repository(): string;
}
