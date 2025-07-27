module.exports = {
  moduleDirectories: ['node_modules', 'components', 'PrinterAir'],
  moduleNameMapper: {
    '\\.svg$': '<rootDir>/src/__mocks__/svg.ts',
  },
  globalSetup: '<rootDir>/globalSetup.ts',
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    uuid: require.resolve('uuid'),
  },
  globals: {
    'ts-jest': {
      tsconfig: {
        jsx: 'react',
      },
    },
  },
};
