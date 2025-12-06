import { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { getCategoryStyle, cn } from '../lib/utils'; 

interface RecentTransactionsProps {
  onViewAll?: () => void;
}

export function RecentTransactions({ onViewAll }: RecentTransactionsProps) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchRecent = async () => {
      const { data } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(5);
      
      setTransactions(data || []);
    };
    fetchRecent();
  }, [user]);

  // Helper Format Tanggal
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    // Reset jam agar perbandingan tanggal akurat
    const d1 = new Date(date.toDateString());
    const d2 = new Date(today.toDateString());
    
    if (d1.getTime() === d2.getTime()) return 'Hari ini';
    
    // Kemarin
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (d1.getTime() === new Date(yesterday.toDateString()).getTime()) return 'Kemarin';

    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-gray-800">Transaksi Terbaru</h2>
        <button 
          onClick={onViewAll}
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
        >
          Lihat Semua
          <ChevronRight className="size-4" />
        </button>
      </div>

      <div className="space-y-2">
        {transactions.map((transaction) => {
          const searchKey = (transaction.category === 'Lainnya' || transaction.category === 'other') 
            ? transaction.description 
            : transaction.category;

          const style = getCategoryStyle(searchKey);
          const Icon = style.icon;
          const isIncome = transaction.type === 'income';
          
          const containerClass = cn(
            "p-3 rounded-xl",
            isIncome ? "bg-green-100 text-green-600" : cn(style.bg, style.color)
          );

          return (
            <div
              key={transaction.id}
              className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer"
            >
              <div className={containerClass}>
                <Icon className="size-5" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-800 truncate">
                  {transaction.description || transaction.category}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {formatDate(transaction.date)}
                </div>
              </div>

              <div className={`font-semibold ${
                isIncome ? 'text-green-600' : 'text-gray-800'
              }`}>
                {isIncome ? '+' : ''}
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0,
                }).format(Math.abs(transaction.amount))}
              </div>
            </div>
          );
        })}
        {transactions.length === 0 && (
            <div className="text-center py-4 text-gray-500 text-sm">Belum ada transaksi</div>
        )}
      </div>
    </div>
  );
}