import type { Config } from 'jest';
import nextJest from 'next/jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

const createJestConfig = nextJest({
  // Forneça o caminho para o seu aplicativo Next.js
  dir: './',
});

// Configuração do Jest personalizada
const config: Config = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/*.test.{js,jsx,ts,tsx}',
    '!src/pages/_app.tsx',
    '!src/pages/_document.tsx',
  ],
  coverageThreshold: {
    global: {
      statements: 3, 
      branches:   1, 
      functions:  2, 
      lines:      3 
    },
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
};

// createJestConfig é exportado desta forma para garantir que next/jest possa carregar a configuração Next.js
export default createJestConfig(config); 