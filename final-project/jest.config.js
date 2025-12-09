module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'controllers/**/*.js',
    'routes/**/*.js',
    '!routes/auth.js'
  ],
  testMatch: ['**/tests/**/*.test.js'],
  verbose: true
};
