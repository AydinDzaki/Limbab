import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import { Plus, ArrowUpRight, ArrowDownLeft, TrendingUp, DollarSign, Receipt, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  const financialSummary = {
    totalBalance: 28475000,
    totalIncome: 45250000,
    totalExpense: 32180000,
    netProfit: 13070000,
    monthlyGrowth: 2.5,
    accountNumber: "****1234"
  };

  const quickStats = [
    { title: "Pemasukan", value: financialSummary.totalIncome, icon: ArrowDownLeft, trend: "up", change: "+8.2%" },
    { title: "Pengeluaran", value: financialSummary.totalExpense, icon: ArrowUpRight, trend: "down", change: "-2.1%" },
    { title: "Laba Bersih", value: financialSummary.netProfit, icon: TrendingUp, trend: "up", change: "+12.5%" }
  ];

  const chartData = [
    { name: 'Sen', pemasukan: 18, pengeluaran: 12 },
    { name: 'Sel', pemasukan: 25, pengeluaran: 19 },
    { name: 'Rab', pemasukan: 22, pengeluaran: 15 },
    { name: 'Kam', pemasukan: 35, pengeluaran: 25 },
    { name: 'Jum', pemasukan: 28, pengeluaran: 22 },
    { name: 'Sab', pemasukan: 42, pengeluaran: 30 },
    { name: 'Min', pemasukan: 38, pengeluaran: 28 }
  ];

  // Notifications disabled — removed Notifikasi Pajak UI

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatBalance = (amount: number) => {
    if (!isBalanceVisible) return "Rp ****.**";
    return `Rp ${(amount / 1000000).toFixed(1)}jt`;
  };

  return (
    <div className="flex-1 p-4 space-y-4">
      {/* Compact Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg">Toko ABC</h2>
          <p className="text-xs text-muted-foreground">Selamat datang kembali</p>
        </div>
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">TA</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Balance Card */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white border-0">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-xs text-gray-300 mb-1">Total Saldo</p>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl">{formatBalance(financialSummary.totalBalance)}</h1>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-gray-300 hover:text-white hover:bg-white/10"
                  onClick={() => setIsBalanceVisible(!isBalanceVisible)}
                >
                  {isBalanceVisible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                </Button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-300">Rekening</p>
              <p className="text-xs">{financialSummary.accountNumber}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <TrendingUp className="h-3 w-3 text-green-400" />
            <span className="text-xs text-green-400">+{financialSummary.monthlyGrowth}% bulan ini</span>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2">
        {quickStats.map((stat, index) => (
          <Card key={index} className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <stat.icon className={`h-3 w-3 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`} />
              <span className="text-xs text-muted-foreground">{stat.title}</span>
            </div>
            <p className="text-sm font-medium">{formatCurrency(stat.value)}</p>
            <Badge variant={stat.trend === 'up' ? 'default' : 'secondary'} className="text-xs mt-1 h-4">
              {stat.change}
            </Badge>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-2">
        <Button 
          variant="outline" 
          className="h-12 flex flex-col items-center justify-center gap-1"
          onClick={() => onNavigate('profile')}
        >
          <Plus className="h-4 w-4" />
          <span className="text-xs">Catat Transaksi</span>
        </Button>
        <Button 
          variant="outline" 
          className="h-12 flex flex-col items-center justify-center gap-1"
          onClick={() => onNavigate('profile')}
        >
          <Receipt className="h-4 w-4" />
          <span className="text-xs">Utang Piutang</span>
        </Button>
      </div>

      {/* Mini Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Perbandingan Pemasukan vs Pengeluaran</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barCategoryGap="20%">
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                <YAxis hide />
                <Bar dataKey="pemasukan" fill="#22c55e" radius={[2, 2, 0, 0]} />
                <Bar dataKey="pengeluaran" fill="#ef4444" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-xs text-muted-foreground">Pemasukan</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className="text-xs text-muted-foreground">Pengeluaran</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Aktivitas Terbaru</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          {[
            { desc: "Penjualan ke PT ABC", amount: "+2.5jt", time: "10:30" },
            { desc: "Pembelian bahan", amount: "-850rb", time: "09:15" },
            { desc: "Transfer dari Bank", amount: "+5jt", time: "08:45" }
          ].map((item, i) => (
            <div key={i} className="flex justify-between items-center py-1">
              <div>
                <p className="text-xs">{item.desc}</p>
                <p className="text-xs text-muted-foreground">{item.time}</p>
              </div>
              <span className={`text-xs ${item.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {item.amount}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}