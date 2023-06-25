import {DependencyBlockError} from './errors'
import * as fs from 'fs'
import * as core from '@actions/core'

// https://docs.npmjs.com/cli/v7/configuring-npm/package-json#dependencies

function isValidDependency(dep: string): boolean {
    // TODO: this method can be drastically improved, leaving this way just for testing
    return !(dep.includes('^') || dep.includes('~') || dep.includes('>') || dep.includes('<'))
}

function isIgnoredDependency(dependency: string, ignoredDepList: string[]): boolean {
    return dependency in ignoredDepList
}

function checkDependencyList(
    packageJson: {
        [index: string]: string
    },
    ignoredDepList: string[],
    dependencyBlock: string
): void {
    core.info(`Checking block '${dependencyBlock}'`)

    if (!(dependencyBlock in packageJson)) {
        throw new DependencyBlockError(dependencyBlock)
    }

    for (const [dependency, version] of Object.entries(packageJson[dependencyBlock])) {
        const dep_label = `{ ${dependency}: ${version} }`
        if (!isValidDependency(version)) {
            if (isIgnoredDependency(dependency, ignoredDepList)) {
                core.info(`\tInvalid dependency IGNORED: ${dep_label}`)
            } else {
                throw new Error(`\tInvalid dependency: ${dep_label}`)
            }
        } else {
            core.info(`\tDependency checked: ${dep_label}`)
        }
    }
}

function checkDependencies(packageJsonPath: string, ignoredDepList: string[], dependencyBlocksToCheck: string[]): void {
    const rawData = fs.readFileSync(packageJsonPath, 'utf8')
    const packageJson = JSON.parse(rawData)

    if (!dependencyBlocksToCheck) {
        core.error('EMPTY dependencyBlocksToCheck PROVIDED')
    } else {
        for (const dependencyBlock of dependencyBlocksToCheck) {
            checkDependencyList(packageJson, ignoredDepList, dependencyBlock)
        }
    }
}

export default checkDependencies
