# Exact dependency checker

<a href="https://github.com/matheusjardimb/js-exact-dependency-action/actions"><img alt="javscript-action status" height="20" src="https://github.com/matheusjardimb/js-exact-dependency-action/actions/workflows/test_coverage.yml/badge.svg"></a>
<a href="https://img.shields.io/github/v/release/matheusjardimb/js-exact-dependency-action"><img alt="release" height="20" src="https://img.shields.io/github/v/release/matheusjardimb/js-exact-dependency-action"></a>
![badge](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/matheusjardimb/f17f5787f5b4ac05a4b5a5b73a32e446/raw/test.json)
<a href="https://www.npmjs.com/package/exact-dependency-checker"><img src="https://badge.fury.io/js/exact-dependency-checker.svg" alt="npm version" height="20"></a>

Easily control when your project accepts only exact versions of dependencies.

## Usage

## Customizing
```json
{
  "exactDependencyChecker": {
    "blocksToCheck": [
      "dependencies",
      "devDependencies"
    ],
    "ignoredDependencies": [
      "husky",
      "jest"
    ]
  }
}
```

### GitHub actions

This action only takes one parameter: the path to the `package.json` file to be checked. This param is
optional, and the `exact-dependency-checker` will look for the file in the same directory it runs.

```yaml
uses: matheusjardimb/js-exact-dependency-action@v1.0.0
```

Example specifying a custom path to `package.json`:

```yaml
uses: matheusjardimb/js-exact-dependency-action@v1.0.0
with:
  packageJsonPath: 'app/package.json'
```

### Gitlab

```yaml
image: node:16.20.0

validate_dependencies:
  script:
    - export INPUT_PACKAGEJSONPATH='package.json' # Optional
    - npx exact-dependency-checker@0.5.0
```

### NPX

```shell
export INPUT_PACKAGEJSONPATH='package.json' # Optional
npx exact-dependency-checker@0.4.3
```

## License

See more about the MIT licensing at [LICENSE.md](LICENSE.md). This project was originally created as a fork of
[github-developer/javascript-action](https://github.com/github-developer/javascript-action).

## Contributing

Pull requests are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for more. Please consider activating pre-commit before
committing (`npm run pre-commit.install`).
