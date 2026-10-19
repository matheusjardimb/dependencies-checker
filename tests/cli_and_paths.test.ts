import {beforeEach, describe, expect, it, jest} from '@jest/globals'
import * as core from '@actions/core'
import {InvalidDependencyError, InvalidPackageFileError, MultipleFilesError, UnknownOptionError} from '../src/errors'
import {setInput} from './utils'
import {packageJsonPathKey, quietModeKey} from '../src/constants'
import validateDependencies from '../src/run_checker'

const validFile = 'tests/valid_files/valid_single_block_without_settings.json'
const invalidFile = 'tests/invalid_dependencies/invalid_has_caret.json'

describe('Test command line arguments', () => {
    beforeEach(() => {
        setInput(packageJsonPathKey, '')
        setInput(quietModeKey, '')
    })

    it('should read the path from the command line', () => {
        expect(() => validateDependencies([invalidFile])).toThrow(InvalidDependencyError)
        expect(() => validateDependencies([validFile])).not.toThrow()
    })

    it('should prefer the command line path over the packageJsonPath input', () => {
        setInput(packageJsonPathKey, invalidFile)
        expect(() => validateDependencies([validFile])).not.toThrow()
    })

    it('should not log anything with --quiet', () => {
        const spy = jest.spyOn(core, 'info')
        validateDependencies(['--quiet', validFile])
        expect(spy).not.toHaveBeenCalled()
    })

    it('should reject unknown options', () => {
        expect(() => validateDependencies(['--strict', validFile])).toThrow(UnknownOptionError)
    })
})

describe('Test multiple package.json files', () => {
    beforeEach(() => {
        setInput(packageJsonPathKey, '')
        setInput(quietModeKey, 'true')
    })

    it('should check every path listed in the packageJsonPath input', () => {
        setInput(packageJsonPathKey, `${validFile}\ntests/valid_files/valid_ignore_block.json`)
        expect(() => validateDependencies()).not.toThrow()
    })

    it('should report every failing file at once', () => {
        const spy = jest.spyOn(core, 'error')
        expect(() => validateDependencies([validFile, invalidFile, 'non_existing_package.json'])).toThrow(
            '2 of 3 files failed, see the errors above'
        )
        expect(spy.mock.calls).toEqual([
            [`${invalidFile}: Dependency invalid: '{ jest: ^26.6.3 }'`],
            [`non_existing_package.json: Invalid input file: 'non_existing_package.json'`]
        ])
    })

    it('should expand glob patterns and skip node_modules', () => {
        const spy = jest.spyOn(core, 'error')
        expect(() => validateDependencies(['tests/monorepo/**/package.json'])).toThrow(
            '1 of 3 files failed, see the errors above'
        )
        expect(spy.mock.calls).toEqual([
            ["tests/monorepo/packages/app/package.json: Dependency invalid: '{ react: ^18.2.0 }'"]
        ])
        expect(() => validateDependencies(['tests/monorepo/packages/lib/*.json'])).not.toThrow()
    })

    it('should keep the original error when a pattern matches a single file', () => {
        expect(() => validateDependencies(['tests/monorepo/packages/app/*.json'])).toThrow(InvalidDependencyError)
    })

    it('should fail when a pattern matches no file', () => {
        expect(() => validateDependencies(['tests/monorepo/missing/*/package.json'])).toThrow(InvalidPackageFileError)
    })

    it('should use MultipleFilesError when several files are checked', () => {
        expect(() => validateDependencies([validFile, invalidFile])).toThrow(MultipleFilesError)
    })
})
