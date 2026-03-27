import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface AuthIntegrationProps {
  onLoginSuccess?: (user: any) => void;
  onLoginError?: (error: any) => void;
  children: (props: { handleLogin: (role: string, id: string) => void; isLoading: boolean; error: string | null }) => React.ReactNode;
}

/**
 * HOC to integrate authentication with frontend components
 * Handles the login process and passes control back to the component
 */
export const withAuthIntegration = <P extends { onLogin: (role: string, id: string) => void }>(
  Component: React.ComponentType<P>
) => {
  return (props: Omit<P, 'onLogin'> & { onLoginSuccess?: (user: any) => void; onLoginError?: (error: any) => void }) => {
    const { login, register, isLoading, error, clearError } = useAuth();
    const [localError, setLocalError] = useState<string | null>(null);

    const handleLogin = async (role: string, id: string) => {
      setLocalError(null);
      clearError();

      // Note: The frontend onLogin expects role and id, but actual login
      // requires email and password. This will be handled by the enhanced
      // modal which will collect email/password from the user.
      // For now, we store these values and await email/password from form.
      
      try {
        // This will be called after user submits email/password in modal
        // See enhanced LandingPage integration below
        console.log('Login initiated for:', { role, id });
      } catch (err: any) {
        setLocalError(err.message);
        props.onLoginError?.(err);
      }
    };

    return (
      <Component
        {...(props as P)}
        onLogin={handleLogin}
      />
    );
  };
};

/**
 * API Integration Helper
 * Handles the actual API calls for registration and login
 */
export const useAuthAPI = () => {
  const { register, login, isLoading, error } = useAuth();

  const registerUser = async (userData: any) => {
    return await register(userData);
  };

  const loginUser = async (id: string, password: string, role: string) => {
    return await login(id, password, role);
  };

  return {
    registerUser,
    loginUser,
    isLoading,
    error,
  };
};

/**
 * Wrapper component for seamless integration
 * This allows existing components to work with the backend without modification
 */
export const AuthIntegrationWrapper: React.FC<AuthIntegrationProps> = ({
  onLoginSuccess,
  onLoginError,
  children,
}) => {
  const { login, register, isLoading, error, clearError } = useAuth();
  const [localError, setLocalError] = useState<string | null>(null);

  const handleLogin = async (role: string, id: string) => {
    setLocalError(null);
    clearError();
    
    // This is the bridge between frontend and backend
    // The frontend calls onLogin(role, id), and we can extend it
    // The actual email/password will come from the form
    try {
      // For now, just track the login attempt
      console.log('Auth integration: Login initiated', { role, id });
    } catch (err: any) {
      const errorMsg = err.message || 'Login failed';
      setLocalError(errorMsg);
      onLoginError?.(err);
    }
  };

  return (
    <>
      {children({
        handleLogin,
        isLoading,
        error: error || localError,
      })}
    </>
  );
};
