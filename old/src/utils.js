"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
function get_test_file_names(directory) {
    return fs_1.default
        .readdirSync(directory, { withFileTypes: true })
        .filter(item => item.isFile())
        .filter(item => item.name.endsWith('.json'))
        .map(item => `${directory}/${item.name}`);
}
exports.default = get_test_file_names;
