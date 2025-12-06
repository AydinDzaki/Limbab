import { Home, TrendingUp, PieChart, User, Search, Plus, Wallet } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddTransaction?: () => void;
}

export function BottomNav({ activeTab, onTabChange, onAddTransaction }: BottomNavProps) {
  const tabs = [
    { id: 'home', label: 'Beranda', icon: Home },
    { id: 'reports', label: 'Laporan', icon: TrendingUp },
    { id: 'add', label: 'Tambah', icon: Plus, isCenter: true },
    { id: 'search', label: 'Riwayat', icon: Search },
    { id: 'analytics', label: 'Utang', icon: Wallet },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-[428px] mx-auto bg-white border-t border-gray-200 shadow-lg">
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.isCenter) {
            return (
              <button
                key={tab.id}
                onClick={() => onAddTransaction?.()}
                className="flex flex-col items-center justify-center -mt-8"
              >
                <div className="p-4 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg hover:shadow-xl transition-shadow active:scale-95">
                  <Icon className="size-6 text-white" />
                </div>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-2 px-4 rounded-xl transition-all ${
                isActive
                  ? 'text-blue-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon className={`size-6 ${isActive ? 'scale-110' : ''} transition-transform`} />
              <span className="text-xs mt-1">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}