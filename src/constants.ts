const libSettingsKey = 'dependencies-checker'
const blocksToCheckKey = 'blocks-to-check'

const ignoredDependenciesKey = 'ignored-dependencies'
const ignoredDependenciesDefault = ['']

const validVersionDescriptorsKey = 'valid-descriptors'

const invalidVersionDescriptorsDefault = ['latest', '^', '~', 'x', '*', '>', '<', '|', '-']
const packageJsonPathKey = 'packageJsonPath'
const quietModeKey = 'quiet'
const packageJsonPathEnvKey = `INPUT_${packageJsonPathKey.toUpperCase()}`

const packageJsonPathDefault = 'package.json'

const libSettingsDefault = {
    // blocksToCheckKey:[]
    ignoredDependenciesKey: []
}

export {
    quietModeKey,
    libSettingsKey,
    libSettingsDefault,
    invalidVersionDescriptorsDefault,
    validVersionDescriptorsKey,
    blocksToCheckKey,
    ignoredDependenciesKey,
    packageJsonPathKey,
    packageJsonPathEnvKey,
    packageJsonPathDefault,
    ignoredDependenciesDefault
}
