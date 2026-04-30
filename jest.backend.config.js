module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./api/tests/setup.js'],
  testMatch: ['**/api/tests/**/*.test.js'],
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
};
