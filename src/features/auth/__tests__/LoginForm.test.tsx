import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { store } from '../../../store/store';
import { LoginForm } from '../LoginForm';

// Mock do módulo de API
jest.mock('../../../api/auth', () => ({
  login: jest.fn().mockResolvedValue({ token: 'fake-token' }),
}));

describe('LoginForm Integration', () => {
  beforeEach(() => {
    // Limpar todos os mocks antes de cada teste
    jest.clearAllMocks();
  });

  it('deve enviar o formulário com credenciais válidas', async () => {
    render(
      <Provider store={store}>
        <LoginForm />
      </Provider>
    );

    // Simular preenchimento do formulário
    const emailInput = screen.getByLabelText(/e-mail/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    await userEvent.type(emailInput, 'usuario@exemplo.com');
    await userEvent.type(passwordInput, 'senha123');
    
    fireEvent.click(submitButton);

    // Verificar se a API foi chamada com os dados corretos
    await waitFor(() => {
      expect(require('../../../api/auth').login).toHaveBeenCalledWith({
        email: 'usuario@exemplo.com',
        password: 'senha123',
      });
    });
  });

  it('deve mostrar mensagem de erro para credenciais inválidas', async () => {
    // Mock de erro da API
    require('../../../api/auth').login.mockRejectedValueOnce(
      new Error('Credenciais inválidas')
    );

    render(
      <Provider store={store}>
        <LoginForm />
      </Provider>
    );

    const emailInput = screen.getByLabelText(/e-mail/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    await userEvent.type(emailInput, 'invalido@exemplo.com');
    await userEvent.type(passwordInput, 'senhaerrada');
    
    fireEvent.click(submitButton);

    // Verificar se a mensagem de erro é exibida
    await waitFor(() => {
      expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument();
    });
  });
}); 