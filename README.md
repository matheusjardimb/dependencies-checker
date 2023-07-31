# Dependencies Checker

<a href="https://github.com/matheusjardimb/dependencies-checker/actions"><img alt="javscript-action status" height="20" src="https://github.com/matheusjardimb/dependencies-checker/actions/workflows/test_coverage.yml/badge.svg"></a>
![badge](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/matheusjardimb/f17f5787f5b4ac05a4b5a5b73a32e446/raw/test.json)
<a href="https://img.shields.io/github/v/release/matheusjardimb/dependencies-checker"><img alt="release" height="20" src="https://img.shields.io/github/v/release/matheusjardimb/dependencies-checker"></a>
<a href="https://www.npmjs.com/package/dependencies-checker"><img src="https://badge.fury.io/js/dependencies-checker.svg" alt="npm version" height="20"></a>

Easily control when your project accepts only exact versions of dependencies.

## Usage

This lib only takes the path to the `package.json` to be checked as a param, and it will look for the current directory
when not provided.

You may customize the lib's behaviour by adding a `dependencies-checker` block to your `package.json` file, as such:

```json5
{
  "dependencies": {
    "react": "^18.2.0",
    "react-native": "0.71.2"
  },
  "devDependencies": {
    "prettier": "^2.8.8"
  },
  
  "dependencies-checker": {
    "blocks-to-check": [
      "dependencies" // Only checks this block, ignoring `devDependencies`
    ],
    "ignored-dependencies": [
      "react" // Ignores the '^' at react
    ]
  }
}
```

### GitHub actions

To use it in your GitHub project, create a workflow file like `.github/workflows/dependencies-checker.yml` with:

```yaml
name: Check for dependencies without specific version

on: [push]

jobs:
  dependency_check_job:
    runs-on: ubuntu-latest
    name: Check for dependencies without specific version
    steps:
      - uses: actions/checkout@v3
      - uses: matheusjardimb/dependencies-checker@latest
```

Add the following to specify a custom `package.json` path:

```yaml
      // ...
      - uses: matheusjardimb/dependencies-checker@latest
        with:
          packageJsonPath: 'app/package.json'
```

### Gitlab

You can use this lib into Gitlab's CI, by adding the following block to your `.gitlab-ci.yml` file:

```yaml
validate_dependencies:
  image: node:16.20.0
  script:
    - export INPUT_PACKAGEJSONPATH='package.json' # This line is optional
    - npx dependencies-checker@latest
```

### NPX

The lib is also [published into npm](https://www.npmjs.com/package/dependencies-checker), so you can use it in the shell like:

```shell
export INPUT_PACKAGEJSONPATH='package.json' # Optional
npx dependencies-checker@latest
```

## License

See more about the MIT licensing at [LICENSE.md](LICENSE.md). This project was originally created as a fork of
[github-developer/javascript-action](https://github.com/github-developer/javascript-action).

## Contributing

Pull requests are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for more. Please consider activating pre-commit before
committing (`npm run pre-commit.install`).
