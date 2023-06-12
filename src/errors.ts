export class DependencyBlockError extends Error {
    constructor(dependencyBlock: string) {
        super(`Dependencies block not found: '${dependencyBlock}'`)
    }
}
