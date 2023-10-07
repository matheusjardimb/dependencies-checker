#!/usr/bin/env node

import * as core from '@actions/core'
import checkDependencies from './check_dependencies'
import {packageJsonPathDefault, packageJsonPathKey, quietModeKey} from './constants'
import {info} from './log'

function getQuietMode(): boolean {
    const quietMode = core.getInput(quietModeKey)
    return quietMode === 'true'
}

function getPackageJsonPath(quietMode: boolean): string {
    let packageJsonPath = core.getInput(packageJsonPathKey)
    if (!packageJsonPath) {
        packageJsonPath = packageJsonPathDefault
        info(`Parameter packageJsonPath not informed.`, quietMode)
    }
    info(`Reading '${packageJsonPath}' file`, quietMode)
    return packageJsonPath
}

function validateDependencies(): void {
    const quietMode = getQuietMode()
    const packageJsonPath = getPackageJsonPath(quietMode)
    checkDependencies(packageJsonPath, quietMode)
}

export default validateDependencies
