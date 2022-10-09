module.exports = {
  clearMocks: true,
  collectCoverage: false,
  coverageDirectory: "coverage",
  moduleFileExtensions: ["ts", "tsx", "js"],
  testEnvironment: "jsdom",
  testRegex: "(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$",
  transform: {
    ".(ts|tsx)": ["ts-jest"],
  },
  moduleNameMapper: {
    '\\.(scss|sass|css)$': '<rootDir>/__mocks__/styleMock.js'
  }
};
