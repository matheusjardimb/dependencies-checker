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

The lib takes two optional params:

- `packageJsonPath`: path to the `package.json` file. Defaults to `package.json` in the current directory. Accepts
  several paths or glob patterns (such as `packages/*/package.json`), one per line. `node_modules` is always skipped.
- `quiet`: set to `true` to only print errors.

Every invalid dependency is reported at once, so a single run shows everything that needs fixing. When several files
are checked, every failing file is listed.

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
      - uses: actions/checkout@v7
      - uses: matheusjardimb/dependencies-checker@latest
```

Add the following to specify a custom `package.json` path:

```yaml
      - uses: matheusjardimb/dependencies-checker@latest
        with:
          packageJsonPath: 'app/package.json'
          quiet: true
```

For monorepos, list several paths or glob patterns, one per line:

```yaml
      - uses: matheusjardimb/dependencies-checker@latest
        with:
          packageJsonPath: |
            package.json
            packages/*/package.json
```

### Gitlab

Add the following block to your `.gitlab-ci.yml` file:

```yaml
validate_dependencies:
  image: node:24
  script:
    - npx dependencies-checker@latest # Optionally add --quiet and package.json paths
```

### NPX

Dependencies checker is also [published into npm](https://www.npmjs.com/package/dependencies-checker), so you can run
with:

```shell
npx dependencies-checker@latest                                      # Checks ./package.json
npx dependencies-checker@latest --quiet app/package.json             # Custom path, only print errors
npx dependencies-checker@latest package.json 'packages/*/package.json' # Several files or glob patterns
```

Quote glob patterns so the checker expands them (and skips `node_modules`) instead of your shell. The
`INPUT_PACKAGEJSONPATH` and `INPUT_QUIET` environment variables still work; paths given on the command line take
precedence.

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
    // 'x' matches wildcards such as '1.x' or '1.2.X', and '-' matches hyphen ranges such as
    // '1.0.0 - 2.0.0'. Exact prerelease versions such as '1.0.0-beta.1' are accepted.
    "valid-descriptors": [
      // Allows the '|' at "axios"
      '|'
    ],
    // Only accepts pinned versions (see "Strict mode" below). Defaults to false
    "strict": false
  }
}
```

`blocks-to-check`, `ignored-dependencies` and `valid-descriptors` accept a single string or a list of strings.

When `blocks-to-check` is not set, every top-level block whose name contains `dependency` or `dependencies` is
checked, except metadata blocks such as `peerDependenciesMeta` and name lists such as `bundleDependencies`. A package
listed in more than one block (for example in both `peerDependencies` and `devDependencies`) is reported as a duplicate,
so set `blocks-to-check` if your project needs that. Duplicate keys anywhere in the file are also reported.

## Strict mode

The default rules reject range descriptors, but some loose versions contain none of them. Set `"strict": true` to also
reject those, and only accept versions that always resolve to the same code:

| Accepted in strict mode                                   | Rejected in strict mode            |
|-----------------------------------------------------------|------------------------------------|
| Exact versions: `1.2.3`, `1.0.0-beta.1`                    | Partial versions: `1`, `1.2`       |
| Aliases of exact versions: `npm:lodash-es@4.17.21`        | Dist-tags: `beta`, `next`, `canary` |
| Git or GitHub refs with a commit hash: `user/repo#0f1e2d3` | Git or GitHub refs without a commit, or with a branch or tag: `user/repo`, `user/repo#main` |
| Local paths: `file:../lib`, `./lib`                        |                                    |
| Tarball URLs: `https://example.com/pkg-1.0.0.tgz`          |                                    |

`valid-descriptors` cannot loosen strict mode. Use `ignored-dependencies` for exceptions.

## License

See more about the MIT licensing at [LICENSE.md](LICENSE.md). This project was originally created as a fork of
[github-developer/javascript-action](https://github.com/github-developer/javascript-action).

## Contributing

Pull requests are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for more. Please consider activating pre-commit before
committing (`npm run pre-commit.install`).
