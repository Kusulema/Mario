/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.test.ts'],
  collectCoverage: true,
  coverageDirectory: './coverage',
  transform: {
    '^.+\.ts$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
    }],
  },
  // remove globals configuration as it's deprecated
};