import {describe, expect, it} from '@jest/globals'
import checkDependencies from '../src/check_dependencies'

describe('Test invalid dependencies in json files', () => {
  it('invalid_missing_dependency_block.json should throw error', () => {
    expect(() => {
      checkDependencies(
        'tests/invalid_files/invalid_missing_dependency_block.json'
      )
    }).toThrow(Error)
  })
})
