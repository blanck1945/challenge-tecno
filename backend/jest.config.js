module.exports = {
  moduleNameMapper: {
    '^@uploadcare/upload-client$':
      '<rootDir>/src/__mocks__/uploadcareMock.ts',
  },
  preset: 'ts-jest',
  testEnvironment: 'node',
  };
  