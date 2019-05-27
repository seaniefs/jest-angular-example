module.exports = {
  verbose: true,
  preset: "jest-preset-angular",
  setupFilesAfterEnv: ["<rootDir>/src/jest/jest.setup.ts"],
  testMatch: ['**/src/app/+(*.)+(pact).+(ts)'],
};
