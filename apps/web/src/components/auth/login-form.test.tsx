import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from './login-form';
import { useApi } from '@/hooks/use-api';

// useRouter mock
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// useApi hook mock
jest.mock('@/hooks/use-api', () => ({
  useApi: jest.fn(),
}));

describe('LoginForm', () => {
  // Mock local storage
  let localStorageMock: Record<string, string> = {};
  
  beforeEach(() => {
    // Setup localStorage mock
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: (key: string) => localStorageMock[key] || null,
        setItem: (key: string, value: string) => {
          localStorageMock[key] = value;
        },
        removeItem: (key: string) => {
          delete localStorageMock[key];
        },
        clear: () => {
          localStorageMock = {};
        },
      },
      writable: true,
    });
    
    // Reset local storage before each test
    localStorageMock = {};
    
    // Default mock implementation for useApi
    (useApi as jest.Mock).mockReturnValue({
      login: jest.fn().mockResolvedValue({ token: 'test-token', user: { id: '1', email: 'test@example.com' } }),
      isLoading: false,
      error: null,
    });
  });
  
  test('renders login form correctly', () => {
    render(<LoginForm />);
    
    expect(screen.getByText('Giriş Yap')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Şifre')).toBeInTheDocument();
    expect(screen.getByText('Şifremi Unuttum')).toBeInTheDocument();
    expect(screen.getByText('Kayıt Ol')).toBeInTheDocument();
  });
  
  test('shows validation error when submitting without email', async () => {
    render(<LoginForm />);
    
    // Fill only password
    fireEvent.change(screen.getByLabelText('Şifre'), { target: { value: 'password123' } });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'Giriş Yap' }));
    
    // Check for validation error
    await waitFor(() => {
      expect(screen.getByText('Email adresi gereklidir.')).toBeInTheDocument();
    });
  });
  
  test('shows validation error when submitting without password', async () => {
    render(<LoginForm />);
    
    // Fill only email
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'Giriş Yap' }));
    
    // Check for validation error
    await waitFor(() => {
      expect(screen.getByText('Şifre gereklidir.')).toBeInTheDocument();
    });
  });
  
  test('calls login API and redirects on successful login', async () => {
    const mockLogin = jest.fn().mockImplementation((email, password, onSuccess) => {
      onSuccess({ token: 'test-token', user: { id: '1', email } });
      return Promise.resolve({ token: 'test-token', user: { id: '1', email } });
    });
    
    (useApi as jest.Mock).mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: null,
    });
    
    const mockPush = jest.fn();
    (require('next/navigation') as any).useRouter = () => ({ push: mockPush });
    
    render(<LoginForm />);
    
    // Fill the form
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Şifre'), { target: { value: 'password123' } });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'Giriş Yap' }));
    
    // Check if login was called with correct params
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
        expect.any(Function),
        expect.any(Function)
      );
    });
    
    // Check if token was saved to localStorage
    expect(localStorage.getItem('auth_token')).toBe('test-token');
    
    // Check if redirect was called
    expect(mockPush).toHaveBeenCalledWith('/admin');
  });
  
  test('shows error message on login failure', async () => {
    const errorMessage = 'Geçersiz kimlik bilgileri';
    const mockLogin = jest.fn().mockImplementation((email, password, onSuccess, onError) => {
      onError(errorMessage);
      return Promise.resolve(null);
    });
    
    (useApi as jest.Mock).mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: null,
    });
    
    render(<LoginForm />);
    
    // Fill the form
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Şifre'), { target: { value: 'wrong-password' } });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'Giriş Yap' }));
    
    // Check for error message
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
  
  test('displays loading state during login', async () => {
    // Mock isLoading state
    (useApi as jest.Mock).mockReturnValue({
      login: jest.fn(),
      isLoading: true,
      error: null,
    });
    
    render(<LoginForm />);
    
    // Check for loading state
    expect(screen.getByText('Giriş yapılıyor')).toBeInTheDocument();
    
    // Check if button is disabled
    const button = screen.getByRole('button', { name: 'Giriş yapılıyor' });
    expect(button).toBeDisabled();
  });
  
  test('toggles password visibility', () => {
    render(<LoginForm />);
    
    // Password should be hidden initially
    const passwordInput = screen.getByLabelText('Şifre');
    expect(passwordInput).toHaveAttribute('type', 'password');
    
    // Click visibility toggle button
    const toggleButton = passwordInput.parentElement?.querySelector('button') as HTMLButtonElement;
    fireEvent.click(toggleButton);
    
    // Password should now be visible
    expect(passwordInput).toHaveAttribute('type', 'text');
    
    // Click toggle button again
    fireEvent.click(toggleButton);
    
    // Password should be hidden again
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
});
