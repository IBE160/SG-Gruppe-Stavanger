import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RegisterPage from '../register/page';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock next-auth/react
jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

// Mock the fetch API
global.fetch = jest.fn();

describe('RegisterPage', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (signIn as jest.Mock).mockReset();
    (global.fetch as jest.Mock).mockReset();
    mockPush.mockReset();
  });

  it('renders the registration form', () => {
    render(<RegisterPage />);

    expect(screen.getByRole('heading', { name: /register/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  it('handles successful registration and automatic login', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'User registered successfully' }),
    });
    (signIn as jest.Mock).mockResolvedValueOnce({ ok: true, error: null });

    render(<RegisterPage />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'Password123!' } });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/auth/register', expect.any(Object));
    });

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('credentials', {
        redirect: false,
        email: 'test@example.com',
        password: 'Password123!',
      });
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });

    expect(screen.getByText(/Registration successful! Attempting to log in.../i)).toBeInTheDocument();
  });

  it('displays an error message on failed registration', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'User with this email already exists' }),
    });

    render(<RegisterPage />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'existing@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'Password123!' } });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByText(/User with this email already exists/i)).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/auth/register', expect.any(Object));
    expect(signIn).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('displays an error message if automatic login fails after successful registration', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'User registered successfully' }),
    });
    (signIn as jest.Mock).mockResolvedValueOnce({ ok: false, error: 'Invalid credentials' });

    render(<RegisterPage />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'Password123!' } });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByText(/Registration successful, but automatic login failed: Invalid credentials/i)).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/auth/register', expect.any(Object));
    expect(signIn).toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });
});
