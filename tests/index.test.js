const checkDependencies = require('../lib/check_dependencies');
const process = require('process');
const cp = require('child_process');
const path = require('path');

describe('Test invalid json files', () => {
    it('malformed_package.json should throw SyntaxError', () => {
        expect(
            () => checkDependencies('tests/malformed_package.json')
        ).toThrow(SyntaxError);
    });

    it('non_existing_package.json should throw SyntaxError', () => {
        expect(
            () => checkDependencies('tests/non_existing_package.json')
        ).toThrow();
    });

    it('package_has_caret.json should throw Error', () => {
        expect(
            () => checkDependencies('tests/package_has_caret.json')
        ).toThrow();
    });
})

describe('Test valid json files', () => {
    it('package_1.json should not throw error', () => {
        expect(
            () => checkDependencies('tests/package_1.json')
        ).not.toThrow(SyntaxError);
    });

    it('package_2.json should not throw error', () => {
        expect(
            () => checkDependencies('tests/package_2.json')
        ).not.toThrow(SyntaxError);
    });
})

