import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface CashFlowChartProps {
  onViewDetails?: () => void;
}

export function CashFlowChart({ onViewDetails }: CashFlowChartProps) {
  const { user } = useAuth();
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const currentYear = new Date().getFullYear();
      
      const { data: transactions } = await supabase
        .from('transactions')
        .select('amount, type, date')
        .eq('user_id', user.id)
        .order('date', { ascending: true });

      if (transactions) {
        // Init data 12 bulan
        const chartData = months.map(m => ({ month: m, income: 0, expense: 0 }));

        transactions.forEach(t => {
          const d = new Date(t.date);
          if (d.getFullYear() === currentYear) {
            const mIndex = d.getMonth();
            const amount = Number(t.amount);
            
            if (t.type === 'income') chartData[mIndex].income += amount;
            else chartData[mIndex].expense += amount;
          }
        });
        setData(chartData);
      }
    };
    fetchData();
  }, [user]);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-gray-800">Arus Kas</h2>
        <button 
          onClick={onViewDetails}
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
        >
          <TrendingUp className="size-4" />
          Lihat Detail
        </button>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-gray-200">
        <div className="mb-4">
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="size-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Pemasukan</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-600">Pengeluaran</span>
            </div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#e5e7eb' }}
              tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              formatter={(value: number) => new Intl.NumberFormat('id-ID').format(value)}
            />
            <Line 
              type="monotone" 
              dataKey="income" 
              stroke="#10b981" 
              strokeWidth={3}
              dot={{ fill: '#10b981', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="expense" 
              stroke="#ef4444" 
              strokeWidth={3}
              dot={{ fill: '#ef4444', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}