const libSettingsKey = 'dependencies-checker' // OK
const blocksToCheckKey = 'blocks-to-check' // OK

const ignoredDependenciesKey = 'ignored-dependencies' // OK
const ignoredDependenciesDefault = ['']

export const invalidVersionDescriptorsKey = 'invalid-descriptors'

export const invalidVersionDescriptorsDefault = ['latest', '^', '~', 'x', '*', '>', '<', '|', '-']
const packageJsonPathKey = 'packageJsonPath' // OK

const packageJsonPathDefault = 'package.json' // OK

const libSettingsDefault = {
    // blocksToCheckKey:[]
    ignoredDependenciesKey: [],
    invalidVersionDescriptorsKey: invalidVersionDescriptorsDefault
}

export {
    libSettingsKey,
    blocksToCheckKey,
    ignoredDependenciesKey,
    packageJsonPathKey,
    packageJsonPathDefault,
    ignoredDependenciesDefault,
    libSettingsDefault
}
