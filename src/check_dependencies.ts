import {
    DependencyBlockNotFoundError,
    DuplicateDependencyError,
    InvalidDependencyError,
    InvalidPackageFileError
} from './errors'
import * as fs from 'fs'
import * as core from '@actions/core'
import findDuplicatedPropertyKeys from 'find-duplicated-property-keys'
import {
    blocksToCheckKey,
    ignoredDependenciesKey,
    ignoredDependenciesDefault,
    libSettingsKey,
    validVersionDescriptorsKey,
    invalidVersionDescriptorsDefault,
    libSettingsDefault
} from './constants'

type packageJsonType = {[p: string]: unknown}
type libSettingsType = {[p: string]: unknown}

function isValidDependency(dependencyVersion: string, invalidDescriptors: string[]): boolean {
    // TODO: consider evaluating url dependencies
    // https://docs.npmjs.com/cli/v7/configuring-npm/package-json#dependencies
    // http://... See 'URLs as Dependencies' below
    // git... See 'Git URLs as Dependencies' below
    // user/repo See 'GitHub URLs' below
    // tag A specific version tagged and published as tag See npm dist-tag
    // path/path/path See Local Paths bel

    for (const descriptor of invalidDescriptors) {
        if (dependencyVersion.includes(descriptor)) {
            return false
        }
    }
    return dependencyVersion !== ''
}

function isIgnoredDependency(dependency: string, ignoredDepList: string[]): boolean {
    return ignoredDepList.includes(dependency)
}

function checkDependencyList(
    packageJson: packageJsonType,
    ignoredDepList: string[],
    dependencyBlockKey: string,
    allDependencies: string[],
    invalidDescriptors: string[]
): void {
    core.info(`Checking block '${dependencyBlockKey}'`)

    if (packageJson[dependencyBlockKey] === undefined) {
        throw new DependencyBlockNotFoundError(dependencyBlockKey)
    }

    const dependencyBlock: {[index: string]: string} = packageJson[dependencyBlockKey] as {}
    for (const [dependency, version] of Object.entries(dependencyBlock)) {
        const dep_label = `{ ${dependency}: ${version} }`
        if (isValidDependency(version, invalidDescriptors)) {
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
        keyNameLower !== libSettingsKey &&
        (keyNameLower.includes('dependency') || keyNameLower.includes('dependencies'))
    )
}

function getBlocksToCheck(packageJson: packageJsonType, libSettings: libSettingsType): string[] {
    const blocksToCheckValue = libSettings[blocksToCheckKey]
    if (blocksToCheckValue !== undefined) {
        return blocksToCheckValue as string[]
    }

    const dependencyBlocksToCheck: string[] = []
    for (const [entryName] of Object.entries(packageJson)) {
        if (isDependencyBlock(entryName)) {
            dependencyBlocksToCheck.push(entryName)
        }
    }
    return dependencyBlocksToCheck
}

function getIgnoredDependencies(packageJson: packageJsonType, libSettings: libSettingsType): string[] {
    const ignoredDependencies = libSettings[ignoredDependenciesKey] as string[]
    if (ignoredDependencies !== undefined) {
        core.info(`Ignoring dependencies ${ignoredDependencies}`)
        return ignoredDependencies
    }

    core.info(`Checking all dependencies`)
    return ignoredDependenciesDefault
}

function getInvalidDescriptors(packageJson: packageJsonType, libSettings: libSettingsType): string[] {
    let res = invalidVersionDescriptorsDefault

    const invalidDescriptors = libSettings[validVersionDescriptorsKey] as string[]
    if (invalidDescriptors !== undefined) {
        res = res.filter(x => !invalidDescriptors.includes(x))
    }

    core.info(`Invalid descriptors: '${res.join(', ')}'`)
    return res
}

function readPackageJsonFileAsRaw(packageJsonPath: string): string {
    try {
        return fs.readFileSync(packageJsonPath, 'utf8')
    } catch (e) {
        throw new InvalidPackageFileError(packageJsonPath)
    }
}

function checkDuplicateSettingsBlock(rawJsonData: string): void {
    const result = findDuplicatedPropertyKeys(rawJsonData)
    if (result.length > 0) {
        throw new DuplicateDependencyError(result[0]['key'])
    }
}

function parsePackageJson(rawPackageJson: string, packageJsonPath: string): packageJsonType {
    try {
        return JSON.parse(rawPackageJson)
    } catch (e) {
        throw new InvalidPackageFileError(packageJsonPath)
    }
}

function getLibSettings(packageJson: packageJsonType): libSettingsType {
    let libSettings = packageJson[libSettingsKey] as {}
    if (libSettings === undefined) {
        libSettings = libSettingsDefault
        core.info(`Custom '${libSettingsKey}' block not informed, using default values`)
    }
    return libSettings
}

function checkDependencies(packageJsonPath: string): void {
    const rawPackageJson = readPackageJsonFileAsRaw(packageJsonPath)
    const packageJson = parsePackageJson(rawPackageJson, packageJsonPath)
    checkDuplicateSettingsBlock(rawPackageJson)

    const libSettings = getLibSettings(packageJson)

    const dependencyBlocksToCheck: string[] = getBlocksToCheck(packageJson, libSettings)
    const ignoredDepList: string[] = getIgnoredDependencies(packageJson, libSettings)
    const invalidDescriptors: string[] = getInvalidDescriptors(packageJson, libSettings)

    const allDependencies: string[] = []
    for (const dependencyBlock of dependencyBlocksToCheck) {
        checkDependencyList(packageJson, ignoredDepList, dependencyBlock, allDependencies, invalidDescriptors)
    }
}

export default checkDependencies
