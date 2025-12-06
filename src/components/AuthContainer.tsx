import { useState } from 'react';
import { Login } from './auth/Login';
import { Register } from './auth/Register';
import { ForgotPassword } from './auth/ForgotPassword';

type AuthScreen = 'login' | 'register' | 'forgot-password';

interface AuthContainerProps {
  onAuthSuccess?: (userName: string) => void;
}

export function AuthContainer({ onAuthSuccess }: AuthContainerProps) {
  const [currentScreen, setCurrentScreen] = useState<AuthScreen>('login');

  const handleLoginSuccess = (userName: string) => {
    onAuthSuccess?.(userName);
  };

  const handleRegisterSuccess = (userName: string) => {
    onAuthSuccess?.(userName);
  };

  return (
    <>
      {currentScreen === 'login' && (
        <Login
          onNavigateToRegister={() => setCurrentScreen('register')}
          onNavigateToForgotPassword={() => setCurrentScreen('forgot-password')}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      
      {currentScreen === 'register' && (
        <Register
          onNavigateToLogin={() => setCurrentScreen('login')}
          onRegisterSuccess={handleRegisterSuccess}
        />
      )}
      
      {currentScreen === 'forgot-password' && (
        <ForgotPassword
          onNavigateToLogin={() => setCurrentScreen('login')}
        />
      )}
    </>
  );
}