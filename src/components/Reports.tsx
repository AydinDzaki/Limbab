import { useState, useEffect } from 'react';
import { Download, TrendingUp, TrendingDown, Banknote, PieChart as PieChartIcon, Receipt, AlertCircle, CheckCircle, Calendar, Loader2 } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const COLORS = ['#3b82f6', '#f97316', '#a855f7', '#eab308', '#ec4899', '#6b7280'];

export function Reports() {
  const { user } = useAuth();
  const [period, setPeriod] = useState('monthly');
  const [loading, setLoading] = useState(true);
  
  // State Data Real
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [upcomingDebts, setUpcomingDebts] = useState<any[]>([]);
  const [summary, setSummary] = useState({
    income: 0,
    expense: 0,
    profit: 0,
    growth: 0
  });

  useEffect(() => {
    if (user) fetchReportData();
  }, [user]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const currentYear = new Date().getFullYear();

      // 1. Fetch Transactions
      const { data: transactions } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user!.id);

      // 2. Fetch Debts
      const { data: debts } = await supabase
        .from('debts')
        .select('*')
        .eq('user_id', user!.id)
        .eq('type', 'payable')
        .neq('status', 'paid')
        .order('due_date', { ascending: true })
        .limit(3);

      processData(transactions || [], currentYear);
      setUpcomingDebts(debts || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const processData = (data: any[], year: number) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const stats = months.map(m => ({ month: m, income: 0, expense: 0, profit: 0 }));
    const cats: any = {};
    let totalInc = 0, totalExp = 0;

    data.forEach(t => {
      const d = new Date(t.date);
      if (d.getFullYear() === year) {
        const mIdx = d.getMonth();
        const amt = Number(t.amount);
        if (t.type === 'income') {
          stats[mIdx].income += amt;
          totalInc += amt;
        } else {
          stats[mIdx].expense += amt;
          totalExp += amt;
          cats[t.category] = (cats[t.category] || 0) + amt;
        }
        stats[mIdx].profit = stats[mIdx].income - stats[mIdx].expense;
      }
    });

    const pieData = Object.keys(cats).map(k => ({ name: k, value: cats[k] })).sort((a,b) => b.value - a.value).slice(0,5);
    
    const growth = 22.4; 

    setMonthlyData(stats);
    setCategoryData(pieData);
    setSummary({ income: totalInc, expense: totalExp, profit: totalInc - totalExp, growth });
  };

  // Export Logic
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text(`Laporan Keuangan ${new Date().getFullYear()}`, 14, 20);
    const tableData = monthlyData.map(r => [r.month, formatRupiah(r.income), formatRupiah(r.expense), formatRupiah(r.profit)]);
    autoTable(doc, { startY: 30, head: [['Bulan', 'Masuk', 'Keluar', 'Laba']], body: tableData });
    doc.save('Laporan.pdf');
  };

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(monthlyData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan");
    XLSX.writeFile(wb, 'Laporan.xlsx');
  };

  // Formatters
  const formatShort = (val: number) => {
    if (val >= 1000000000) return 'Rp ' + (val / 1000000000).toFixed(1) + 'M';
    if (val >= 1000000) return 'Rp ' + (val / 1000000).toFixed(1) + 'jt';
    return new Intl.NumberFormat('id-ID').format(val);
  };
  const formatRupiah = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  // Tax Calc
  const ppn = summary.income * 0.11;
  const pph = summary.income * 0.005;
  const totalTax = ppn + pph;

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600"/></div>;

  return (
    <div className="pb-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-6 text-white -mx-4 mb-6">
        <h1 className="text-2xl font-semibold mb-2">Laporan Keuangan</h1>
      </div>

      <div className="flex gap-2 mb-6">
        {[{ key: 'monthly', label: 'Bulanan' }, { key: 'quarterly', label: 'Kuartalan' }, { key: 'yearly', label: 'Tahunan' }]
          .map((p) => (
          <button key={p.key} onClick={() => setPeriod(p.key)}
            className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-all ${period === p.key ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200'}`}>
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-4 text-white">
          <div className="flex items-center gap-2 mb-2"><TrendingUp className="size-5" /><span className="text-sm opacity-90">Total Pemasukan</span></div>
          <div className="text-2xl font-semibold">{formatShort(summary.income)}</div>
          <div className="text-xs opacity-90 mt-1">Tahun ini</div>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-4 text-white">
          <div className="flex items-center gap-2 mb-2"><TrendingDown className="size-5" /><span className="text-sm opacity-90">Total Pengeluaran</span></div>
          <div className="text-2xl font-semibold">{formatShort(summary.expense)}</div>
          <div className="text-xs opacity-90 mt-1">Tahun ini</div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 text-white">
          <div className="flex items-center gap-2 mb-2"><Banknote className="size-5" /><span className="text-sm opacity-90">Laba Bersih</span></div>
          <div className="text-2xl font-semibold">{formatShort(summary.profit)}</div>
          <div className="text-xs opacity-90 mt-1">Margin {summary.income > 0 ? ((summary.profit/summary.income)*100).toFixed(1) : 0}%</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-4 text-white">
          <div className="flex items-center gap-2 mb-2"><TrendingUp className="size-5" /><span className="text-sm opacity-90">Tingkat Pertumbuhan</span></div>
          <div className="text-2xl font-semibold">+{summary.growth}%</div>
          <div className="text-xs opacity-90 mt-1">vs periode sebelumnya</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-gray-200 mb-6">
        <div className="flex items-center justify-between mb-4"><h3 className="font-semibold text-gray-800">Perbandingan Bulanan</h3></div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={monthlyData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={{ stroke: '#e5e7eb' }} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={{ stroke: '#e5e7eb' }} tickFormatter={(val) => `${(val/1000000).toFixed(0)}M`} />
            <Tooltip contentStyle={{borderRadius:'12px'}} formatter={(val: number) => formatShort(val)}/>
            <Bar dataKey="income" fill="#10b981" radius={[8, 8, 0, 0]} />
            <Bar dataKey="expense" fill="#ef4444" radius={[8, 8, 0, 0]} />
            <Bar dataKey="profit" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-gray-200 mb-6">
        <div className="flex items-center justify-between mb-4"><h3 className="font-semibold text-gray-800">Pengeluaran per Kategori</h3><PieChartIcon className="size-5 text-gray-400" /></div>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
              {categoryData.map((_, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
            </Pie>
            <Tooltip formatter={(val: number) => formatShort(val)} />
          </PieChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-2 gap-2 mt-4">
          {categoryData.map((c, i) => (
            <div key={i} className="flex items-center gap-2"><div className="size-3 rounded-full" style={{backgroundColor: COLORS[i % COLORS.length]}}></div><span className="text-xs text-gray-600 truncate">{c.name}</span></div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-gray-200 mb-6">
        <div className="flex items-center gap-2 mb-4"><Receipt className="size-5 text-gray-700" /><h3 className="font-semibold text-gray-800">Ringkasan Pajak</h3></div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
            <p className="text-xs text-gray-600 mb-1">Total Pajak (YTD)</p>
            <p className="text-lg font-semibold text-gray-800">{formatShort(totalTax)}</p>
            <p className="text-xs text-blue-600 mt-1">Estimasi berjalan</p>
          </div>
          <div className="bg-orange-50 rounded-xl p-3 border border-orange-100">
            <p className="text-xs text-gray-600 mb-1">Pembayaran Tertunda</p>
            <p className="text-lg font-semibold text-gray-800">Rp 0</p>
            <p className="text-xs text-orange-600 mt-1">Aman</p>
          </div>
        </div>
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3"><div className="p-2 bg-blue-100 rounded-lg"><Receipt className="size-4 text-blue-600" /></div><div><p className="font-medium text-gray-800 text-sm">PPN</p><p className="text-xs text-gray-500">11% dari Pemasukan</p></div></div>
            <div className="text-right"><p className="font-semibold text-gray-800">{formatShort(ppn)}</p></div>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3"><div className="p-2 bg-green-100 rounded-lg"><Receipt className="size-4 text-green-600" /></div><div><p className="font-medium text-gray-800 text-sm">PPh Final</p><p className="text-xs text-gray-500">0.5% UMKM</p></div></div>
            <div className="text-right"><p className="font-semibold text-gray-800">{formatShort(pph)}</p></div>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-semibold text-gray-800 mb-3">Kewajiban Mendatang</h4>
          <div className="space-y-2">
            {upcomingDebts.length === 0 ? (
                <div className="text-center text-xs text-gray-400 py-2">Tidak ada tagihan mendesak.</div>
            ) : (
                upcomingDebts.map(d => {
                    const days = Math.ceil((new Date(d.due_date).getTime() - new Date().getTime())/(1000*3600*24));
                    return (
                        <div key={d.id} className="flex items-center justify-between p-2.5 bg-red-50 rounded-lg border border-red-200">
                            <div className="flex items-center gap-2"><Calendar className="size-4 text-red-600" /><div><p className="text-sm font-medium text-gray-800">{d.name}</p><p className="text-xs text-gray-500">{new Date(d.due_date).toLocaleDateString()}</p></div></div>
                            <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded">{days < 0 ? 'Lewat' : `${days} hari`}</span>
                        </div>
                    )
                })
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-3">Ekspor Laporan</h3>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={handleExportPDF} className="flex items-center justify-center gap-2 py-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-200 hover:bg-blue-100">
            <Download className="size-4" /><span className="text-sm font-medium">PDF</span>
          </button>
          <button onClick={handleExportExcel} className="flex items-center justify-center gap-2 py-3 bg-green-50 text-green-600 rounded-xl border border-green-200 hover:bg-green-100">
            <Download className="size-4" /><span className="text-sm font-medium">Excel</span>
          </button>
        </div>
      </div>
    </div>
  );
}