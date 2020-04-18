# LogChanges
Opinionated changelog creation tool based on git commits and history.

## Getting started

### Installation

```bash
npm install logchanges@latest -g
```

### Usage

```bash
logchanges
```

As part of the `npm version` cycle to update changelog.

```json
// package.json
 ...
 "scripts": {
    "preversion": "logchanges && git add CHANGELOG.md && git commit -s -S -m 'chore: update CHANGELOG.md'"
 }
 ...
```

#### Versioning

If no version is set the version from the `package.json` will be taken as latest, there is a way to overwrite it if needed.

```bash
logchanges --target 2.3.5
```


#### Configuration
There are two ways to configure

Inside the `package.json` file as part of `changelog` section.

```json
{
  "changelog": {
    // configuration
  }
}
```

Or by creating `changelogrc.json` file inside the root folder.

```json
// changelogrc.json
{
  // configuration
}
```

There is also a option to set a path to json configuration

```bash
logchanges --config ./config/changelogrc.json
```

Configure some of the description of the categories or the date format used into the Markdown.

```js
// Default configuration
{
  // Unknown categories will be under the `other` scope/category
  default_type: 'other',
  // Default supported category
  types: {
    breaking: 'Breaking Changes',
    build: 'Build System / Dependencies',
    ci: 'Continuous Integration',
    chore: 'Chores',
    docs: 'Documentation Changes',
    feat: 'New Features',
    fix: 'Bug Fixes',
    other: 'Other Changes',
    perf: 'Performance Improvements',
    refactor: 'Refactors',
    revert: 'Reverts',
    style: 'Code Style Changes',
    test: 'Tests'
  },
  // Markdown date format used into the render
  dateFormat: 'mmmm d, yyyy',
  // Default output file when format is Markdown
  outputMarkdown: 'CHANGELOG.md',
  // Default output file when format is JSON
  outputJSON: 'changelog.json'
  // Default format
  format: 'markdown',
  // Specific range
  range: undefined,
  // Exclude commits
  exclude: '',
  // Output location starting from root
  output: undefined,
  // Repo URL
  repoUrl: '',
  // Exclude commit body drom output
  nobody: false,
  // Allow unknown categories
  allowUnknown: false,
}
```

#### Link to repos
If you add `--repo-url` as param the generated output will include links to online version of the commits like Github, Bitbucket and Gitlab.

```bash
logchanges --repo-url http://my.custom.repo/commits
```

Will result in

 * fix bug in code ([af4s1as](http://my.custom.repo/commits/af4s1as))

Default will be get from `package.json` repo settings.

#### Formating
The default format is Markdown. But there are additional option like JSON.

```bash
logchanges --format json
```

#### Output
By default the output will be to `CHANGELOG.md` or if format is selected to JSON to `changelog.json`. To change this you could use the `--output` flag.

```bash
logchanges --output PROJECT_CHANGELOG.md
```

In case that there is need to not write to disk and pipe the output to another command you could use `-`

```bash
logchanges -
```

#### Help
For more information check `--help`

```bash
$ logchanges --help

Usage: logchanges [options]

Generate a changelog from git commits.

Options:
  -V, --version           output the version number
  -t, --target <version>  specify version
  -c, --config <path>     path to changelogrc.json
  -r, --range <range>     generate from specific tag or range (e.g. v1.2.3 or v1.2.3..v1.2.4)
  -x, --exclude <types>   exclude selected commit types (comma separated)
  -o, --output [file]     file to write to, defaults to ./CHANGELOG.md, use - for stdout (default: "CHANGELOG.md")
  -u, --repo-url [url]    specify the repo URL for commit links, defaults to checking the package.json
  -f, --format [format]   specify the output format defualt is markdown (default: "markdown")
  -nb --nobody [boolean]  ignore the body from commit message
  -a, --allow-unknown     allow unknown commit types
  -h, --help              display help for command
```

## Extending Foramter

```ts
import { Changelog, Formater, GitCommit, CliOptions, ChangelogConfiguration } from 'logchanges'

class ArrayFormater extends Formater {
  constructor({ config: ChangelogConfiguration }) {
    super(config);
  }

  render(commits: GitCommit[]): GitCommit[] {
    // Get commits and tranfsorm them as you will
    return commits;
  }
}

const options: ChangelogConfiguration = {
  range: '282522f5...86a82ff5'
}

Changelog(options, (commits: GitCommit[], cfg: ChangelogConfiguration) => {
  const format = new ArrayFormater(cfg.config)

  console.log(format.render(commits))
})
```

## Generate historical data

Use `--range` to set start and end of the history and `--target` to set version number
```bash
logchanges --range a811712..HEAD --target 2.0.5
```

This could be automated by going over the tags and creating ranges to be scrapped.

```bash
#!/bin/bash

tags=(`git tag --sort=creatordate`);

for ((i=0; i < ${#tags[@]}; ++i))
do
  a=${tags[i]}
  b=${tags[i+1]}
  t=${tags[i+1]}

  if test -z $b
  then
    # if you need to get logs including latest chnages uncomment the two lines
    # below and remove the exit(0)
    # b="HEAD"
    # t=$a
    # Don't create log for latest changes
    exit(0)
  fi

  logchanges --range ${a}...${b} --target ${t} --nobody --allow-unknown
done
```

This will result in similar to this

```bash
logchanges --range v1.0.1...v1.0.2 --target v1.0.2 --nobody --allow-unknown
logchanges --range v1.0.2...v1.0.3 --target v1.0.3 --nobody --allow-unknown
...
```

## Roadmap
See the [open issues](https://github.com/bdryanovski/logchanges/issues) for a list of proposed features (and known issues).

## Contributing

1. Fork it (<https://github.com/bdryanovski/logchanges/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details