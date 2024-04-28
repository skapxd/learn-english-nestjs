const { pathsToModuleNameMapper } = require('ts-jest');
const path = require('path');
const { compilerOptions } = require('./tsconfig');
require('dotenv').config();

const coverageDirectory = path.join(process.cwd(), 'test', 'coverage');

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: path.resolve(__dirname),
  }),
  preset: 'ts-jest',
  testTimeout: 30_000,
  //
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    "^.+\\.(t|j)s?$": ["@swc/jest"]
    // '^.+\\.(t|j)s$': 'ts-jest',
  },
  testEnvironment: 'node',
  coverageDirectory,
  coverageReporters: ['html'],
  collectCoverage: true,
  reporters: [
    'default',
    'jest-sonar',
    [
      'jest-html-reporter',
      {
        outputPath: 'test/result-test/index.html',
        pageTitle: 'Test Report',
        darkTheme: true,
        inlineSource: true,
      },
    ],
    [
      'jest-junit',
      {
        outputDirectory: 'test/junit',
        outputName: 'test-results.xml',
      },
    ],
    [
      '@jest-performance-reporter/core',
      {
        errorAfterMs: 1000,
        warnAfterMs: 500,
        logLevel: 'warn',
        maxItems: 5,
        jsonReportPath: 'test/performance-report/performance-report.json',
        csvReportPath: 'test/performance-report/performance-report.csv',
      },
    ],
  ],
  coverageThreshold: {
    global: {
      branches: 10,
      functions: 10,
      lines: 10,
      statements: 10,
    },
  },
};
