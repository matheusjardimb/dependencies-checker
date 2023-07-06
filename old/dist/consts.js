"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ignoredDepList_default = exports.ignoredDepList = exports.dependencyBlocksToCheck_default = exports.dependencyBlocksToCheck = exports.packageJsonPath_default = exports.packageJsonPathKey = exports.ignoredDependenciesKey = exports.blocksToCheckKey = exports.libSettingsKey = void 0;
const libSettingsKey = 'exactDependencyChecker';
exports.libSettingsKey = libSettingsKey;
const blocksToCheckKey = 'blocksToCheck';
exports.blocksToCheckKey = blocksToCheckKey;
const ignoredDependenciesKey = 'ignoredDependencies';
exports.ignoredDependenciesKey = ignoredDependenciesKey;
const packageJsonPathKey = 'packageJsonPath';
exports.packageJsonPathKey = packageJsonPathKey;
const packageJsonPath_default = 'package.json';
exports.packageJsonPath_default = packageJsonPath_default;
const dependencyBlocksToCheck = 'dependencyBlocksToCheck';
exports.dependencyBlocksToCheck = dependencyBlocksToCheck;
const dependencyBlocksToCheck_default = ['dependencies', 'devDependencies'];
exports.dependencyBlocksToCheck_default = dependencyBlocksToCheck_default;
const ignoredDepList = 'ignoredDepList';
exports.ignoredDepList = ignoredDepList;
const ignoredDepList_default = [''];
exports.ignoredDepList_default = ignoredDepList_default;