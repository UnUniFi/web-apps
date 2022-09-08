module.exports = {
  testPathIgnorePatterns: ['<rootDir>/node_modules/', 'cypress'],
  moduleNameMapper: {
    'projects/(.*)': '<rootDir>/projects/$1',
  },
};
