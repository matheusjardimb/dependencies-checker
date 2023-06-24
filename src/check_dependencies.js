"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("./errors");
const fs = __importStar(require("fs"));
const core_1 = __importDefault(require("@actions/core"));
// https://docs.npmjs.com/cli/v7/configuring-npm/package-json#dependencies
function isValidDependency(dep) {
    // TODO: this method can be drastically improved, leaving this way just for testing
    return !(dep.includes('^') || dep.includes('~') || dep.includes('>') || dep.includes('<'));
}
function isIgnoredDependency(dependency, ignoredDepList) {
    return dependency in ignoredDepList;
}
function checkDependencyList(packageJson, ignoredDepList, dependencyBlock) {
    if (!(dependencyBlock in packageJson)) {
        throw new errors_1.DependencyBlockError(dependencyBlock);
    }
    for (const [dependency, version] of Object.entries(packageJson[dependencyBlock])) {
        if (!isValidDependency(version)) {
            if (isIgnoredDependency(dependency, ignoredDepList)) {
                core_1.default.info(`Invalid dependency IGNORED: { ${dependency}: ${version} }`);
            }
            else {
                throw new Error(`Invalid dependency: { ${dependency}: ${version} }`);
            }
        }
    }
}
function checkDependencies(packageJsonPath, ignoredDepList, dependencyBlocksToCheck) {
    const rawData = fs.readFileSync(packageJsonPath, 'utf8');
    const packageJson = JSON.parse(rawData);
    if (!dependencyBlocksToCheck) {
        core_1.default.error('EMPTY dependencyBlocksToCheck PROVIDED');
    }
    else {
        for (const dependencyBlock of dependencyBlocksToCheck) {
            checkDependencyList(packageJson, ignoredDepList, dependencyBlock);
        }
    }
}
exports.default = checkDependencies;
