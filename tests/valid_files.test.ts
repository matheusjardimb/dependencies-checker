import {describe, expect, it} from '@jest/globals'
import checkDependencies from '../src/check_dependencies'
import get_test_file_names from '../src/utils'

describe('Test valid json files', () => {
    for (const filePath of get_test_file_names('tests/valid_files')) {
        it(`${filePath} should not throw error`, () => {
            expect(() => checkDependencies(filePath)).not.toThrow()
        })
    }
})
