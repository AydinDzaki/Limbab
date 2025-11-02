import { useState } from "react";
import { Login } from "./components/Login";
import { ForgotPassword } from "./components/ForgotPassword";
import { Dashboard } from "./components/Dashboard";
import { Profile } from "./components/Profile";
import { BottomNavigation } from "./components/BottomNavigation";

export default function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('login');
  };

  const handleForgotPassword = () => {
    setCurrentPage('forgot-password');
  };

  const handleBackToLogin = () => {
    setCurrentPage('login');
  };

  const renderCurrentPage = () => {
    if (!isAuthenticated) {
      switch (currentPage) {
        case 'forgot-password':
          return <ForgotPassword onBackToLogin={handleBackToLogin} />;
        default:
          return <Login onLogin={handleLogin} onForgotPassword={handleForgotPassword} />;
      }
    }
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'profile':
        return <Profile onNavigate={handleNavigate} onLogout={handleLogout} />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  const isMainPage = isAuthenticated && ['dashboard', 'profile'].includes(currentPage);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main content area */}
      <div className="flex-1 overflow-hidden">
        {renderCurrentPage()}
      </div>
      
      {/* Bottom navigation */}
      {isMainPage && (
        <div className="flex-shrink-0">
          <BottomNavigation 
            currentPage={currentPage} 
            onNavigate={handleNavigate} 
          />
        </div>
      )}
    </div>
  );
}