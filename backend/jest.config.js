/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.test.ts',
    '!src/**/__tests__/**'
  ],
  // Set timeout for tests and better handle async operations
  testTimeout: 10000,
  // Automatically detect open handles
  detectOpenHandles: true,
  // Force Jest to exit after all tests are complete
  forceExit: true
}; 