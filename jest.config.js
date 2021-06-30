module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/build/', '/build/__test__'],
  collectCoverage: false,
  testTimeout: 50000,
  setupFilesAfterEnv: ['./jest.setup.ts'],
};
