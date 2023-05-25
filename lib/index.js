const core = require('@actions/core');
const check_dependencies = require('./check_dependencies');

// most @actions toolkit packages have async methods
async function run() {
    try {
        const ignoredDepList = core.getInput('ignoredDepList');
        core.info(`ignoredDepList: ${ignoredDepList}`);

        core.debug((new Date()).toTimeString()); // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true
        await check_dependencies(ignoredDepList);
        core.info((new Date()).toTimeString());

    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
