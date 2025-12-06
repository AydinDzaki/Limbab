import { ShoppingCart, Utensils, Car, Zap } from 'lucide-react';

const categories = [
  {
    id: 1,
    name: 'Perlengkapan',
    amount: 1250000,
    percentage: 35,
    icon: ShoppingCart,
    color: 'bg-blue-500',
    lightColor: 'bg-blue-100 text-blue-600',
  },
  {
    id: 2,
    name: 'Makanan & Minuman',
    amount: 980000,
    percentage: 28,
    icon: Utensils,
    color: 'bg-orange-500',
    lightColor: 'bg-orange-100 text-orange-600',
  },
  {
    id: 3,
    name: 'Transportasi',
    amount: 750000,
    percentage: 21,
    icon: Car,
    color: 'bg-purple-500',
    lightColor: 'bg-purple-100 text-purple-600',
  },
  {
    id: 4,
    name: 'Utilitas',
    amount: 570000,
    percentage: 16,
    icon: Zap,
    color: 'bg-yellow-500',
    lightColor: 'bg-yellow-100 text-yellow-600',
  },
];

export function CategoryBreakdown() {
  return (
    <div className="mb-6">
      <h2 className="font-semibold text-gray-800 mb-3">Pengeluaran per Kategori</h2>
      
      <div className="bg-white rounded-2xl p-4 border border-gray-200">
        {/* Progress Bar */}
        <div className="h-4 bg-gray-100 rounded-full overflow-hidden flex mb-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className={category.color}
              style={{ width: `${category.percentage}%` }}
            />
          ))}
        </div>

        {/* Category List */}
        <div className="space-y-3">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <div key={category.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`p-2 rounded-lg ${category.lightColor}`}>
                    <Icon className="size-4" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{category.name}</div>
                    <div className="text-xs text-gray-500">{category.percentage}% dari pengeluaran</div>
                  </div>
                </div>
                <div className="font-semibold text-gray-800">
                  {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                  }).format(category.amount)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}