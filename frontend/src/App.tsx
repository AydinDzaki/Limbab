import { useState } from "react";
import { Login } from "./components/Login";
import { ForgotPassword } from "./components/ForgotPassword";
import { Dashboard } from "./components/Dashboard";
import { TransactionEntry } from "./components/TransactionEntry";
import { TransactionHistory } from "./components/TransactionHistory";
import { Reports } from "./components/Reports";
import { Profile } from "./components/Profile";
import { DebtManagement } from "./components/DebtManagement";
import { SecuritySettings } from "./components/SecuritySettings";
import { MemberManagement } from "./components/MemberManagement";
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
      case 'transactions':
        return <TransactionEntry onNavigate={handleNavigate} />;
      case 'history':
        return <TransactionHistory onNavigate={handleNavigate} />;
      case 'reports':
        return <Reports onNavigate={handleNavigate} />;
      case 'debt':
        return <DebtManagement onNavigate={handleNavigate} />;
      case 'profile':
        return <Profile onNavigate={handleNavigate} onLogout={handleLogout} />;
      case 'security':
        return <SecuritySettings onNavigate={handleNavigate} />;
      case 'members':
        return <MemberManagement onNavigate={handleNavigate} />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  const isMainPage = isAuthenticated && ['dashboard', 'transactions', 'history', 'reports', 'debt', 'profile'].includes(currentPage);

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