module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/+(*.)+(spec|test).+(ts|js)?(x)'],
    transform: {
      '^.+\\.(ts|js|html)$': 'ts-jest',
    },
    transformIgnorePatterns: ['<rootDir>/node_modules/'],
    moduleFileExtensions: ['ts', 'js', 'html'],
    setupFilesAfterEnv: ['<rootDir>/setupTests.js']
};