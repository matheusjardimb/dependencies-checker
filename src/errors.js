"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuplicateDependencyError = exports.InvalidPackageFileError = exports.InvalidDependencyError = exports.DependencyBlockNotFoundError = void 0;
class DependencyBlockNotFoundError extends Error {
    constructor(dependencyBlock) {
        super(`Dependencies block not found: '${dependencyBlock}'`);
    }
}
exports.DependencyBlockNotFoundError = DependencyBlockNotFoundError;
class InvalidDependencyError extends Error {
    constructor(dependency) {
        super(`Dependency invalid: '${dependency}'`);
    }
}
exports.InvalidDependencyError = InvalidDependencyError;
class InvalidPackageFileError extends Error {
    constructor(fileName) {
        super(`Invalid input file: '${fileName}'`);
    }
}
exports.InvalidPackageFileError = InvalidPackageFileError;
class DuplicateDependencyError extends Error {
    constructor(dependency) {
        super(`Duplicated dependency found: '${dependency}'`);
    }
}
exports.DuplicateDependencyError = DuplicateDependencyError;
