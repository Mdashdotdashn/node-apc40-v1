module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/test'],
  testMatch: [
    '**/__tests__/**/*.[jt]s',
    '**/?(*.)+(spec|test).[jt]s'
  ],
};
