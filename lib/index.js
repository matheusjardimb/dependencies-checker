const core = require('@actions/core');
const checkDependencies = require('./check_dependencies');

// most @actions toolkit packages have async methods
async function run() {
    try {
        const ignoredDepList = core.getInput('ignoredDepList');
        core.info(`ignoredDepList: ${ignoredDepList}`);

        if (checkDependencies(ignoredDepList)) {
            core.info('Finished validating without errors!');
        } else {
            core.setFailed('Invalid dependencies');
        }
    } catch (error) {
        core.error(error);
        core.setFailed(error);
    }
}

run();
