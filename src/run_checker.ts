#!/usr/bin/env node

import * as core from '@actions/core'
import checkDependencies from './check_dependencies'
import {packageJsonPathDefault, packageJsonPathKey, quietModeKey} from './constants'

function getQuietMode(): boolean {
    const quietMode = core.getInput(quietModeKey)
    return quietMode === 'true'
}

function getPackageJsonPath(): string {
    let packageJsonPath = core.getInput(packageJsonPathKey)
    if (!packageJsonPath) {
        packageJsonPath = packageJsonPathDefault
        core.info(`Parameter packageJsonPath not informed.`)
    }
    core.info(`Reading '${packageJsonPath}' file`)
    return packageJsonPath
}

function validateDependencies(): void {
    const packageJsonPath = getPackageJsonPath()
    const quietMode = getQuietMode()
    checkDependencies(packageJsonPath, quietMode)
}

export default validateDependencies
