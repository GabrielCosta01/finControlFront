import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../button';

describe('Button Component', () => {
  it('deve renderizar o botão com o texto correto', () => {
    render(<Button>Clique aqui</Button>);
    
    const button = screen.getByText('Clique aqui');
    expect(button).toBeInTheDocument();
  });

  it('deve chamar a função onClick quando clicado', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Clique aqui</Button>);
    
    const button = screen.getByText('Clique aqui');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('deve estar desabilitado quando a prop disabled é true', () => {
    render(<Button disabled>Clique aqui</Button>);
    
    const button = screen.getByText('Clique aqui');
    expect(button).toHaveAttribute('disabled');
  });
}); 