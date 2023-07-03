#!/usr/bin/env node

import * as core from '@actions/core'
import checkDependencies from './check_dependencies'
import {packageJsonPath_default, packageJsonPathKey} from './consts'

function validateDependencies(): void {
    let packageJsonPath = core.getInput(packageJsonPathKey)
    if (packageJsonPath) {
        core.info(`Reading ${packageJsonPath}`)
    } else {
        packageJsonPath = packageJsonPath_default
        core.info(`Parameter packageJsonPath not informed, reading ${packageJsonPath} by default!`)
    }

    checkDependencies(packageJsonPath)
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
