import {describe, expect, it} from '@jest/globals'
import {get_test_file_names, setInput} from '../src/utils'
import {packageJsonPathKey} from '../src/constants'
import validateDependencies from '../src/run_checker'

describe('Test valid json files', () => {
    for (const filePath of get_test_file_names('tests/valid_files')) {
        it(`${filePath} should not throw error`, () => {
            expect(() => {
                setInput(packageJsonPathKey, filePath)
                return validateDependencies()
            }).not.toThrow()
        })
    }
})
