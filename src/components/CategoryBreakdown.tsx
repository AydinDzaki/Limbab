import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { getCategoryStyle, cn } from '../lib/utils';

export function CategoryBreakdown() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchCats = async () => {
      const { data } = await supabase
        .from('transactions')
        .select('category, amount')
        .eq('user_id', user.id)
        .eq('type', 'expense'); // Hanya pengeluaran

      if (data) {
        const total = data.reduce((sum, i) => sum + Number(i.amount), 0);
        const map: any = {};

        data.forEach(i => {
          if (!map[i.category]) map[i.category] = 0;
          map[i.category] += Number(i.amount);
        });

        const result = Object.keys(map).map(k => {
          const style = getCategoryStyle(k);
          return {
            name: k,
            amount: map[k],
            percentage: total === 0 ? 0 : Math.round((map[k] / total) * 100),
            icon: style.icon,
            bg: style.bg,
            color: style.color,
            barColor: style.barColor
          };
        }).sort((a,b) => b.amount - a.amount).slice(0, 4); // Top 4

        setCategories(result);
      }
    };
    fetchCats();
  }, [user]);

  if (categories.length === 0) return null;

  return (
    <div className="mb-6">
      <h2 className="font-semibold text-gray-800 mb-3">Pengeluaran per Kategori</h2>
      
      <div className="bg-white rounded-2xl p-4 border border-gray-200">
        {/* Progress Bar */}
        <div className="h-4 bg-gray-100 rounded-full overflow-hidden flex mb-4">
          {categories.map((c, i) => (
            <div
              key={i}
              className={cn("h-full", c.barColor)}
              style={{ width: `${c.percentage}%` }}
            />
          ))}
        </div>

        {/* List */}
        <div className="space-y-3">
          {categories.map((c, i) => {
            const Icon = c.icon;
            return (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className={cn("p-2 rounded-lg", c.bg, c.color)}>
                    <Icon className="size-4" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{c.name}</div>
                    <div className="text-xs text-gray-500">{c.percentage}% dari pengeluaran</div>
                  </div>
                </div>
                <div className="font-semibold text-gray-800">
                  {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                  }).format(c.amount)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}