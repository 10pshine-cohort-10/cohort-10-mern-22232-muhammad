import { fileURLToPath } from 'node:url';

const importMetaPlugin = fileURLToPath(new URL('./jest/babel-plugin-import-meta.cjs', import.meta.url));

/** @type {import('jest').Config} */
export default {
  // jsdom + Node's Fetch API globals (Request, Response, Headers) that React Router and MSW need.
  testEnvironment: 'jest-fixed-jsdom',
  roots: ['<rootDir>/src'],
  setupFiles: ['<rootDir>/jest/polyfills.cjs'],
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  transform: {
    '^.+\\.m?[jt]sx?$': [
      'babel-jest',
      {
        presets: [
          ['@babel/preset-env', { targets: { node: 'current' } }],
          ['@babel/preset-react', { runtime: 'automatic' }],
          '@babel/preset-typescript',
        ],
        // React Router uses `import.meta`, which has no CommonJS equivalent without this plugin.
        plugins: [importMetaPlugin],
      },
    ],
  },
  // React Router ships ESM only; let Babel transpile it (and its ESM deps) for Jest's CommonJS runtime.
  transformIgnorePatterns: [
    '/node_modules/(?!(react-router|@remix-run|cookie-es|cookie|set-cookie-parser)/)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss)$': 'identity-obj-proxy',
    '\\.(svg|png|jpg|jpeg|gif|webp|woff2?)$': '<rootDir>/src/test/file-stub.ts',
  },
  testMatch: ['**/*.test.{ts,tsx}'],
  clearMocks: true,
  restoreMocks: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/main.tsx',
    '!src/test/**',
    '!src/**/*.d.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: { lines: 75, statements: 75, functions: 75, branches: 70 },
  },
};
