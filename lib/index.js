
const core = require('@actions/core');

const checkDependencies = require('./check_dependencies');

function validateDependencies () {
  const packageJsonPath = core.getInput('packageJsonPath');
  core.info(`packageJsonPath: ${packageJsonPath}`);

  const dependencyBlocksToCheck = core.getMultilineInput('dependencyBlocksToCheck');
  core.info(`dependencyBlocksToCheck: ${dependencyBlocksToCheck}`);

  const ignoredDepList = core.getMultilineInput('ignoredDepList');
  core.info(`ignoredDepList: ${ignoredDepList}`);

  checkDependencies(packageJsonPath, ignoredDepList, dependencyBlocksToCheck);
}

// most @actions toolkit packages have async methods
async function run () {
  try {
    validateDependencies();
    core.info('Finished validating without errors!');
  } catch (error) {
    core.error(error);
    core.setFailed(error);
  }
}

run();
