module.exports = {
  testResultsProcessor: 'jest-sonar-reporter',
  collectCoverageFrom: [
    '**/src/app/**/*.{ts,tsx,html}',
    '!**/node_modules/**',
    '!**/jest/**',
    '!**/*.pact.ts'
  ]
};
