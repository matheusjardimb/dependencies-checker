# :white_check_mark: Dependencies Checker

<a href="https://github.com/matheusjardimb/dependencies-checker/actions"><img alt="javscript-action status" height="20" src="https://github.com/matheusjardimb/dependencies-checker/actions/workflows/test_coverage.yml/badge.svg"></a>
![badge](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/matheusjardimb/f17f5787f5b4ac05a4b5a5b73a32e446/raw/test.json)
<a href="https://img.shields.io/github/v/release/matheusjardimb/dependencies-checker"><img alt="release" height="20" src="https://img.shields.io/github/v/release/matheusjardimb/dependencies-checker"></a>
<a href="https://www.npmjs.com/package/dependencies-checker"><img src="https://badge.fury.io/js/dependencies-checker.svg" alt="npm version" height="20"></a>

Easily control the versions of dependencies your project accepts. Why?

- :handshake: **Consistency**: Guarantees to use the exact same versions everywhere.
- :bug: **Avoid bugs**: Make sure there are no duplicate entries in your dependencies.
- :gear: **Automation**: Automatically rejects PRs when conditions are not met.

## Usage

The lib only takes the path to the `package.json` as a param. It will default to the current directory
when not provided.

### GitHub actions

Create a file `.github/workflows/dependencies-checker.yml` with:

```yaml
name: Check for dependencies without specific version

on: [ push ]

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
      - uses: matheusjardimb/dependencies-checker@latest
        with:
          packageJsonPath: 'app/package.json'
          quiet: true
```

### Gitlab

Add the following block to your `.gitlab-ci.yml` file:

```yaml
validate_dependencies:
  image: node:20.5.0
  script:
    - export INPUT_PACKAGEJSONPATH='package.json' # This line is optional
    - export INPUT_QUIET='true' # This line is optional
    - npx dependencies-checker@latest
```

### NPX

Dependencies checker is also [published into npm](https://www.npmjs.com/package/dependencies-checker), so you can run
with:

```shell
export INPUT_PACKAGEJSONPATH='package.json' # This line is optional
export INPUT_QUIET='true' # This line is optional
npx dependencies-checker@latest
```

# Custom rules

Add a `dependencies-checker` block to your `package.json` file, if you need customize the default rules:

```json5
{
  "dependencies": {
    "react": "^18.2.0",
    "axios": "1.3.5 | 1.3.6",
    "react-native": "0.71.2"
  },
  "devDependencies": {
    "prettier": "^2.8.8"
  },
  // ...
  "dependencies-checker": {
    "blocks-to-check": [
      // Ignores "devDependencies"
      "dependencies"
    ],
    "ignored-dependencies": [
      // Ignores the '^' at "react"
      "react"
    ],
    // These version descriptors are not allowed by default:
    //     'latest', '^', '~', 'x', '*', '>', '<', '|', '-'
    "valid-descriptors": [
      // Allows the '|' at "axios"
      '|'
    ]
  }
}
```

## License

See more about the MIT licensing at [LICENSE.md](LICENSE.md). This project was originally created as a fork of
[github-developer/javascript-action](https://github.com/github-developer/javascript-action).

## Contributing

Pull requests are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for more. Please consider activating pre-commit before
committing (`npm run pre-commit.install`).
