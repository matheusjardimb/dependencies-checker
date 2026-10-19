export class DependencyBlockNotFoundError extends Error {
    constructor(dependencyBlock: string) {
        super(`Dependencies block not found: '${dependencyBlock}'`)
    }
}

export class InvalidDependencyError extends Error {
    constructor(dependency: string | string[]) {
        const dependencies = Array.isArray(dependency) ? dependency : [dependency]
        const label = dependencies.length > 1 ? 'Dependencies invalid' : 'Dependency invalid'
        super(`${label}: ${dependencies.map(dep => `'${dep}'`).join(', ')}`)
    }
}

export class InvalidPackageFileError extends Error {
    constructor(fileName: string) {
        super(`Invalid input file: '${fileName}'`)
    }
}

export class DuplicateDependencyError extends Error {
    constructor(dependency: string) {
        super(`Duplicated dependency found: '${dependency}'`)
    }
}

export class InvalidSettingsError extends Error {
    constructor(setting: string, expected = 'a string or a list of strings') {
        super(`Invalid setting: '${setting}' must be ${expected}`)
    }
}

export class UnknownOptionError extends Error {
    constructor(option: string) {
        super(`Unknown option: '${option}'. Usage: dependencies-checker [--quiet] [path/to/package.json ...]`)
    }
}

export class MultipleFilesError extends Error {
    constructor(failedFiles: number, totalFiles: number) {
        super(`${failedFiles} of ${totalFiles} files failed, see the errors above`)
    }
}
