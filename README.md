# Exact dependency checker

<a href="https://github.com/matheusjardimb/js-exact-dependency-action/actions"><img alt="javscript-action status" height="20" src="https://github.com/matheusjardimb/js-exact-dependency-action/actions/workflows/test_coverage.yml/badge.svg"></a>
<a href="https://img.shields.io/github/v/release/matheusjardimb/js-exact-dependency-action"><img alt="release" height="20" src="https://img.shields.io/github/v/release/matheusjardimb/js-exact-dependency-action"></a>
![badge](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/matheusjardimb/f17f5787f5b4ac05a4b5a5b73a32e446/raw/test.json)
<a href="https://www.npmjs.com/package/exact-dependency-checker"><img src="https://badge.fury.io/js/exact-dependency-checker.svg" alt="npm version" height="20"></a>

Easily control when your project accepts only exact versions of dependencies.

## Usage

### Using GitHub actions

```yaml
uses: matheusjardimb/js-exact-dependency-action@v1.0.0
with:
  ignoredDepList: |
    dependency1
    dependency2
```

### Using Gitlab

TODO: add .gitlab-ci.yml instructions

```yaml
validate_dependencies:
  script:
    - npm exec github:matheusjardimb/js-exact-dependency-action
    - npx github:matheusjardimb/js-exact-dependency-action
```

## License

This project was originally created as a fork of
[github-developer/javascript-action](https://github.com/github-developer/javascript-action).

See more about licensing at [MIT](LICENSE.md).

## Contributing

Pull requests are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for more. Please consider activating pre-commit before
committing (`npm run pre-commit.install`).
