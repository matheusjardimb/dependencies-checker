import {describe, expect, it} from '@jest/globals'
import checkDependencies from '../src/check_dependencies'
import {DependencyError, DependencyBlockError} from '../src/errors'

describe('Test test_files json files', () => {
    it('malformed_package.json should throw SyntaxError', () => {
        expect(() => checkDependencies('tests/test_files/malformed_package.json')).toThrow(SyntaxError)
    })

    it('non_existing_package.json should throw SyntaxError', () => {
        expect(() => checkDependencies('tests/test_files/non_existing_package.json')).toThrow()
    })

    it('package_has_caret.json should throw Error', () => {
        expect(() => checkDependencies('tests/test_files/package_has_caret.json')).toThrow(DependencyError)
    })

    it('package_2.json should throw error', () => {
        expect(() => {
            checkDependencies('tests/test_files/package_2.json')
        }).toThrow(Error)
    })
})

describe('Test valid json files', () => {
    it('package_1.json should not throw error', () => {
        expect(() => {
            checkDependencies('tests/test_files/package_1.json')
        }).not.toThrow(SyntaxError)
    })

    it('package_3.json should not throw error', () => {
        expect(() => {
            checkDependencies('tests/test_files/package_3.json')
        }).not.toThrow(Error)
    })
})
