export class DependencyBlockError extends Error {
    constructor(dependencyBlock: string) {
        super(`Dependencies block not found: '${dependencyBlock}'`)

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, DependencyBlockError.prototype)
    }
}

export class DependencyError extends Error {
    constructor(dependency: string) {
        super(`Dependency error: '${dependency}'`)

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, DependencyError.prototype)
    }
}

// export class MyError extends Error {
//     constructor(m: string) {
//         super(m)
//
//         // Set the prototype explicitly.
//         Object.setPrototypeOf(this, MyError.prototype)
//     }
// }
