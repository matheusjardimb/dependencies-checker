import checkDependencies from './check_dependencies'

import core from '@actions/core'

function validateDependencies(): void {
    const packageJsonPath = core.getInput('packageJsonPath')
    core.info(`packageJsonPath: ${packageJsonPath}`)

    const dependencyBlocksToCheck = core.getMultilineInput('dependencyBlocksToCheck')
    core.info(`dependencyBlocksToCheck: ${dependencyBlocksToCheck}`)

    const ignoredDepList = core.getMultilineInput('ignoredDepList')
    core.info(`ignoredDepList: ${ignoredDepList}`)

    checkDependencies(packageJsonPath, ignoredDepList, dependencyBlocksToCheck)
}

// most @actions toolkit packages have async methods
async function run(): Promise<void> {
    try {
        validateDependencies()
        core.info('Finished validating without errors!')
    } catch (error) {
        core.error(error as Error)
        core.setFailed(error as Error)
    }
}

run()
