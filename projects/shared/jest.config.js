module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/projects/shared/src/setup-jest.ts'],
  testPathIgnorePatterns: ['<rootDir>/projects/shared/cypress/'],
};
