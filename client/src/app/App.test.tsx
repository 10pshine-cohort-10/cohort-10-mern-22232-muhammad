import { render, screen } from '@testing-library/react';
import { App } from './App';

describe('App', () => {
  it('boots with the browser router and theme provider and renders the landing page', () => {
    render(<App />);

    expect(screen.getByRole('heading', { level: 1, name: /your thoughts/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /theme/i })).toBeInTheDocument();
  });
});
