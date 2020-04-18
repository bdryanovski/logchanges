import fs from 'fs';
import { ChangelogConfiguration, PackageJsonFile } from './interfaces';

export class PackageJSONLoader {
  private package: ChangelogConfiguration | PackageJsonFile = {} as ChangelogConfiguration;
  constructor(path: string) {
    if (path && fs.existsSync(path)) {
      this.package = require(path);
    }
  }

  public getContent() {
    return this.package;
  }
}