module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/projects/marketplace/src/setup-jest.ts'],
  testPathIgnorePatterns: ['<rootDir>/projects/marketplace/cypress/'],
};
