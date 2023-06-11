const checkDependencies = require('../lib/check_dependencies');
const dependencyBlocksToCheck = ['dependencies', 'devDependencies'];

describe('Test invalid json files', () => {
  it('malformed_package.json should throw SyntaxError', () => {
    expect(() => checkDependencies('tests/invalid/malformed_package.json', [], dependencyBlocksToCheck)).toThrow(SyntaxError);
  });

  it('non_existing_package.json should throw SyntaxError', () => {
    expect(() => checkDependencies('tests/invalid/non_existing_package.json', [], dependencyBlocksToCheck)).toThrow();
  });

  it('package_has_caret.json should throw Error', () => {
    expect(() => checkDependencies('tests/invalid/package_has_caret.json', [], dependencyBlocksToCheck)).toThrow();
  });
});
describe('Test valid json files', () => {
  it('package_1.json should not throw error', () => {
    expect(() => {
      checkDependencies('tests/valid/package_1.json', [], dependencyBlocksToCheck);
    }).not.toThrow(SyntaxError);
  });

  it('package_2.json should not throw error', () => {
    expect(() => {
      checkDependencies('tests/valid/package_2.json', [], dependencyBlocksToCheck);
    }).not.toThrow(SyntaxError);
  });
});
