"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const check_dependencies_1 = __importDefault(require("./check_dependencies"));
const core_1 = __importDefault(require("@actions/core"));
function validateDependencies() {
    const packageJsonPath = core_1.default.getInput('packageJsonPath');
    core_1.default.info(`packageJsonPath: ${packageJsonPath}`);
    const dependencyBlocksToCheck = core_1.default.getMultilineInput('dependencyBlocksToCheck');
    core_1.default.info(`dependencyBlocksToCheck: ${dependencyBlocksToCheck}`);
    const ignoredDepList = core_1.default.getMultilineInput('ignoredDepList');
    core_1.default.info(`ignoredDepList: ${ignoredDepList}`);
    (0, check_dependencies_1.default)(packageJsonPath, ignoredDepList, dependencyBlocksToCheck);
}
// most @actions toolkit packages have async methods
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            validateDependencies();
            core_1.default.info('Finished validating without errors!');
        }
        catch (error) {
            core_1.default.error(error);
            core_1.default.setFailed(error);
        }
    });
}
run();
