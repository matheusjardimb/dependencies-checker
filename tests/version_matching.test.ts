import {describe, expect, it} from '@jest/globals'
import {hasDescriptor, isPinnedVersion, isValidDependency} from '../src/check_dependencies'
import {invalidVersionDescriptorsDefault} from '../src/constants'

describe('hasDescriptor', () => {
    it.each([
        ['1.x', 'x', true],
        ['1.2.X', 'x', true],
        ['x', 'x', true],
        ['1.x || 2.x', 'x', true],
        ['next', 'x', false],
        ['1.2.3', 'x', false],
        ['1.0.0 - 2.0.0', '-', true],
        ['1.0.0-beta.1', '-', false],
        ['npm:lodash-es@4.17.21', '-', false],
        ['^1.2.3', '^', true],
        ['latest', 'latest', true],
        ['1.2.3', '^', false]
    ])("'%s' has descriptor '%s': %s", (version, descriptor, expected) => {
        expect(hasDescriptor(version, descriptor)).toBe(expected)
    })
})

describe('isPinnedVersion', () => {
    it.each([
        ['1.2.3', true],
        ['v1.2.3', true],
        ['=1.2.3', true],
        ['1.2.3-rc.1+build.5', true],
        ['npm:lodash-es@4.17.21', true],
        ['npm:@scope/pkg@1.0.0', true],
        ['user/repo#0f1e2d3', true],
        ['git+https://github.com/user/repo.git#0f1e2d3c4b5a69788796a5b4c3d2e1f0a9b8c7d6', true],
        ['file:../local', true],
        ['./local', true],
        ['https://example.com/pkg-1.0.0.tar.gz', true],
        ['1', false],
        ['1.2', false],
        ['beta', false],
        ['user/repo', false],
        ['user/repo#main', false],
        ['npm:lodash-es', false],
        ['npm:@scope/pkg', false],
        ['npm:lodash-es@^4.17.21', false],
        ['https://example.com/repo', false]
    ])("'%s' is pinned: %s", (version, expected) => {
        expect(isPinnedVersion(version)).toBe(expected)
    })
})

describe('isValidDependency', () => {
    it.each([
        ['1.2.3', false, true],
        ['1.2', false, true],
        ['1.2', true, false],
        ['^1.2.3', false, false],
        ['^1.2.3', true, false],
        ['', false, false],
        [{version: '1.2.3'}, false, false],
        [undefined, false, false]
    ])("'%p' with strict mode %s is valid: %s", (version, strictMode, expected) => {
        expect(isValidDependency(version, invalidVersionDescriptorsDefault, strictMode)).toBe(expected)
    })
})
