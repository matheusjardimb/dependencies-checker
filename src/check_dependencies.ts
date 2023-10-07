import {
    DependencyBlockNotFoundError,
    DuplicateDependencyError,
    InvalidDependencyError,
    InvalidPackageFileError
} from './errors'
import * as fs from 'fs'
import * as core from '@actions/core'
import findDuplicatedPropertyKeys from 'find-duplicated-property-keys'
import * as constants from './constants'
import {info} from './log'

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
        keyNameLower !== constants.libSettingsKey &&
        (keyNameLower.includes('dependency') || keyNameLower.includes('dependencies'))
    )
}

function getBlocksToCheck(packageJson: packageJsonType, libSettings: libSettingsType): string[] {
    const blocksToCheckValue = libSettings[constants.blocksToCheckKey]
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

function getIgnoredDependencies(
    packageJson: packageJsonType,
    libSettings: libSettingsType,
    quietMode: boolean
): string[] {
    const ignoredDependencies = libSettings[constants.ignoredDependenciesKey] as string[]
    if (ignoredDependencies !== undefined) {
        info(`Ignoring dependencies ${ignoredDependencies}`, quietMode)
        return ignoredDependencies
    }

    info(`Checking all dependencies`, quietMode)
    return constants.ignoredDependenciesDefault
}

function getInvalidDescriptors(
    packageJson: packageJsonType,
    libSettings: libSettingsType,
    quietMode: boolean
): string[] {
    let res = constants.invalidVersionDescriptorsDefault

    const invalidDescriptors = libSettings[constants.validVersionDescriptorsKey] as string[]
    if (invalidDescriptors !== undefined) {
        res = res.filter((x: string) => !invalidDescriptors.includes(x))
    }

    info(`Invalid descriptors: '${res.join(', ')}'`, quietMode)
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

function getLibSettings(packageJson: packageJsonType, quietMode: boolean): libSettingsType {
    let libSettings = packageJson[constants.libSettingsKey] as {}
    if (libSettings === undefined) {
        libSettings = constants.libSettingsDefault
        info(`Custom '${constants.libSettingsKey}' block not informed, using default values`, quietMode)
    }
    return libSettings
}

function checkDependencies(packageJsonPath: string, quietMode: boolean): void {
    info('Started validating dependencies', quietMode)
    const rawPackageJson = readPackageJsonFileAsRaw(packageJsonPath)
    const packageJson = parsePackageJson(rawPackageJson, packageJsonPath)
    checkDuplicateSettingsBlock(rawPackageJson)

    const libSettings = getLibSettings(packageJson, quietMode)

    const dependencyBlocksToCheck: string[] = getBlocksToCheck(packageJson, libSettings)
    const ignoredDepList: string[] = getIgnoredDependencies(packageJson, libSettings, quietMode)
    const invalidDescriptors: string[] = getInvalidDescriptors(packageJson, libSettings, quietMode)

    const allDependencies: string[] = []
    for (const dependencyBlock of dependencyBlocksToCheck) {
        checkDependencyList(packageJson, ignoredDepList, dependencyBlock, allDependencies, invalidDescriptors)
    }
    info('Finished validating without errors!', quietMode)
}

export default checkDependencies
