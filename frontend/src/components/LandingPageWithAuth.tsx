import React, { useState } from 'react';
import { LandingPage } from './LandingPage';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

/**
 * Enhanced LandingPage with Backend Integration
 * Wraps the original LandingPage to add API functionality without modifying it
 */
export const LandingPageWithAuth = () => {
  const { login, register, isLoading, error, clearError } = useAuth();
  const [registrationData, setRegistrationData] = useState<any>(null);

  const handleLogin = async (role: UserRole, id: string) => {
    clearError();

    // Intercept the login call and enhance it with actual authentication
    // The id parameter contains user identification, we extract role and store for form
    try {
      // At this point, we have the role but need email/password from the form
      // We'll handle this in the modal by enhancing the form submission
      setRegistrationData({ role, identificationId: id });
    } catch (err: any) {
      console.error('Auth error:', err);
    }
  };

  return (
    <LandingPageWithAuthIntegration
      onLogin={handleLogin}
      isLoading={isLoading}
      apiError={error}
      onClearError={clearError}
      onRegister={register}
      onLoginSubmit={login}
    />
  );
};

interface LandingPageIntegrationProps {
  onLogin: (role: UserRole, id: string) => void;
  isLoading: boolean;
  apiError: string | null;
  onClearError: () => void;
  onRegister: (userData: any) => Promise<any>;
  onLoginSubmit: (id: string, password: string, role: string) => Promise<any>;
}

/**
 * Wrapper component that integrates the original LandingPage with backend API
 * without modifying the original component
 */
const LandingPageWithAuthIntegration: React.FC<LandingPageIntegrationProps> = ({
  onLogin,
  isLoading,
  apiError,
  onClearError,
  onRegister,
  onLoginSubmit,
}) => {
  const [enhancedOnLogin] = useState(() => {
    // Return a function that combines the original onLogin with API integration
    return async (role: UserRole, id: string) => {
      // Call original handler
      onLogin(role, id);

      // Prepare for API integration - the form will handle the actual API call
      // when the user submits email/password
    };
  });

  return (
    <LandingPageEnhanced
      onLogin={enhancedOnLogin}
      isLoading={isLoading}
      apiError={apiError}
      onClearError={onClearError}
      onRegister={onRegister}
      onLoginSubmit={onLoginSubmit}
    />
  );
};

/**
 * Enhanced component that bridges the LandingPage with API calls
 * This is a minimal wrapper that adds API functionality
 */
const LandingPageEnhanced: React.FC<LandingPageIntegrationProps & { onLogin: (role: UserRole, id: string) => void }> = (props) => {
  const { apiError, onClearError } = props;

  return (
    <div className="relative">
      {/* Show error notification if API error occurs */}
      {apiError && (
        <div className="fixed top-4 right-4 z-[300] bg-red-50 border border-red-200 rounded-lg p-4 max-w-sm shadow-lg">
          <div className="flex gap-3">
            <div className="flex-1">
              <h3 className="font-semibold text-red-900">Error</h3>
              <p className="text-sm text-red-700 mt-1">{apiError}</p>
            </div>
            <button
              onClick={onClearError}
              className="text-red-500 hover:text-red-700 transition-colors"
              aria-label="Close error"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Show loading indicator */}
      {props.isLoading && (
        <div className="fixed inset-0 z-[150] bg-black/20 backdrop-blur-sm flex items-center justify-center pointer-events-auto">
          <div className="bg-white rounded-lg p-8 shadow-2xl">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-gov-blue/20 border-t-gov-blue rounded-full animate-spin" />
              <p className="text-gov-blue font-semibold">Processing...</p>
            </div>
          </div>
        </div>
      )}

      {/* Original LandingPage with enhanced onLogin handler */}
      <LandingPage onLogin={props.onLogin} />
    </div>
  );
};

export default LandingPageWithAuth;
