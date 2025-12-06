import { Bell, Menu } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user } = useAuth();

  const getUserInitials = () => {
    if (user?.name) {
      return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return 'JD';
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-4 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={onMenuClick}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Menu className="size-5" />
          </button>
          <div>
            <h1 className="font-semibold">FinanceBook</h1>
            <p className="text-xs text-blue-100">Manajer Keuangan UMKM</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors relative">
                <Bell className="size-5" />
                <span className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full"></span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 mr-4" align="end">
              <div className="space-y-3">
                <h3 className="text-gray-900">Notifikasi</h3>
                
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white">🗓️</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-amber-900">Pengingat Batas Waktu Pajak</p>
                      <p className="text-xs text-amber-700 mt-1">
                        Pembayaran pajak bulanan jatuh tempo 31 Desember 2025
                      </p>
                      <p className="text-xs text-amber-600 mt-2">
                        25 hari tersisa
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white">📊</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-blue-900">Laporan Bulanan Siap</p>
                      <p className="text-xs text-blue-700 mt-1">
                        Laporan keuangan November Anda sudah tersedia
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <Avatar className="size-9 ring-2 ring-white/30">
            {user?.profilePhoto ? (
              <AvatarImage src={user.profilePhoto} alt={user.name} />
            ) : (
              <AvatarFallback className="bg-blue-500 text-white text-sm">
                {getUserInitials()}
              </AvatarFallback>
            )}
          </Avatar>
        </div>
      </div>
    </header>
  );
}