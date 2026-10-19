import {
    DependencyBlockNotFoundError,
    DuplicateDependencyError,
    InvalidDependencyError,
    InvalidPackageFileError,
    InvalidSettingsError
} from './errors'
import * as fs from 'fs'
import findDuplicatedPropertyKeys from 'find-duplicated-property-keys'
import * as constants from './constants'
import {info} from './log'

type packageJsonType = {[p: string]: unknown}
type libSettingsType = {[p: string]: unknown}

function isPlainObject(value: unknown): value is {[p: string]: unknown} {
    return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function hasDescriptor(dependencyVersion: string, descriptor: string): boolean {
    switch (descriptor) {
        case 'x':
            // Only a whole version part is a wildcard ('1.x', '1.2.X'), not an 'x' inside a word ('next')
            return dependencyVersion.split(/[\s.]+/).some(part => part.toLowerCase() === 'x')
        case '-':
            // Hyphen ranges need spaces ('1.0.0 - 2.0.0'), while '1.0.0-beta.1' is an exact prerelease version
            return /\s-\s/.test(dependencyVersion)
        default:
            return dependencyVersion.includes(descriptor)
    }
}

const exactVersionRegex = /^[=v]*\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?(\+[0-9A-Za-z.-]+)?$/
const commitHashRegex = /#[0-9a-f]{7,40}$/i
const localPathRegex = /^(file:|link:|\.{1,2}\/|\/|~\/)/
const tarballUrlRegex = /^https?:\/\/.+\.(tgz|tar\.gz)$/i

// Strict mode only accepts versions that always resolve to the same code
function isPinnedVersion(dependencyVersion: string): boolean {
    const version = dependencyVersion.trim()
    if (version.startsWith('npm:')) {
        // Aliases such as 'npm:lodash-es@4.17.21' are pinned when their own version is
        const versionSeparator = version.lastIndexOf('@')
        return versionSeparator > 'npm:'.length && isPinnedVersion(version.slice(versionSeparator + 1))
    }
    return (
        exactVersionRegex.test(version) ||
        commitHashRegex.test(version) ||
        localPathRegex.test(version) ||
        tarballUrlRegex.test(version)
    )
}

function isValidDependency(dependencyVersion: unknown, invalidDescriptors: string[], strictMode = false): boolean {
    // TODO: consider evaluating url dependencies
    // https://docs.npmjs.com/cli/v7/configuring-npm/package-json#dependencies
    // http://... See 'URLs as Dependencies' below
    // git... See 'Git URLs as Dependencies' below
    // user/repo See 'GitHub URLs' below
    // tag A specific version tagged and published as tag See npm dist-tag
    // path/path/path See Local Paths bel

    if (typeof dependencyVersion !== 'string') {
        return false
    }
    for (const descriptor of invalidDescriptors) {
        if (hasDescriptor(dependencyVersion, descriptor)) {
            return false
        }
    }
    if (strictMode && !isPinnedVersion(dependencyVersion)) {
        return false
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
    invalidDescriptors: string[],
    invalidDependencies: string[],
    strictMode: boolean,
    quietMode: boolean
): void {
    info(`Checking block '${dependencyBlockKey}'`, quietMode)

    if (packageJson[dependencyBlockKey] === undefined) {
        throw new DependencyBlockNotFoundError(dependencyBlockKey)
    }

    const dependencyBlock = packageJson[dependencyBlockKey] as {[index: string]: unknown}
    for (const [dependency, version] of Object.entries(dependencyBlock)) {
        const dep_label = `{ ${dependency}: ${typeof version === 'string' ? version : JSON.stringify(version)} }`
        if (isValidDependency(version, invalidDescriptors, strictMode)) {
            if (allDependencies.includes(dependency)) {
                throw new DuplicateDependencyError(dependency)
            }
            allDependencies.push(dependency)
            info(`\tDependency checked: ${dep_label}`, quietMode)
        } else {
            if (isIgnoredDependency(dependency, ignoredDepList)) {
                info(`\tInvalid dependency IGNORED: ${dep_label}`, quietMode)
            } else {
                info(`\tInvalid dependency: ${dep_label}`, quietMode)
                invalidDependencies.push(dep_label)
            }
        }
    }
}

function isDependencyBlock(keyName: string, value: unknown): boolean {
    const keyNameLower = keyName.toLowerCase()
    return (
        keyNameLower !== constants.libSettingsKey &&
        (keyNameLower.includes('dependency') || keyNameLower.includes('dependencies')) &&
        // Skips metadata blocks such as 'peerDependenciesMeta' and name lists such as 'bundleDependencies'
        !keyNameLower.endsWith('meta') &&
        isPlainObject(value)
    )
}

function getStringListSetting(libSettings: libSettingsType, key: string): string[] | undefined {
    const value = libSettings[key]
    if (value === undefined) {
        return undefined
    }
    if (typeof value === 'string') {
        return [value]
    }
    if (Array.isArray(value) && value.every(item => typeof item === 'string')) {
        return value
    }
    throw new InvalidSettingsError(key)
}

function getBlocksToCheck(packageJson: packageJsonType, libSettings: libSettingsType): string[] {
    const blocksToCheckValue = getStringListSetting(libSettings, constants.blocksToCheckKey)
    if (blocksToCheckValue !== undefined) {
        return blocksToCheckValue
    }

    const dependencyBlocksToCheck: string[] = []
    for (const [entryName, entryValue] of Object.entries(packageJson)) {
        if (isDependencyBlock(entryName, entryValue)) {
            dependencyBlocksToCheck.push(entryName)
        }
    }
    return dependencyBlocksToCheck
}

function getIgnoredDependencies(libSettings: libSettingsType, quietMode: boolean): string[] {
    const ignoredDependencies = getStringListSetting(libSettings, constants.ignoredDependenciesKey)
    if (ignoredDependencies !== undefined) {
        info(`Ignoring dependencies ${ignoredDependencies}`, quietMode)
        return ignoredDependencies
    }

    info(`Checking all dependencies`, quietMode)
    return constants.ignoredDependenciesDefault
}

function getInvalidDescriptors(libSettings: libSettingsType, quietMode: boolean): string[] {
    let res = constants.invalidVersionDescriptorsDefault

    const validDescriptors = getStringListSetting(libSettings, constants.validVersionDescriptorsKey)
    if (validDescriptors !== undefined) {
        res = res.filter((x: string) => !validDescriptors.includes(x))
    }

    info(`Invalid descriptors: '${res.join(', ')}'`, quietMode)
    return res
}

function getStrictMode(libSettings: libSettingsType, quietMode: boolean): boolean {
    const strictMode = libSettings[constants.strictModeKey]
    if (strictMode === undefined) {
        return false
    }
    if (typeof strictMode !== 'boolean') {
        throw new InvalidSettingsError(constants.strictModeKey, 'true or false')
    }
    if (strictMode) {
        info('Strict mode enabled: only pinned versions are accepted', quietMode)
    }
    return strictMode
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
    let packageJson: unknown
    try {
        packageJson = JSON.parse(rawPackageJson)
    } catch (e) {
        throw new InvalidPackageFileError(packageJsonPath)
    }
    if (!isPlainObject(packageJson)) {
        throw new InvalidPackageFileError(packageJsonPath)
    }
    return packageJson
}

function getLibSettings(packageJson: packageJsonType, quietMode: boolean): libSettingsType {
    const libSettings = packageJson[constants.libSettingsKey]
    if (libSettings === undefined) {
        info(`Custom '${constants.libSettingsKey}' block not informed, using default values`, quietMode)
        return constants.libSettingsDefault
    }
    if (!isPlainObject(libSettings)) {
        throw new InvalidSettingsError(constants.libSettingsKey)
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
    const ignoredDepList: string[] = getIgnoredDependencies(libSettings, quietMode)
    const invalidDescriptors: string[] = getInvalidDescriptors(libSettings, quietMode)
    const strictMode = getStrictMode(libSettings, quietMode)

    const allDependencies: string[] = []
    const invalidDependencies: string[] = []
    for (const dependencyBlock of dependencyBlocksToCheck) {
        checkDependencyList(
            packageJson,
            ignoredDepList,
            dependencyBlock,
            allDependencies,
            invalidDescriptors,
            invalidDependencies,
            strictMode,
            quietMode
        )
    }
    if (invalidDependencies.length > 0) {
        throw new InvalidDependencyError(invalidDependencies)
    }
    info('Finished validating without errors!', quietMode)
}

export {hasDescriptor, isPinnedVersion, isValidDependency}
export default checkDependencies
