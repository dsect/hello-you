import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the app title', () => {
    render(<App />);
    expect(screen.getByText('Vite + React + Supabase')).toBeInTheDocument();
  });

  it('renders the counter button', () => {
    render(<App />);
    const button = screen.getByRole('button', { name: /count is/i });
    expect(button).toBeInTheDocument();
  });

  it('increments counter when button is clicked', () => {
    render(<App />);
    const button = screen.getByRole('button', { name: /count is/i });

    // Initial state
    expect(button).toHaveTextContent('count is 0');

    // Click the button
    fireEvent.click(button);
    expect(button).toHaveTextContent('count is 1');

    // Click again
    fireEvent.click(button);
    expect(button).toHaveTextContent('count is 2');
  });
});