import { Configuration } from '../src/configuration';
import { ChangelogConfiguration } from '../src/interfaces';

describe('configuration', () => {
  let config: Configuration;
  const mockPackage = `${__dirname}/mock/package.mock.json`

  beforeEach(() => {
    config = new Configuration()
    config.loadFromPath(mockPackage)
  })

  fit('should let you get version', () => {
    expect(config.version).toBe('1.0.0')
  })

  it('should let you overwrite version', () => {
    config = new Configuration({ target: '3.0.0' } as ChangelogConfiguration);
    expect(config.version).toBe('3.0.0');
  })

  it('should let you get the repository from the package.json', () => {
    expect(config.repository).toBe('https://fake.com/')
  })

  it('should let you overwrite repository', () => {
    config = new Configuration({ repoUrl: 'https://not-fake.com/' } as ChangelogConfiguration);
    expect(config.repository).toBe('https://not-fake.com/');
  })

  it('should return a configuration object', () => {
    expect(config.config).not.toBe(undefined)
  })

})