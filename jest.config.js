const nextJest = require('next/jest');

// Providing the path to your Next.js app to load next.config.js and .env files in your test environment
const createJestConfig = nextJest({
  dir: './apps/web',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    // Handle module aliases (this will be automatically configured when using Next.js 13+)
    '^@/components/(.*)$': '<rootDir>/apps/web/src/components/$1',
    '^@/app/(.*)$': '<rootDir>/apps/web/src/app/$1',
    '^@/hooks/(.*)$': '<rootDir>/apps/web/src/hooks/$1',
    '^@/lib/(.*)$': '<rootDir>/apps/web/src/lib/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
  transform: {
    // Use babel-jest to transpile tests with the next/babel preset
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  transformIgnorePatterns: ['/node_modules/', '^.+\\.module\\.(css|sass|scss)$'],
  moduleDirectories: ['node_modules', '<rootDir>/'],
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: [
    'apps/web/src/**/*.{js,jsx,ts,tsx}',
    'apps/server/src/**/*.{js,ts}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
