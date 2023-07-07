import {
    DependencyBlockNotFoundError,
    DuplicateDependencyError,
    InvalidDependencyError,
    InvalidPackageFileError
} from './errors'
import * as fs from 'fs'
import * as core from '@actions/core'
import findDuplicatedPropertyKeys from 'find-duplicated-property-keys'
import {blocksToCheckKey, ignoredDependenciesKey, libSettingsKey} from './consts'

function isValidDependency(dep: string): boolean {
    // TODO: this method can be drastically improved, leaving this way just for testing
    return !(
        dep === '' ||
        dep.includes('latest') ||
        dep.includes('^') ||
        dep.includes('~') ||
        dep.includes('x') ||
        dep.includes('*') ||
        dep.includes('>') ||
        dep.includes('<') ||
        dep.includes('|') ||
        dep.includes('-')
    )
    // TODO: consider evaluating url dependencies
    // https://docs.npmjs.com/cli/v7/configuring-npm/package-json#dependencies
    // http://... See 'URLs as Dependencies' below
    // git... See 'Git URLs as Dependencies' below
    // user/repo See 'GitHub URLs' below
    // tag A specific version tagged and published as tag See npm dist-tag
    // path/path/path See Local Paths bel
}

function isIgnoredDependency(dependency: string, ignoredDepList: string[]): boolean {
    return ignoredDepList.includes(dependency)
}

function checkDependencyList(
    packageJson: {[p: string]: unknown},
    ignoredDepList: string[],
    dependencyBlockKey: string,
    allDependencies: string[]
): void {
    core.info(`Checking block '${dependencyBlockKey}'`)

    if (packageJson[dependencyBlockKey] === undefined) {
        throw new DependencyBlockNotFoundError(dependencyBlockKey)
    }

    const dependencyBlock: {[index: string]: string} = packageJson[dependencyBlockKey] as {}
    for (const [dependency, version] of Object.entries(dependencyBlock)) {
        const dep_label = `{ ${dependency}: ${version} }`
        if (isValidDependency(version)) {
            if (allDependencies.includes(dependency)) {
                throw new DuplicateDependencyError(dependency)
            }
            allDependencies.push(dependency)
            core.info(`\tDependency checked: ${dep_label}`)
        } else {
            if (isIgnoredDependency(dependency, ignoredDepList)) {
                core.info(`\tInvalid dependency IGNORED: ${dep_label}`)
            } else {
                throw new InvalidDependencyError(dep_label)
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

function read_package_json_file(packageJsonPath: string): [string, {[p: string]: undefined}] {
    const rawData = fs.readFileSync(packageJsonPath, 'utf8')
    return [rawData, JSON.parse(rawData)]
}

function checkDependencies(packageJsonPath: string): void {
    let packageJson
    let rawData
    try {
        ;[rawData, packageJson] = read_package_json_file(packageJsonPath)
    } catch (e) {
        throw new InvalidPackageFileError(packageJsonPath)
    }

    if (packageJson[libSettingsKey] === undefined) {
        core.info(`Custom '${libSettingsKey}' block not informed, using default values`)
    }
    const dependencyBlocksToCheck: string[] = getBlocksToCheck(packageJson)
    const ignoredDepList: string[] = getIgnoredDependencies(packageJson)

    const result = findDuplicatedPropertyKeys(rawData)
    if (result.length > 0) {
        throw new DuplicateDependencyError(result[0]['key'])
    }

    const allDependencies: string[] = []
    for (const dependencyBlock of dependencyBlocksToCheck) {
        checkDependencyList(packageJson, ignoredDepList, dependencyBlock, allDependencies)
    }
}

export default checkDependencies
