"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DependencyBlockError = void 0;
class DependencyBlockError extends Error {
    constructor(dependencyBlock) {
        super(`Dependencies block not found: '${dependencyBlock}'`);
    }
}
exports.DependencyBlockError = DependencyBlockError;
