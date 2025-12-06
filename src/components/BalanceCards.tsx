import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function BalanceCards() {
  const { user } = useAuth();
  const [summary, setSummary] = useState({
    balance: 0,
    income: 0,
    expense: 0
  });

  useEffect(() => {
    if (!user) return;

    const fetchBalance = async () => {
      // Ambil semua transaksi user
      const { data } = await supabase
        .from('transactions')
        .select('amount, type, date')
        .eq('user_id', user.id);

      if (data) {
        let bal = 0;
        let inc = 0;
        let exp = 0;
        
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        data.forEach(t => {
          const amount = Number(t.amount);
          const tDate = new Date(t.date);

          // Hitung Saldo Total (Semua Waktu)
          if (t.type === 'income') bal += amount;
          else bal -= amount;

          // Hitung Bulan Ini Saja
          if (tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear) {
            if (t.type === 'income') inc += amount;
            else exp += amount;
          }
        });

        setSummary({ balance: bal, income: inc, expense: exp });
      }
    };

    fetchBalance();
  }, [user]);

  // Formatter IDR
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Formatter Singkat (Jt)
  const formatShort = (amount: number) => {
    if (amount >= 1000000000) return 'Rp ' + (amount / 1000000000).toFixed(1).replace('.', ',') + ' M';
    if (amount >= 1000000) return 'Rp ' + (amount / 1000000).toFixed(1).replace('.', ',') + ' Jt';
    return formatMoney(amount);
  };

  return (
    <div className="space-y-3">
      {/* Total Balance Card */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 text-white shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <Wallet className="size-5" />
          <span className="text-sm text-blue-100">Saldo Total</span>
        </div>
        <div className="text-3xl font-semibold mb-1">{formatMoney(summary.balance)}</div>
        <div className="flex items-center gap-1 text-sm text-blue-100">
          <TrendingUp className="size-4" />
          <span>Update Realtime</span>
        </div>
      </div>

      {/* Income & Expense Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Income Card */}
        <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-green-500 rounded-lg">
              <TrendingUp className="size-4 text-white" />
            </div>
            <span className="text-sm text-gray-600">Pemasukan</span>
          </div>
          <div className="text-xl font-semibold text-gray-800">{formatShort(summary.income)}</div>
          <div className="text-xs text-green-600 mt-1">Bulan ini</div>
        </div>

        {/* Expense Card */}
        <div className="bg-red-50 rounded-2xl p-4 border border-red-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-red-500 rounded-lg">
              <TrendingDown className="size-4 text-white" />
            </div>
            <span className="text-sm text-gray-600">Pengeluaran</span>
          </div>
          <div className="text-xl font-semibold text-gray-800">{formatShort(summary.expense)}</div>
          <div className="text-xs text-red-600 mt-1">Bulan ini</div>
        </div>
      </div>
    </div>
  );
}