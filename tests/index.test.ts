import {describe, expect, it, test} from '@jest/globals'
import checkDependencies from "../src/check_dependencies";

describe('Test test_files json files', () => {
    it('malformed_package.json should throw SyntaxError', () => {
        expect(() =>
            checkDependencies('tests/test_files/malformed_package.json', [], ['dependencies', 'devDependencies'])
        ).toThrow(SyntaxError)
    })

    it('non_existing_package.json should throw SyntaxError', () => {
        expect(() =>
            checkDependencies('tests/test_files/non_existing_package.json', [], ['dependencies', 'devDependencies'])
        ).toThrow()
    })

    it('package_has_caret.json should throw Error', () => {
        expect(() =>
            checkDependencies('tests/test_files/package_has_caret.json', [], ['dependencies', 'devDependencies'])
        ).toThrow()
    })

    it('package_2.json should throw error', () => {
        expect(() => {
            checkDependencies('tests/test_files/package_2.json', [], ['dependencies', 'devDependencies'])
        }).toThrow(Error)
    })
})

describe('Test valid json files', () => {
    it('package_1.json should not throw error', () => {
        expect(() => {
            checkDependencies('tests/test_files/package_1.json', [], ['dependencies', 'devDependencies'])
        }).not.toThrow(SyntaxError)
    })

    it('package_2.json should not throw error', () => {
        expect(() => {
            checkDependencies('tests/test_files/package_2.json', [], ['dependencies'])
        }).not.toThrow(Error)
    })
})
