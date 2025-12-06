import { ShoppingCart, Utensils, Car, Briefcase, Zap, ShoppingBag, ChevronRight } from 'lucide-react';

const transactions = [
  {
    id: 1,
    category: 'Perlengkapan',
    description: 'Pembelian perlengkapan kantor',
    amount: -250000,
    date: 'Hari ini, 10:30',
    icon: ShoppingCart,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    id: 2,
    category: 'Penjualan',
    description: 'Penjualan produk - Pelanggan #1247',
    amount: 1500000,
    date: 'Hari ini, 09:15',
    icon: ShoppingBag,
    color: 'bg-green-100 text-green-600',
  },
  {
    id: 3,
    category: 'Makanan & Minuman',
    description: 'Makan siang tim',
    amount: -350000,
    date: 'Kemarin, 12:45',
    icon: Utensils,
    color: 'bg-orange-100 text-orange-600',
  },
  {
    id: 4,
    category: 'Transportasi',
    description: 'Layanan pengiriman',
    amount: -150000,
    date: 'Kemarin, 08:20',
    icon: Car,
    color: 'bg-purple-100 text-purple-600',
  },
  {
    id: 5,
    category: 'Penjualan',
    description: 'Pembayaran jasa diterima',
    amount: 2800000,
    date: '3 Des 2024',
    icon: Briefcase,
    color: 'bg-green-100 text-green-600',
  },
  {
    id: 6,
    category: 'Utilitas',
    description: 'Tagihan listrik',
    amount: -450000,
    date: '2 Des 2024',
    icon: Zap,
    color: 'bg-yellow-100 text-yellow-600',
  },
];

interface RecentTransactionsProps {
  onViewAll?: () => void;
}

export function RecentTransactions({ onViewAll }: RecentTransactionsProps) {
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
          const Icon = transaction.icon;
          return (
            <div
              key={transaction.id}
              className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer"
            >
              <div className={`p-3 rounded-xl ${transaction.color}`}>
                <Icon className="size-5" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-800 truncate">
                  {transaction.description}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{transaction.date}</div>
              </div>

              <div className={`font-semibold ${
                transaction.amount > 0 ? 'text-green-600' : 'text-gray-800'
              }`}>
                {transaction.amount > 0 ? '+' : ''}
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0,
                }).format(Math.abs(transaction.amount))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}