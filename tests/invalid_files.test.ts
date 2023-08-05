import {describe, expect, it} from '@jest/globals'
import checkDependencies from '../src/check_dependencies'
import {InvalidPackageFileError} from '../src/errors'
import {get_test_file_names} from '../src/utils'

const invalidJsonFiles = ['', 'non_existing_package.json', ...get_test_file_names('tests/invalid_files')]

describe('Test invalid/malformed json files', () => {
    for (const filePath of invalidJsonFiles) {
        it(`${filePath} should throw InvalidPackageFileError`, () => {
            expect(() => checkDependencies(filePath)).toThrow(InvalidPackageFileError)
        })
    }
})
