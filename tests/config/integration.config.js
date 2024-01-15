module.exports = {
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageProvider: "v8",
    testRegex: '.*\\.it-test\\.js$',
    testEnvironment: 'node',
    globalSetup: '../tests/jest.globalSetup.js',
    globalTeardown: '../tests/jest.globalTeardown.js',
};