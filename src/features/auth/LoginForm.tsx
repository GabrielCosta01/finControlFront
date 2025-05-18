import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../../api/auth';
import { setToken, setError } from './authSlice';
import { Button } from '../../components/ui/button';

export const LoginForm = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login({ email, password });
      dispatch(setToken(response.token));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Credenciais inválidas';
      setErrorMessage(message);
      dispatch(setError(message));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">E-mail</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">Senha</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {errorMessage && <div>{errorMessage}</div>}
      <Button type="submit">Entrar</Button>
    </form>
  );
}; 