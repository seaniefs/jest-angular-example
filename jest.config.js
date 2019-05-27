module.exports = {
  verbose: true,
  preset: "jest-preset-angular",
  setupFilesAfterEnv: ["<rootDir>/src/jest/jest.setup.ts"],
  testMatch: ['**/src/app/+(*.)+(spec).+(ts)'],
  testResultsProcessor: 'jest-sonar-reporter',
  collectCoverageFrom: [
    '**/src/app/**/*.{ts,tsx,html}',
    '!**/node_modules/**',
    '!**/jest/**',
    '!**/*.pact.ts'
  ]
};
