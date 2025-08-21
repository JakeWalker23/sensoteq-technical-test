import type { Config } from 'jest';

const config: Config = {
  // Compile TS on the fly using ts-jest in ESM mode
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  // Treat .ts as ESM so imports work with "type": "module" / NodeNext
  extensionsToTreatAsEsm: ['.ts'],
  // Fix for ESM path imports that end with .js in compiled output
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  // Look for tests in src or tests folders
  testMatch: ['**/?(*.)+(spec|test).ts'],
  roots: ['<rootDir>/src', '<rootDir>/test'],
  // Speed up CI noise
  collectCoverage: false,
  // Good default so watch mode works nicely locally
  watchPathIgnorePatterns: ['<rootDir>/dist', '<rootDir>/node_modules'],
};

export default config;
