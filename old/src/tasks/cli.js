#!/usr/bin/env node
"use strict";
/* eslint-disable no-console */
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
// Inspired by https://github.com/rdmurphy/create-clone/blob/main/src/cli.ts
const mri_1 = __importDefault(require("mri"));
const consts_1 = require("../consts");
const check_dependencies_1 = __importDefault(require("../check_dependencies"));
const cleanup = () => {
    console.log('Cleaning up.');
};
const handleExit = () => {
    cleanup();
    console.log('Exiting without error.');
    process.exit();
};
const handleError = (e) => {
    console.error('ERROR! An error was encountered while executing');
    console.error(e);
    cleanup();
    console.log('Exiting with error.');
    process.exit(1);
};
process.on('SIGINT', handleExit);
process.on('uncaughtException', handleError);
function main(argv_) {
    return __awaiter(this, void 0, void 0, function* () {
        const args = (0, mri_1.default)(argv_.slice(2), {
            string: ['packageJsonPath'],
            default: {
                packageJsonPath: consts_1.packageJsonPath_default
            }
        });
        const dest = process.cwd();
        const packageJsonFilePath = `${dest}/${args.packageJsonPath}`;
        (0, check_dependencies_1.default)(packageJsonFilePath);
    });
}
// eslint-disable-next-line github/no-then
main(process.argv).catch(handleError).then(handleExit);
