/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { useESM: true, tsconfig: 'tsconfig.json' }],
  },
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  roots: ['<rootDir>/src', '<rootDir>/test', '<rootDir>/test'],
  collectCoverage: false,
  watchPathIgnorePatterns: ['<rootDir>/dist', '<rootDir>/node_modules'],
  verbose: true,
};
