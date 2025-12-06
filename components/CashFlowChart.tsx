import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

const data = [
  { month: 'Jan', income: 45000000, expense: 5200000 },
  { month: 'Feb', income: 48000000, expense: 5800000 },
  { month: 'Mar', income: 42000000, expense: 4900000 },
  { month: 'Apr', income: 51000000, expense: 6200000 },
  { month: 'May', income: 49000000, expense: 5500000 },
  { month: 'Jun', income: 55000000, expense: 6800000 },
  { month: 'Jul', income: 52000000, expense: 6100000 },
  { month: 'Aug', income: 58000000, expense: 7200000 },
  { month: 'Sep', income: 53000000, expense: 6500000 },
  { month: 'Oct', income: 56000000, expense: 6900000 },
  { month: 'Nov', income: 54000000, expense: 6400000 },
  { month: 'Dec', income: 52500000, expense: 6750000 },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-xl shadow-lg border border-gray-200">
        <p className="font-medium text-gray-800 mb-2">{payload[0].payload.month}</p>
        <p className="text-sm text-green-600">
          Pemasukan: {new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
          }).format(payload[0].value)}
        </p>
        <p className="text-sm text-red-600">
          Pengeluaran: {new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
          }).format(payload[1].value)}
        </p>
      </div>
    );
  }
  return null;
};

interface CashFlowChartProps {
  onViewDetails?: () => void;
}

export function CashFlowChart({ onViewDetails }: CashFlowChartProps) {
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
            <Tooltip content={<CustomTooltip />} />
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