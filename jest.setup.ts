import '@testing-library/jest-dom';

// Configurações globais para testes
beforeAll(() => {
  // Limpar todos os mocks antes de cada teste
  jest.clearAllMocks();
});

// Silenciar warnings do console durante os testes
global.console = {
  ...console,
  // Manter o erro no console para debug
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
}; 