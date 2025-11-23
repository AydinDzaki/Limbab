import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, Tooltip } from "recharts";
import { Plus, ArrowUpRight, ArrowDownLeft, TrendingUp, Receipt, Eye, EyeOff, Bell } from "lucide-react";
import { useState, useEffect } from "react";

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [user, setUser] = useState({ name: "User", role: "Staff" });

  // State Data Dashboard Lengkap (Tanpa Shop Name)
  const [data, setData] = useState({
    totalBalance: 0,
    accountNumber: "****",
    incomeThisMonth: 0,
    expenseThisMonth: 0,
    netProfitThisMonth: 0,
    incomeGrowth: "0",
    expenseGrowth: "0",
    netProfitGrowth: "0",
    chartData: [],
    recentActivity: []
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    fetch('http://localhost:5000/api/dashboard')
      .then(res => res.json())
      .then(result => setData(result))
      .catch(err => console.error("Gagal load dashboard:", err));
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatBalance = (amount: number) => {
    if (!isBalanceVisible) return "Rp ****";
    if (amount >= 1000000) return `Rp ${(amount / 1000000).toFixed(1)}jt`;
    return formatCurrency(amount);
  };

  const getGrowthColor = (val: string, type: 'income' | 'expense') => {
    const num = parseFloat(val);
    if (num === 0) return "bg-gray-100 text-gray-600";
    if (type === 'expense') {
      return num > 0 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700";
    }
    return num > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";
  };

  return (
    <div className="flex-1 p-4 space-y-4">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Toko ABC</h2>
          <p className="text-xs text-muted-foreground">Dashboard Overview</p>
        </div>
        <div className="flex items-center gap-3">
          <Popover open={notificationOpen} onOpenChange={setNotificationOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 relative">
                <Bell className="h-4 w-4" />
                <div className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-4 text-sm font-medium border-b">Notifikasi</div>
              <div className="p-4 text-xs text-muted-foreground">Tidak ada notifikasi baru</div>
            </PopoverContent>
          </Popover>

          <div className="flex items-center gap-3 bg-white border rounded-full pl-4 pr-1 py-1 shadow-sm">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold leading-none">{user.name}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide mt-0.5">{user.role}</p>
            </div>
            <Avatar className="h-8 w-8 border">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {user.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      {/* BALANCE CARD */}
      <Card className="bg-primary text-primary-foreground border-0">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs text-primary-foreground/70 mb-1">Total Saldo</p>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold">{formatBalance(data.totalBalance)}</h1>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-white/10 text-white"
                  onClick={() => setIsBalanceVisible(!isBalanceVisible)}
                >
                  {isBalanceVisible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                </Button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-primary-foreground/70">Rekening</p>
              <p className="text-xs font-mono">{data.accountNumber}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-400" />
            <span className="text-sm font-medium text-green-400">
              +{data.netProfitGrowth}% <span className="text-primary-foreground/60 font-normal">bulan ini</span>
            </span>
          </div>
        </CardContent>
      </Card>

      {/* STATS CARDS */}
      <div className="grid grid-cols-3 gap-2">
        <Card className="p-3">
          <div className="flex items-center gap-2 mb-2">
            <ArrowDownLeft className="h-3 w-3 text-green-600" />
            <span className="text-xs text-muted-foreground">Pemasukan</span>
          </div>
          <p className="text-sm font-bold">{formatCurrency(data.incomeThisMonth)}</p>
          <Badge variant="secondary" className={`text-[10px] mt-1 h-5 px-1 ${getGrowthColor(data.incomeGrowth, 'income')}`}>
            {parseFloat(data.incomeGrowth) > 0 ? '+' : ''}{data.incomeGrowth}%
          </Badge>
        </Card>

        <Card className="p-3">
          <div className="flex items-center gap-2 mb-2">
            <ArrowUpRight className="h-3 w-3 text-red-600" />
            <span className="text-xs text-muted-foreground">Pengeluaran</span>
          </div>
          <p className="text-sm font-bold">{formatCurrency(data.expenseThisMonth)}</p>
          <Badge variant="secondary" className={`text-[10px] mt-1 h-5 px-1 ${getGrowthColor(data.expenseGrowth, 'expense')}`}>
             {parseFloat(data.expenseGrowth) > 0 ? '+' : ''}{data.expenseGrowth}%
          </Badge>
        </Card>

        <Card className="p-3">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-3 w-3 text-blue-600" />
            <span className="text-xs text-muted-foreground">Laba Bersih</span>
          </div>
          <p className={`text-sm font-bold ${data.netProfitThisMonth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(data.netProfitThisMonth)}
          </p>
          <Badge variant="secondary" className={`text-[10px] mt-1 h-5 px-1 ${getGrowthColor(data.netProfitGrowth, 'income')}`}>
             {parseFloat(data.netProfitGrowth) > 0 ? '+' : ''}{data.netProfitGrowth}%
          </Badge>
        </Card>
      </div>

      {/* QUICK ACTIONS */}
      <div className="grid grid-cols-2 gap-2">
        <Button 
          variant="outline" 
          className="h-10 bg-white border-dashed border-2 hover:border-solid hover:border-primary/50 hover:bg-accent"
          onClick={() => onNavigate('transactions')}
        >
          <Plus className="h-4 w-4 mr-2" />
          <span className="text-xs font-medium">Catat Transaksi</span>
        </Button>
        <Button 
          variant="outline" 
          className="h-10 bg-white border-dashed border-2 hover:border-solid hover:border-primary/50 hover:bg-accent"
          onClick={() => onNavigate('debt')}
        >
          <Receipt className="h-4 w-4 mr-2" />
          <span className="text-xs font-medium">Utang Piutang</span>
        </Button>
      </div>

      {/* CHART REALTIME */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Arus Kas 7 Hari Terakhir</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.chartData} barCategoryGap="20%">
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#888' }} 
                  dy={5}
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="pemasukan" fill="#22c55e" radius={[4, 4, 0, 0]} name="Masuk" />
                <Bar dataKey="pengeluaran" fill="#ef4444" radius={[4, 4, 0, 0]} name="Keluar" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-[10px] text-muted-foreground">Pemasukan</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-[10px] text-muted-foreground">Pengeluaran</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* RECENT ACTIVITY */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Aktivitas Terbaru</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          {data.recentActivity.length === 0 ? (
            <p className="text-xs text-center text-muted-foreground py-4">Belum ada transaksi</p>
          ) : (
            data.recentActivity.map((item: any) => (
              <div key={item.id} className="flex justify-between items-center border-b border-border/40 pb-2 last:border-0 last:pb-0">
                <div>
                  <p className="text-xs font-medium">{item.description}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {item.date} • {item.category}
                  </p>
                </div>
                <span className={`text-xs font-bold ${
                  item.type === 'income' || item.type === 'receivable' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {item.type === 'income' || item.type === 'receivable' ? '+' : '-'}
                  {formatCurrency(item.amount)}
                </span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}