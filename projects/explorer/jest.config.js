require('jest-preset-angular/ngcc-jest-processor');

module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/projects/explorer/src/setup-jest.ts'],
  testPathIgnorePatterns: ['<rootDir>/projects/explorer/cypress/']
};
