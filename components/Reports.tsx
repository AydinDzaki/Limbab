import { useState } from 'react';
import { Download, Calendar, TrendingUp, TrendingDown, Banknote, PieChart as PieChartIcon, Receipt, AlertCircle, CheckCircle } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const monthlyData = [
  { month: 'Jan', income: 45, expense: 5.2, profit: 39.8 },
  { month: 'Feb', income: 48, expense: 5.8, profit: 42.2 },
  { month: 'Mar', income: 42, expense: 4.9, profit: 37.1 },
  { month: 'Apr', income: 51, expense: 6.2, profit: 44.8 },
  { month: 'May', income: 49, expense: 5.5, profit: 43.5 },
  { month: 'Jun', income: 55, expense: 6.8, profit: 48.2 },
];

const categoryData = [
  { name: 'Perlengkapan', value: 1250000, color: '#3b82f6' },
  { name: 'Makanan & Minuman', value: 980000, color: '#f97316' },
  { name: 'Transportasi', value: 750000, color: '#a855f7' },
  { name: 'Utilitas', value: 570000, color: '#eab308' },
  { name: 'Gaji', value: 1800000, color: '#ec4899' },
  { name: 'Lainnya', value: 400000, color: '#6b7280' },
];

const CustomBarTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-xl shadow-lg border border-gray-200">
        <p className="font-medium text-gray-800 mb-1">{payload[0].payload.month}</p>
        <p className="text-sm text-green-600">Pemasukan: Rp {payload[0].value}M</p>
        <p className="text-sm text-red-600">Pengeluaran: Rp {payload[1].value}M</p>
        <p className="text-sm text-blue-600">Keuntungan: Rp {payload[2].value}M</p>
      </div>
    );
  }
  return null;
};

