import {describe, expect, it} from '@jest/globals'
import {get_test_file_names, setInput} from '../src/utils'
import {packageJsonPathKey} from '../src/constants'
import validateDependencies from '../src/run_checker'

describe('Test invalid dependencies in json files', () => {
    for (const filePath of get_test_file_names('tests/invalid_settings')) {
        it(`${filePath} should throw error`, () => {
            expect(() => {
                setInput(packageJsonPathKey, filePath)
                return validateDependencies()
            }).toThrow(Error)
        })
    }
})
