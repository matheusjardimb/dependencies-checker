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
const core = __importStar(require("@actions/core"));
const find_duplicated_property_keys_1 = __importDefault(require("find-duplicated-property-keys"));
const consts_1 = require("./consts");
function isValidDependency(dep) {
    // TODO: this method can be drastically improved, leaving this way just for testing
    return !(dep === '' ||
        dep.includes('latest') ||
        dep.includes('^') ||
        dep.includes('~') ||
        dep.includes('x') ||
        dep.includes('*') ||
        dep.includes('>') ||
        dep.includes('<') ||
        dep.includes('|') ||
        dep.includes('-'));
    // TODO: consider evaluating url dependencies
    // https://docs.npmjs.com/cli/v7/configuring-npm/package-json#dependencies
    // http://... See 'URLs as Dependencies' below
    // git... See 'Git URLs as Dependencies' below
    // user/repo See 'GitHub URLs' below
    // tag A specific version tagged and published as tag See npm dist-tag
    // path/path/path See Local Paths bel
}
function isIgnoredDependency(dependency, ignoredDepList) {
    return ignoredDepList.includes(dependency);
}
function checkDependencyList(packageJson, ignoredDepList, dependencyBlockKey, allDependencies) {
    core.info(`Checking block '${dependencyBlockKey}'`);
    if (packageJson[dependencyBlockKey] === undefined) {
        throw new errors_1.DependencyBlockNotFoundError(dependencyBlockKey);
    }
    const dependencyBlock = packageJson[dependencyBlockKey];
    for (const [dependency, version] of Object.entries(dependencyBlock)) {
        const dep_label = `{ ${dependency}: ${version} }`;
        if (isValidDependency(version)) {
            if (allDependencies.includes(dependency)) {
                throw new errors_1.DuplicateDependencyError(dependency);
            }
            allDependencies.push(dependency);
            core.info(`\tDependency checked: ${dep_label}`);
        }
        else {
            if (isIgnoredDependency(dependency, ignoredDepList)) {
                core.info(`\tInvalid dependency IGNORED: ${dep_label}`);
            }
            else {
                throw new errors_1.InvalidDependencyError(dep_label);
            }
        }
    }
}
function isDependencyBlock(keyName) {
    const keyNameLower = keyName.toLowerCase();
    return ((keyNameLower !== consts_1.libSettingsKey.toLowerCase() && keyNameLower.includes('dependency')) ||
        keyNameLower.includes('dependencies'));
}
function getBlocksToCheck(packageJson) {
    const libSettingsValue = packageJson[consts_1.libSettingsKey];
    if (libSettingsValue !== undefined) {
        const blocksToCheckValue = libSettingsValue[consts_1.blocksToCheckKey];
        if (blocksToCheckValue !== undefined) {
            return blocksToCheckValue;
        }
    }
    const dependencyBlocksToCheck = [];
    for (const [entryName] of Object.entries(packageJson)) {
        if (isDependencyBlock(entryName)) {
            dependencyBlocksToCheck.push(entryName);
        }
    }
    return dependencyBlocksToCheck;
}
function getIgnoredDependencies(packageJson) {
    const libSettingsValue = packageJson[consts_1.libSettingsKey];
    if (libSettingsValue !== undefined) {
        const ignoredDependencies = libSettingsValue[consts_1.ignoredDependenciesKey];
        if (ignoredDependencies !== undefined) {
            core.info(`Ignoring dependencies ${ignoredDependencies}`);
            return ignoredDependencies;
        }
    }
    core.info(`Checking all dependencies`);
    return [];
}
function read_package_json_file(packageJsonPath) {
    const rawData = fs.readFileSync(packageJsonPath, 'utf8');
    return [rawData, JSON.parse(rawData)];
}
function checkDependencies(packageJsonPath) {
    let packageJson;
    let rawData;
    try {
        ;
        [rawData, packageJson] = read_package_json_file(packageJsonPath);
    }
    catch (e) {
        throw new errors_1.InvalidPackageFileError(packageJsonPath);
    }
    if (packageJson[consts_1.libSettingsKey] === undefined) {
        core.info(`Custom '${consts_1.libSettingsKey}' block not informed, using default values`);
    }
    const dependencyBlocksToCheck = getBlocksToCheck(packageJson);
    const ignoredDepList = getIgnoredDependencies(packageJson);
    const result = (0, find_duplicated_property_keys_1.default)(rawData);
    if (result.length > 0) {
        throw new errors_1.DuplicateDependencyError(result[0]['key']);
    }
    const allDependencies = [];
    for (const dependencyBlock of dependencyBlocksToCheck) {
        checkDependencyList(packageJson, ignoredDepList, dependencyBlock, allDependencies);
    }
}
exports.default = checkDependencies;
