const fs = require('fs');
const core = require('@actions/core');

// https://docs.npmjs.com/cli/v7/configuring-npm/package-json#dependencies

function isValidDependency (dep) {
  // TODO: this method can be drastically improved, leaving this way just for testing
  return !(dep.includes('^') || dep.includes('~') || dep.includes('>') || dep.includes('<'));
}

function isIgnoredDependency (dependency, ignoredDepList) {
  return dependency in ignoredDepList;
}

function checkDependencyList (packageJson, ignoredDepList, dependencyBlock) {
  if (!(dependencyBlock in packageJson)) {
    throw Error(`Dependencies block not found: '${dependencyBlock}'`);
  }

  for (const [dependency, version] of Object.entries(packageJson[dependencyBlock])) {
    if (!isValidDependency(version)) {
      if (isIgnoredDependency(dependency, ignoredDepList)) {
        core.info(`Invalid dependency IGNORED: { ${dependency}: ${version} }`);
      } else {
        throw new Error(`Invalid dependency: { ${dependency}: ${version} }`);
      }
    }
  }
}

const checkDependencies = function (packageJsonPath, ignoredDepList, dependencyBlocksToCheck) {
  const rawData = fs.readFileSync(packageJsonPath);
  const packageJson = JSON.parse(rawData);

  if (!dependencyBlocksToCheck) {
    core.error('EMPTY dependencyBlocksToCheck PROVIDED');
  } else {
    for (let i = 0; i < dependencyBlocksToCheck.length; i++) {
      const dependencyBlock = dependencyBlocksToCheck[i];
      checkDependencyList(packageJson, ignoredDepList, dependencyBlock);
    }
  }
};

module.exports = checkDependencies;
