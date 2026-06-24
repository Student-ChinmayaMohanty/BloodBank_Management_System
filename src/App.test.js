import { render, screen } from '@testing-library/react';
import App from './App';

test('renders landing selection buttons', () => {
  render(<App />);
  const donorButton = screen.getByText(/Donor Portal/i);
  const adminButton = screen.getByText(/Admin Portal/i);
  expect(donorButton).toBeInTheDocument();
  expect(adminButton).toBeInTheDocument();
});
