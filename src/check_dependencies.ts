import {DependencyBlockNotFoundError, InvalidDependencyError} from './errors'
import * as fs from 'fs'
import * as core from '@actions/core'
import {blocksToCheckKey, ignoredDependenciesKey, libSettingsKey} from './consts'

// https://docs.npmjs.com/cli/v7/configuring-npm/package-json#dependencies

function isValidDependency(dep: string): boolean {
    // TODO: this method can be drastically improved, leaving this way just for testing
    return !(dep.includes('^') || dep.includes('~') || dep.includes('>') || dep.includes('<'))
}

function isIgnoredDependency(dependency: string, ignoredDepList: string[]): boolean {
    return dependency in ignoredDepList
}

function checkDependencyList(
    packageJson: {[index: string]: unknown},
    ignoredDepList: string[],
    dependencyBlockKey: string
): void {
    core.info(`Checking block '${dependencyBlockKey}'`)

    if (packageJson[dependencyBlockKey] === undefined) {
        throw new DependencyBlockNotFoundError(dependencyBlockKey)
    }

    const dependencyBlock: {[index: string]: string} = packageJson[dependencyBlockKey] as {}
    for (const [dependency, version] of Object.entries(dependencyBlock)) {
        const dep_label = `{ ${dependency}: ${version} }`
        if (isValidDependency(version)) {
            core.info(`\tDependency checked: ${dep_label}`)
        } else {
            if (isIgnoredDependency(dependency, ignoredDepList)) {
                core.info(`\tInvalid dependency IGNORED: ${dep_label}`)
            } else {
                throw new InvalidDependencyError(`\tInvalid dependency: ${dep_label}`)
            }
        }
    }
}

function isDependencyBlock(keyName: string): boolean {
    const keyNameLower = keyName.toLowerCase()
    return (
        (keyNameLower !== libSettingsKey.toLowerCase() && keyNameLower.includes('dependency')) ||
        keyNameLower.includes('dependencies')
    )
}

function getBlocksToCheck(packageJson: {[p: string]: undefined}): string[] {
    const libSettingsValue = packageJson[libSettingsKey]
    if (libSettingsValue !== undefined) {
        const blocksToCheckValue = libSettingsValue[blocksToCheckKey]
        if (blocksToCheckValue !== undefined) {
            return blocksToCheckValue as string[]
        }
    }

    const dependencyBlocksToCheck: string[] = []
    for (const [entryName] of Object.entries(packageJson)) {
        if (isDependencyBlock(entryName)) {
            dependencyBlocksToCheck.push(entryName)
        }
    }
    return dependencyBlocksToCheck
}

function getIgnoredDependencies(packageJson: {[p: string]: undefined}): string[] {
    const libSettingsValue = packageJson[libSettingsKey]
    if (libSettingsValue !== undefined) {
        const ignoredDependencies = libSettingsValue[ignoredDependenciesKey] as string[]
        if (ignoredDependencies !== undefined) {
            core.info(`Ignoring dependencies ${ignoredDependencies}`)
            return ignoredDependencies
        }
    }
    core.info(`Checking all dependencies`)
    return []
}

function checkDependencies(packageJsonPath: string): void {
    const rawData = fs.readFileSync(packageJsonPath, 'utf8')
    const packageJson: {[index: string]: undefined} = JSON.parse(rawData)

    if (packageJson[libSettingsKey] === undefined) {
        core.info(`Custom '${libSettingsKey}' block not informed, using default values`)
    }
    const dependencyBlocksToCheck: string[] = getBlocksToCheck(packageJson)
    const ignoredDepList: string[] = getIgnoredDependencies(packageJson)

    for (const dependencyBlock of dependencyBlocksToCheck) {
        checkDependencyList(packageJson, ignoredDepList, dependencyBlock)
    }
}

export default checkDependencies
