const libSettingsKey = 'dependencies-checker' // OK
const blocksToCheckKey = 'blocks-to-check' // OK

const ignoredDependenciesKey = 'ignored-dependencies' // OK
const ignoredDependenciesDefault = ['']

const validVersionDescriptorsKey = 'valid-descriptors'

const invalidVersionDescriptorsDefault = ['latest', '^', '~', 'x', '*', '>', '<', '|', '-']
const packageJsonPathKey = 'packageJsonPath' // OK

const packageJsonPathDefault = 'package.json' // OK

const libSettingsDefault = {
    // blocksToCheckKey:[]
    ignoredDependenciesKey: []
}

export {
    libSettingsKey,
    libSettingsDefault,
    invalidVersionDescriptorsDefault,
    validVersionDescriptorsKey,
    blocksToCheckKey,
    ignoredDependenciesKey,
    packageJsonPathKey,
    packageJsonPathDefault,
    ignoredDependenciesDefault
}
