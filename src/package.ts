import fs from 'fs';
import { ChangelogConfiguration, PackageJsonFile } from './interfaces';

/**
 * Used to load JSON files into memory and access it
 */
export class PackageJSONLoader {
  private package: ChangelogConfiguration | PackageJsonFile = {} as ChangelogConfiguration;
  constructor(path: string) {
    if (path && fs.existsSync(path)) {
      this.package = require(path);
    }
  }

  /**
   * Get the content of the JSON file or empty Object
   */
  public getContent() {
    return this.package || {};
  }
}