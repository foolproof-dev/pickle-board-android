import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the server selection screen on start', () => {
  render(<App />);
  expect(screen.getByText(/who serves first\?/i)).toBeInTheDocument();
  expect(screen.getByText('Team A')).toBeInTheDocument();
  expect(screen.getByText('Team B')).toBeInTheDocument();
});
