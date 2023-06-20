#!/usr/bin/env node

import * as core from '@actions/core'
import checkDependencies from './check_dependencies'

function validateDependencies(): void {
    const packageJsonPath = core.getInput('packageJsonPath')
    core.info(`packageJsonPath: ${packageJsonPath}`)

    const dependencyBlocksToCheck = core.getMultilineInput('dependencyBlocksToCheck')
    core.info(`dependencyBlocksToCheck: ${dependencyBlocksToCheck}`)

    const ignoredDepList = core.getMultilineInput('ignoredDepList')
    core.info(`ignoredDepList: ${ignoredDepList}`)

    checkDependencies(packageJsonPath, ignoredDepList, dependencyBlocksToCheck)
}
async function run(): Promise<void> {
    core.info('Started validating dependencies')
    try {
        validateDependencies()
        core.info('Finished validating without errors!')
    } catch (error) {
        core.error(error as Error)
        core.setFailed(error as Error)
    }
}

run()
