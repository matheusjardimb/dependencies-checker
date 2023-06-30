import {describe, expect, it} from '@jest/globals'
import checkDependencies from '../src/check_dependencies'
import {InvalidDependencyError} from '../src/errors'

describe('Test invalid json files', () => {
    it('invalid_malformed.json should throw SyntaxError', () => {
        expect(() => checkDependencies('tests/test_files/invalid_malformed.json')).toThrow(SyntaxError)
    })

    it('non_existing_package.json should throw Error', () => {
        expect(() => checkDependencies('tests/test_files/non_existing_package.json')).toThrow()
    })

    it('invalid_has_caret.json should throw DependencyError', () => {
        expect(() => checkDependencies('tests/test_files/invalid_has_caret.json')).toThrow(InvalidDependencyError)
    })

    it('invalid_has_tilde.json should throw DependencyError', () => {
        expect(() => checkDependencies('tests/test_files/invalid_has_tilde.json')).toThrow(InvalidDependencyError)
    })

    it('invalid_settings.json should throw error', () => {
        expect(() => {
            checkDependencies('tests/test_files/invalid_settings.json')
        }).toThrow(Error)
    })
})

const valid_json_files = [
    'valid_single_block_without_settings.json',
    'valid_multi_block_without_settings.json',
    'valid_ignore_block.json',
    'valid_ignore_dependency.json'
]

describe('Test valid json files', () => {
    for (const file_name of valid_json_files) {
        it(`${file_name} should not throw error`, () => {
            expect(() => {
                checkDependencies(`tests/test_files/${file_name}`)
            }).not.toThrow()
        })
    }
})
