import { ChangelogConfiguration, PackageJsonFile } from './interfaces';
/**
 * Used to load JSON files into memory and access it
 */
export declare class PackageJSONLoader {
    private package;
    constructor(path: string);
    /**
     * Get the content of the JSON file or empty Object
     */
    getContent(): ChangelogConfiguration | PackageJsonFile;
}
