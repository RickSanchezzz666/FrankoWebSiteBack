/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
    rootDir: '../../project',
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageProvider: "v8",
    testRegex: '.*\\.(it-)?spec\\.js$',
    testEnvironment: 'node',
    globalSetup: '../tests/jest.globalSetup.js',
    globalTeardown: '../tests/jest.globalTeardown.js',
    coveragePathIgnore: [
        '/node_modules/'
    ],
    coverageThreshold: {
        global: {
            branches: 58,
            functions: 66,
            lines: 66,
            statements: 66
        }
    }
};
