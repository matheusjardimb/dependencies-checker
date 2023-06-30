export class DependencyBlockNotFoundError extends Error {
    constructor(dependencyBlock: string) {
        super(`Dependencies block not found: '${dependencyBlock}'`)
    }
}

export class InvalidDependencyError extends Error {
    constructor(dependency: string) {
        super(`Dependency invalid: '${dependency}'`)
    }
}

export class InvalidPackageFileError extends Error {
    constructor(fileName: string) {
        super(`Invalid input file: '${fileName}'`)
    }
}
