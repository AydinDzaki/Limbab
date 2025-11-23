import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Label } from "./ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { BarChart, Bar, XAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Download, Calculator, TrendingUp, DollarSign, Percent, CalendarIcon, ArrowDownLeft, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface ReportsProps {
  onNavigate: (page: string) => void;
}

export function Reports({ onNavigate }: ReportsProps) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State Filter & Tabs
  const [reportPeriod, setReportPeriod] = useState("semua");
  const [customFromDate, setCustomFromDate] = useState<Date | undefined>(undefined);
  const [customToDate, setCustomToDate] = useState<Date | undefined>(undefined);
  const [showReport, setShowReport] = useState(false); // Default true agar langsung tampil
  const [profitLossPeriod, setProfitLossPeriod] = useState("semua");
  const [taxPeriod, setTaxPeriod] = useState("semua");

  // --- 1. AMBIL DATA DARI SERVER ---
  useEffect(() => {
    fetch('http://localhost:5000/api/transactions')
      .then(res => res.json())
      .then(data => {
        setTransactions(data);
        setLoading(false);
        setShowReport(true); 
      })
      .catch(err => console.error("Gagal ambil data:", err));
  }, []);

  // --- 2. LOGIKA PERHITUNGAN DINAMIS ---
  
  // Pisahkan Income dan Expense
  const incomeTransactions = transactions.filter(t => t.type === 'income');
  const expenseTransactions = transactions.filter(t => t.type === 'expense');

  // Hitung Total
  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
  const netProfit = totalIncome - totalExpense;

  // Format Uang
  const formatCurrencyFull = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatCurrencyShort = (amount: number) => {
    if (amount >= 1000000) return `Rp ${(amount / 1000000).toFixed(1)}jt`;
    return `Rp ${amount/1000}rb`;
  };

  // --- DATA UNTUK LABA RUGI (PROFIT LOSS) ---
  // Kita kelompokkan expense berdasarkan kategori untuk grafik
  const expenseByCategory = expenseTransactions.reduce((acc: any, curr) => {
    const cat = curr.category || 'Lainnya';
    acc[cat] = (acc[cat] || 0) + curr.amount;
    return acc;
  }, {});

  const pieChartData = Object.keys(expenseByCategory).map((key, index) => ({
    name: key,
    value: expenseByCategory[key],
    color: ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe'][index % 5]
  }));

  const profitMargin = totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(1) : "0";

  // --- DATA UNTUK PAJAK (TAX) ---
  // Hitung PPh Final UMKM (0.5% dari Omzet Bruto) - Aturan Indonesia Sederhana
  const taxRate = 0.005; 
  const estimatedTax = totalIncome * taxRate;
  const netAfterTax = netProfit - estimatedTax;

  // --- EXPORT FUNCTION (Placeholder) ---
  const exportReport = (type: string, formatName: string) => {
    alert(`Laporan ${type} berhasil diekspor ke ${formatName}!`);
  };

  const ExportButton = ({ reportType }: { reportType: string }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline" className="h-6 px-2 text-xs">
          <Download className="h-3 w-3 mr-1" />
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => exportReport(reportType, 'PDF')}>📄 PDF</DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportReport(reportType, 'Excel')}>📊 Excel</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="flex-1 p-4 space-y-3">
      {/* Header */}
      <div>
        <h1 className="text-lg">Laporan Keuangan</h1>
        <p className="text-xs text-muted-foreground">Data real-time dari server</p>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading Data...</div>
      ) : (
        <Tabs defaultValue="cashflow" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-8">
            <TabsTrigger value="cashflow" className="text-xs">Arus Kas</TabsTrigger>
            <TabsTrigger value="profitloss" className="text-xs">Laba Rugi</TabsTrigger>
            <TabsTrigger value="tax" className="text-xs">Pajak</TabsTrigger>
          </TabsList>
          
          {/* --- TAB 1: ARUS KAS --- */}
          <TabsContent value="cashflow" className="mt-3 space-y-3">
            
            {/* Summary Cards */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Ringkasan Arus Kas</CardTitle>
                  <ExportButton reportType="Arus Kas" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Total Masuk</p>
                    <p className="text-sm font-medium text-green-600">
                      {formatCurrencyShort(totalIncome)}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Total Keluar</p>
                    <p className="text-sm font-medium text-red-600">
                      {formatCurrencyShort(totalExpense)}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Bersih</p>
                    <p className={`text-sm font-medium ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrencyShort(netProfit)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Income List */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <ArrowDownLeft className="h-4 w-4 text-green-600" />
                  Rincian Pemasukan
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {incomeTransactions.length === 0 && <p className="text-xs text-center py-4">Belum ada data</p>}
                  {incomeTransactions.map((t) => (
                    <div key={t.id} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs truncate">{t.description}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-muted-foreground">{t.date}</span>
                          <Badge variant="secondary" className="text-xs h-4">{t.category}</Badge>
                        </div>
                      </div>
                      <div className="text-right ml-2">
                        <p className="text-xs text-green-600">{formatCurrencyFull(t.amount)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

             {/* Expense List */}
             <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  </div>
                  Rincian Pengeluaran
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {expenseTransactions.length === 0 && <p className="text-xs text-center py-4">Belum ada data</p>}
                  {expenseTransactions.map((t) => (
                    <div key={t.id} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs truncate">{t.description}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-muted-foreground">{t.date}</span>
                          <Badge variant="secondary" className="text-xs h-4">{t.category}</Badge>
                        </div>
                      </div>
                      <div className="text-right ml-2">
                        <p className="text-xs text-red-600">-{formatCurrencyFull(t.amount)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* --- TAB 2: LABA RUGI --- */}
          <TabsContent value="profitloss" className="mt-3 space-y-3">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Analisa Laba Rugi</CardTitle>
                  <ExportButton reportType="Laba Rugi" />
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                {/* Revenue Section */}
                <div>
                  <h4 className="text-sm font-medium mb-3 text-green-700">📈 PENDAPATAN</h4>
                  <div className="bg-green-50 p-3 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm font-medium border-t border-green-200 pt-2">
                      <span>Total Pendapatan</span>
                      <span className="text-green-600">{formatCurrencyFull(totalIncome)}</span>
                    </div>
                  </div>
                </div>

                {/* Expenses Section */}
                <div>
                  <h4 className="text-sm font-medium mb-3 text-red-700">📉 PENGELUARAN</h4>
                  <div className="bg-red-50 p-3 rounded-lg space-y-2">
                    {/* Breakdown per kategori */}
                    {Object.keys(expenseByCategory).map(cat => (
                      <div key={cat} className="flex justify-between text-xs">
                        <span>{cat}</span>
                        <span className="text-red-600">-{formatCurrencyFull(expenseByCategory[cat])}</span>
                      </div>
                    ))}
                    <div className="flex justify-between text-sm font-medium border-t border-red-200 pt-2">
                      <span>Total Pengeluaran</span>
                      <span className="text-red-600">-{formatCurrencyFull(totalExpense)}</span>
                    </div>
                  </div>
                </div>

                {/* Net Profit/Loss */}
                <div>
                  <h4 className="text-sm font-medium mb-3 text-blue-700">💰 HASIL AKHIR</h4>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground mb-1">Laba Bersih</p>
                        <p className={`text-lg font-medium ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrencyFull(netProfit)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground mb-1">Margin Keuntungan</p>
                        <p className="text-lg font-medium text-blue-600">{profitMargin}%</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charts */}
                {expenseTransactions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-3 text-purple-700">📊 PENGELUARAN PER KATEGORI</h4>
                    <div className="bg-purple-50 p-3 rounded-lg flex items-center">
                      <div className="h-24 w-24">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={pieChartData} cx="50%" cy="50%" innerRadius={15} outerRadius={40} dataKey="value">
                              {pieChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex-1 ml-4 grid grid-cols-2 gap-2">
                        {pieChartData.map((d) => (
                          <div key={d.name} className="flex items-center gap-1 text-xs">
                             <div className="w-2 h-2 rounded-full" style={{backgroundColor: d.color}}></div>
                             <span className="truncate w-20">{d.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* --- TAB 3: PAJAK --- */}
          <TabsContent value="tax" className="mt-3 space-y-3">
             <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Estimasi Pajak (UMKM 0.5%)</CardTitle>
                  <ExportButton reportType="Pajak" />
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <div className="bg-orange-50 p-4 rounded-lg space-y-3">
                    <div className="bg-white p-3 rounded-lg">
                      <div className="flex justify-between text-xs mb-2">
                        <span>Omzet Bruto (Total Masuk)</span>
                        <span>{formatCurrencyFull(totalIncome)}</span>
                      </div>
                      <div className="flex justify-between text-xs mb-2">
                        <span>Tarif PPh Final</span>
                        <span className="text-blue-600">0.5%</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between text-sm font-bold text-orange-700">
                        <span>Pajak Terutang</span>
                        <span>{formatCurrencyFull(estimatedTax)}</span>
                      </div>
                    </div>

                    <div className="text-center text-xs text-muted-foreground">
                       <p>Estimasi Sisa Kas Bersih (Setelah Pajak):</p>
                       <p className="text-lg font-medium text-green-600 mt-1">{formatCurrencyFull(netAfterTax)}</p>
                    </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}