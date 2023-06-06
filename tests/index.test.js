const checkDependencies = require('../lib/check_dependencies');
describe('Test invalid json files', () => {
  it('malformed_package.json should throw SyntaxError', () => {
    expect(
      () => checkDependencies('tests/invalid/malformed_package.json')
    ).toThrow(SyntaxError);
  });

  it('non_existing_package.json should throw SyntaxError', () => {
    expect(
      () => checkDependencies('tests/invalid/non_existing_package.json')
    ).toThrow();
  });

  it('package_has_caret.json should throw Error', () => {
    expect(
      () => checkDependencies('tests/invalid/package_has_caret.json')
    ).toThrow();
  });
});

describe('Test valid json files', () => {
  it('package_1.json should not throw error', () => {
    expect(
      () => checkDependencies('tests/valid/package_1.json')
    ).not.toThrow(SyntaxError);
  });

  it('package_2.json should not throw error', () => {
    expect(
      () => checkDependencies('tests/valid/package_2.json')
    ).not.toThrow(SyntaxError);
  });
});
