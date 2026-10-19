import {describe, expect, it} from '@jest/globals'
import {InvalidDependencyError} from '../src/errors'
import {get_test_file_names, setInput} from './utils'
import {packageJsonPathKey} from '../src/constants'
import validateDependencies from '../src/run_checker'

describe('Test invalid dependencies in json files', () => {
    for (const filePath of get_test_file_names('tests/invalid_dependencies')) {
        it(`${filePath} should throw InvalidDependencyError`, () => {
            expect(() => {
                setInput(packageJsonPathKey, filePath)
                return validateDependencies()
            }).toThrow(InvalidDependencyError)
        })
    }

    it('should report every invalid dependency at once', () => {
        expect(() => {
            setInput(packageJsonPathKey, 'tests/invalid_dependencies/invalid_has_multiple.json')
            return validateDependencies()
        }).toThrow("Dependencies invalid: '{ @actions/core: ^1.9.1 }', '{ jest: ~26.6.3 }'")
    })

    it('should keep the single dependency message format', () => {
        expect(() => {
            setInput(packageJsonPathKey, 'tests/invalid_dependencies/invalid_has_caret.json')
            return validateDependencies()
        }).toThrow("Dependency invalid: '{ jest: ^26.6.3 }'")
    })
})
