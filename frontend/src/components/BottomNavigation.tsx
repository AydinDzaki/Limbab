import { Button } from "./ui/button";
import { Home, Receipt, Search, FileText, User } from "lucide-react";

interface BottomNavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function BottomNavigation({ currentPage, onNavigate }: BottomNavigationProps) {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Beranda',
      icon: Home
    },
    {
      id: 'transactions',
      label: 'Transaksi',
      icon: Receipt
    },
    {
      id: 'history',
      label: 'Riwayat',
      icon: Search
    },
    {
      id: 'reports',
      label: 'Laporan',
      icon: FileText
    },
    {
      id: 'profile',
      label: 'Profil',
      icon: User
    }
  ];

  return (
    <div className="bg-background border-t">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <Button
              key={item.id}
              variant="ghost"
              className={`h-full rounded-none flex-col gap-1 ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
              onClick={() => onNavigate(item.id)}
            >
              <item.icon className={`h-5 w-5 ${isActive ? 'text-primary' : ''}`} />
              <span className="text-xs">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}