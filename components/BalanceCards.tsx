import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

export function BalanceCards() {
  return (
    <div className="space-y-3">
      {/* Total Balance Card */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 text-white shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <Wallet className="size-5" />
          <span className="text-sm text-blue-100">Saldo Total</span>
        </div>
        <div className="text-3xl font-semibold mb-1">Rp 45.750.000</div>
        <div className="flex items-center gap-1 text-sm text-blue-100">
          <TrendingUp className="size-4" />
          <span>+12,5% dari bulan lalu</span>
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
          <div className="text-xl font-semibold text-gray-800">Rp 52,5 Jt</div>
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
          <div className="text-xl font-semibold text-gray-800">Rp 6,75 Jt</div>
          <div className="text-xs text-red-600 mt-1">Bulan ini</div>
        </div>
      </div>
    </div>
  );
}