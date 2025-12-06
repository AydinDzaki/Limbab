import { useState } from 'react';
import { Header } from './components/Header';
import { BalanceCards } from './components/BalanceCards';
import { QuickActions } from './components/QuickActions';
import { CashFlowChart } from './components/CashFlowChart';
import { RecentTransactions } from './components/RecentTransactions';
import { CategoryBreakdown } from './components/CategoryBreakdown';
import { Reports } from './components/Reports';
import { DebtManagement } from './components/DebtManagement';
import { BottomNav } from './components/BottomNav';
import { AddTransactionModal } from './components/AddTransactionModal';
import { TransactionEntry } from './components/TransactionEntry';
import { TransactionSearch } from './components/TransactionSearch';
import { Profile } from './components/Profile';
import { ProfileDrawer } from './components/ProfileDrawer';
import { AuthContainer } from './components/AuthContainer';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Dialog, DialogContent } from './components/ui/dialog';
import { Toaster } from './components/ui/sonner';

function MainApp() {
  const [activeTab, setActiveTab] = useState('home');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('expense');
  const [showTransactionEntry, setShowTransactionEntry] = useState(false);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);
  const [welcomeUserName, setWelcomeUserName] = useState('');

  const { isAuthenticated } = useAuth();

  const handleAddTransaction = () => {
    setShowTransactionEntry(true);
  };

  const handleAuthSuccess = (userName: string) => {
    setWelcomeUserName(userName);
    setShowWelcomeDialog(true);
    
    // Auto close welcome dialog after 3 seconds
    setTimeout(() => {
      setShowWelcomeDialog(false);
    }, 3000);
  };

  const handleViewCashFlowDetails = () => {
    setActiveTab('reports');
  };

  const handleViewAllTransactions = () => {
    setActiveTab('search');
  };

  // If not authenticated, show auth screens
  if (!isAuthenticated) {
    return <AuthContainer onAuthSuccess={handleAuthSuccess} />;
  }

  // If showing transaction entry screen, render it fullscreen
  if (showTransactionEntry) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-[428px] mx-auto bg-white min-h-screen shadow-xl">
          <TransactionEntry onBack={() => setShowTransactionEntry(false)} />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Mobile Container */}
        <div className="max-w-[428px] mx-auto bg-white min-h-screen shadow-xl overflow-y-auto scrollbar-hide">
          <Header onMenuClick={() => setIsProfileDrawerOpen(true)} />
          
          <main className="pb-20 px-4">
            {activeTab === 'home' && (
              <>
                {/* Balance Overview */}
                <section className="mt-6">
                  <BalanceCards />
                </section>

                {/* Cash Flow Chart */}
                <section className="mt-6">
                  <CashFlowChart onViewDetails={handleViewCashFlowDetails} />
                </section>

                {/* Recent Transactions */}
                <section className="mt-6">
                  <RecentTransactions onViewAll={handleViewAllTransactions} />
                </section>

                {/* Category Breakdown */}
                <section className="mt-6">
                  <CategoryBreakdown />
                </section>
              </>
            )}

            {activeTab === 'reports' && (
              <Reports />
            )}

            {activeTab === 'search' && (
              <TransactionSearch />
            )}

            {activeTab === 'analytics' && (
              <DebtManagement />
            )}

            {activeTab === 'profile' && (
              <Profile />
            )}
          </main>

          <BottomNav 
            activeTab={activeTab} 
            onTabChange={setActiveTab}
            onAddTransaction={handleAddTransaction}
          />
          
          <AddTransactionModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            type={transactionType}
          />
          
          <ProfileDrawer 
            isOpen={isProfileDrawerOpen}
            onClose={() => setIsProfileDrawerOpen(false)}
          />
        </div>
      </div>

      {/* Welcome Dialog */}
      <Dialog open={showWelcomeDialog} onOpenChange={setShowWelcomeDialog}>
        <DialogContent className="max-w-[90%] sm:max-w-md rounded-3xl border-none p-0 overflow-hidden">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-8 text-center">
            <div className="mb-4">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4">
                <span className="text-4xl">👋</span>
              </div>
            </div>
            <h2 className="text-white mb-2">Selamat Datang!</h2>
            <p className="text-blue-100 text-lg">
              Halo, <strong>{welcomeUserName}</strong>
            </p>
            <p className="text-blue-50 mt-2">
              Selamat datang di FinanceBook
            </p>
          </div>
          <div className="bg-white p-6 text-center">
            <p className="text-gray-600">
              Kelola keuangan UMKM Anda dengan mudah dan profesional
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
      <Toaster position="top-center" richColors />
    </AuthProvider>
  );
}