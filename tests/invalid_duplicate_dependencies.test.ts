import {describe, expect, it} from '@jest/globals'
import {DuplicateDependencyError} from '../src/errors'
import {get_test_file_names, setInput} from '../src/utils'
import {packageJsonPathKey} from '../src/constants'
import validateDependencies from '../src/run_checker'

describe('Test invalid duplicate dependencies', () => {
    for (const filePath of get_test_file_names('tests/invalid_duplicate_dependencies')) {
        it(`${filePath} should throw InvalidDependencyError`, () => {
            expect(() => {
                setInput(packageJsonPathKey, filePath)
                return validateDependencies()
            }).toThrow(DuplicateDependencyError)
        })
    }
})
