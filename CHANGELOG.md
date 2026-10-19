# Changelog

Notable changes for people using the checker. Dependency updates and internal changes are listed in the
[GitHub release notes](https://github.com/matheusjardimb/dependencies-checker/releases).

## 1.2.0 (unreleased)

### Added

- Check several `package.json` files in one run: list paths or glob patterns such as `packages/*/package.json`, one
  per line in the `packageJsonPath` input or as command line arguments. `node_modules` is always skipped.
- Command line arguments for npx: `npx dependencies-checker --quiet app/package.json`. The `INPUT_*` environment
  variables still work.
- Opt-in `"strict": true` setting that only accepts pinned versions, rejecting partial versions (`1.2`), dist-tags
  (`beta`) and git refs without a commit hash.
- Every invalid dependency is reported in one error instead of only the first one.
- `blocks-to-check`, `ignored-dependencies` and `valid-descriptors` accept a single string as well as a list.

### Changed

- Versions such as `1.2.X` (capital X) are now rejected, the same as `1.2.x`.
- Exact prerelease versions (`1.0.0-beta.1`) and npm aliases (`npm:lodash-es@4.17.21`) are now accepted. Only hyphen
  ranges with spaces (`1.0.0 - 2.0.0`) are rejected by the `-` descriptor.
- Tags containing an `x`, such as `next`, are no longer rejected by the `x` descriptor. Use strict mode to reject them.
- The GitHub Action runs on Node.js 24. The npm package requires Node.js 18.17 or newer.
- Errors are printed once instead of twice, and `quiet` accepts `True` or `TRUE`.

### Fixed

- `peerDependenciesMeta`, `bundleDependencies` and other blocks that do not map packages to versions are no longer
  checked, which used to crash the checker or reject valid files.
- A `package.json` that is not a JSON object, a dependency version that is not a string, or a settings block that is
  not an object now gives a clear error instead of a crash.
