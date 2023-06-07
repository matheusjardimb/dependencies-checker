
  const core = require('@actions/core');

const   checkDependencies = require('./check_dependencies');

function validateDependencies () {
  const ignoredDepList = core.getInput('ignoredDepList');
  core.info(`ignoredDepList: ${ignoredDepList}`);

  const packageJsonPath = core.getInput('packageJsonPath');
  core.info(`packageJsonPath: ${packageJsonPath}`);

  checkDependencies(packageJsonPath, ignoredDepList);
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