const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-xl shadow-lg border border-gray-200">
        <p className="font-medium text-gray-800">{payload[0].name}</p>
        <p className="text-sm text-gray-600">
          {new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
          }).format(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

export function Reports() {
  const [period, setPeriod] = useState('monthly');

  return (
    <div className="pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-6 text-white -mx-4 mb-6">
        <h1 className="text-2xl font-semibold mb-2">Laporan Keuangan</h1>
      </div>

      {/* Period Selector */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'monthly', label: 'Bulanan' },
          { key: 'quarterly', label: 'Kuartalan' },
          { key: 'yearly', label: 'Tahunan' }
        ].map((p) => (
          <button
            key={p.key}
            onClick={() => setPeriod(p.key)}
            className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-all ${
              period === p.key
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="size-5" />
            <span className="text-sm opacity-90">Total Pemasukan</span>
          </div>
          <div className="text-2xl font-semibold">Rp 290M</div>
          <div className="text-xs opacity-90 mt-1">6 bulan terakhir</div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="size-5" />
            <span className="text-sm opacity-90">Total Pengeluaran</span>
          </div>
          <div className="text-2xl font-semibold">Rp 34,4M</div>
          <div className="text-xs opacity-90 mt-1">6 bulan terakhir</div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Banknote className="size-5" />
            <span className="text-sm opacity-90">Laba Bersih</span>
          </div>
          <div className="text-2xl font-semibold">Rp 255,6M</div>
          <div className="text-xs opacity-90 mt-1">Margin 88,1%</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="size-5" />
            <span className="text-sm opacity-90">Tingkat Pertumbuhan</span>
          </div>
          <div className="text-2xl font-semibold">+22,4%</div>
          <div className="text-xs opacity-90 mt-1">vs periode sebelumnya</div>
        </div>
      </div>

      {/* Monthly Comparison Chart */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Perbandingan Bulanan</h3>
        </div>

        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={monthlyData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#e5e7eb' }}
              tickFormatter={(value) => `${value}M`}
            />
            <Tooltip content={<CustomBarTooltip />} />
            <Bar dataKey="income" fill="#10b981" radius={[8, 8, 0, 0]} />
            <Bar dataKey="expense" fill="#ef4444" radius={[8, 8, 0, 0]} />
            <Bar dataKey="profit" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

        <div className="flex items-center justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="size-3 bg-green-500 rounded"></div>
            <span className="text-gray-600">Pemasukan</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-3 bg-red-500 rounded"></div>
            <span className="text-gray-600">Pengeluaran</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-3 bg-blue-500 rounded"></div>
            <span className="text-gray-600">Keuntungan</span>
          </div>
        </div>
      </div>

      {/* Expense by Category */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Pengeluaran per Kategori</h3>
          <PieChartIcon className="size-5 text-gray-400" />
        </div>

        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomPieTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        <div className="grid grid-cols-2 gap-2 mt-4">
          {categoryData.map((category) => (
            <div key={category.name} className="flex items-center gap-2">
              <div className="size-3 rounded-full" style={{ backgroundColor: category.color }}></div>
              <span className="text-xs text-gray-600 truncate">{category.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tax Section */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Receipt className="size-5 text-gray-700" />
            <h3 className="font-semibold text-gray-800">Ringkasan Pajak</h3>
          </div>
        </div>

        {/* Tax Overview Cards */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
            <p className="text-xs text-gray-600 mb-1">Total Pajak (YTD)</p>
            <p className="text-lg font-semibold text-gray-800">Rp 28,5M</p>
            <p className="text-xs text-blue-600 mt-1">9,8% dari pendapatan</p>
          </div>
          <div className="bg-orange-50 rounded-xl p-3 border border-orange-100">
            <p className="text-xs text-gray-600 mb-1">Pembayaran Tertunda</p>
            <p className="text-lg font-semibold text-gray-800">Rp 2,4M</p>
            <p className="text-xs text-orange-600 mt-1">Jatuh tempo 15 Des 2024</p>
          </div>
        </div>

        {/* Tax Breakdown */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Receipt className="size-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800 text-sm">PPN</p>
                <p className="text-xs text-gray-500">Pajak Pertambahan Nilai 11%</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-800">Rp 18,2M</p>
              <p className="text-xs text-gray-500">Lunas</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Receipt className="size-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800 text-sm">PPh 21</p>
                <p className="text-xs text-gray-500">Pajak penghasilan karyawan</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-800">Rp 6,8M</p>
              <p className="text-xs text-gray-500">Lunas</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-xl border border-orange-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertCircle className="size-4 text-orange-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800 text-sm">PPh 25</p>
                <p className="text-xs text-gray-500">Angsuran pajak bulanan</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-orange-600">Rp 2,4M</p>
              <p className="text-xs text-orange-600">Tertunda</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Receipt className="size-4 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800 text-sm">PPh 23</p>
                <p className="text-xs text-gray-500">Pajak jasa</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-800">Rp 1,1M</p>
              <p className="text-xs text-gray-500">Lunas</p>
            </div>
          </div>
        </div>

        {/* Upcoming Tax Obligations */}
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-semibold text-gray-800 mb-3">Kewajiban Mendatang</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2.5 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-gray-800">Pembayaran PPh 25</p>
                  <p className="text-xs text-gray-500">15 Des 2024</p>
                </div>
              </div>
              <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded">5 hari</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-gray-800">Pelaporan PPN</p>
                  <p className="text-xs text-gray-500">31 Des 2024</p>
                </div>
              </div>
              <span className="text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-1 rounded">21 hari</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2">
                <CheckCircle className="size-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-800">PPh 21 - November</p>
                  <p className="text-xs text-gray-500">Selesai</p>
                </div>
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">Lunas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-3">Ekspor Laporan</h3>
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 py-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-200 hover:bg-blue-100 transition-colors">
            <Download className="size-4" />
            <span className="text-sm font-medium">PDF</span>
          </button>
          <button className="flex items-center justify-center gap-2 py-3 bg-green-50 text-green-600 rounded-xl border border-green-200 hover:bg-green-100 transition-colors">
            <Download className="size-4" />
            <span className="text-sm font-medium">Excel</span>
          </button>
        </div>
      </div>
    </div>
  );
}