#!/usr/bin/env node

import * as core from '@actions/core'
import checkDependencies from './check_dependencies'
import {packageJsonPathDefault, packageJsonPathKey} from './constants'

function getPackageJsonPath(): string {
    let packageJsonPath = core.getInput(packageJsonPathKey)
    if (packageJsonPath) {
        packageJsonPath = packageJsonPathDefault
        core.info(`Parameter packageJsonPath not informed.`)
    }
    core.info(`Reading '${packageJsonPath}' file`)
    return packageJsonPath
}

function validateDependencies(): void {
    const packageJsonPath = getPackageJsonPath()
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
