import {describe, expect, it} from '@jest/globals'
import {get_test_file_names, setInput} from '../src/utils'
import {packageJsonPathKey} from '../src/constants'
import validateDependencies from '../src/run_checker'

describe('Test valid dependency-checker package.json file', () => {
    it(`lib's package.json should not throw error`, () => {
        expect(() => validateDependencies()).not.toThrow()
    })
})
