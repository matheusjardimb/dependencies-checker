const libSettingsKey = 'dependencies-checker'
const blocksToCheckKey = 'blocks-to-check'

const ignoredDependenciesKey = 'ignored-dependencies'
const ignoredDependenciesDefault: string[] = []

const validVersionDescriptorsKey = 'valid-descriptors'
const strictModeKey = 'strict'

const invalidVersionDescriptorsDefault = ['latest', '^', '~', 'x', '*', '>', '<', '|', '-']
const packageJsonPathKey = 'packageJsonPath'
const quietModeKey = 'quiet'
const packageJsonPathEnvKey = `INPUT_${packageJsonPathKey.toUpperCase()}`

const packageJsonPathDefault = 'package.json'

const libSettingsDefault = {}

export {
    quietModeKey,
    libSettingsKey,
    libSettingsDefault,
    invalidVersionDescriptorsDefault,
    validVersionDescriptorsKey,
    strictModeKey,
    blocksToCheckKey,
    ignoredDependenciesKey,
    packageJsonPathKey,
    packageJsonPathEnvKey,
    packageJsonPathDefault,
    ignoredDependenciesDefault
}
