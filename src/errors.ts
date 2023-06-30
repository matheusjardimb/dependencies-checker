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
