import { useState } from 'react';
import { Search, Filter, X, Calendar, DollarSign, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar as CalendarComponent } from './ui/calendar';
import { format } from 'date-fns';
import { Badge } from './ui/badge';

// Mock transaction data
const mockTransactions = [
  { id: 1, type: 'expense', category: 'Biaya Operasional', amount: 250000, date: new Date(2025, 11, 5), description: 'Pembelian perlengkapan kantor', receipt: true },
  { id: 2, type: 'income', category: 'Pendapatan Penjualan', amount: 1500000, date: new Date(2025, 11, 5), description: 'Penjualan produk - Batch Desember', receipt: true },
  { id: 3, type: 'expense', category: 'Pemasaran', amount: 500000, date: new Date(2025, 11, 4), description: 'Kampanye iklan media sosial', receipt: false },
  { id: 4, type: 'income', category: 'Pendapatan Penjualan', amount: 800000, date: new Date(2025, 11, 4), description: 'Pembayaran jasa dari klien', receipt: true },
  { id: 5, type: 'expense', category: 'Inventaris', amount: 3000000, date: new Date(2025, 11, 3), description: 'Pembelian stok untuk Januari', receipt: true },
  { id: 6, type: 'expense', category: 'Gaji Karyawan', amount: 5000000, date: new Date(2025, 11, 2), description: 'Pembayaran gaji bulanan', receipt: false },
  { id: 7, type: 'income', category: 'Pendapatan Investasi', amount: 2000000, date: new Date(2025, 11, 1), description: 'Pembayaran dividen Q4', receipt: true },
  { id: 8, type: 'expense', category: 'Utilitas', amount: 450000, date: new Date(2025, 11, 1), description: 'Tagihan listrik dan air', receipt: true },
  { id: 9, type: 'expense', category: 'Sewa', amount: 2500000, date: new Date(2025, 10, 30), description: 'Sewa kantor - Desember', receipt: true },
  { id: 10, type: 'income', category: 'Pendapatan Penjualan', amount: 1200000, date: new Date(2025, 10, 30), description: 'Penjualan toko online', receipt: false },
  { id: 11, type: 'expense', category: 'Transportasi', amount: 300000, date: new Date(2025, 10, 29), description: 'Bahan bakar kendaraan pengiriman', receipt: true },
  { id: 12, type: 'expense', category: 'Pajak & Biaya', amount: 750000, date: new Date(2025, 10, 28), description: 'Pembayaran pajak bulanan', receipt: true },
];

const categories = [
  'Semua Kategori',
  'Pendapatan Penjualan',
  'Gaji',
  'Pendapatan Investasi',
  'Biaya Operasional',
  'Inventaris',
  'Gaji Karyawan',
  'Pemasaran',
  'Utilitas',
  'Sewa',
  'Transportasi',
  'Pajak & Biaya',
];

export function TransactionSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState('Semua Kategori');
  const [filterDateFrom, setFilterDateFrom] = useState<Date | undefined>();
  const [filterDateTo, setFilterDateTo] = useState<Date | undefined>();
  const [filterAmountMin, setFilterAmountMin] = useState('');
  const [filterAmountMax, setFilterAmountMax] = useState('');
  const [showDateFromCalendar, setShowDateFromCalendar] = useState(false);
  const [showDateToCalendar, setShowDateToCalendar] = useState(false);

  // Filter transactions based on search and filters
  const filteredTransactions = mockTransactions.filter((transaction) => {
    // Search query filter
    const matchesSearch = 
      searchQuery === '' ||
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.amount.toString().includes(searchQuery);

    // Type filter
    const matchesType = 
      filterType === 'all' || transaction.type === filterType;

    // Category filter
    const matchesCategory = 
      filterCategory === 'Semua Kategori' || transaction.category === filterCategory;

    // Date filter
    const matchesDateFrom = 
      !filterDateFrom || transaction.date >= filterDateFrom;
    const matchesDateTo = 
      !filterDateTo || transaction.date <= filterDateTo;

    // Amount filter
    const matchesAmountMin = 
      !filterAmountMin || transaction.amount >= parseFloat(filterAmountMin);
    const matchesAmountMax = 
      !filterAmountMax || transaction.amount <= parseFloat(filterAmountMax);

    return matchesSearch && matchesType && matchesCategory && 
           matchesDateFrom && matchesDateTo && matchesAmountMin && matchesAmountMax;
  });

  // Count active filters
  const activeFiltersCount = [
    filterType !== 'all',
    filterCategory !== 'Semua Kategori',
    filterDateFrom,
    filterDateTo,
    filterAmountMin,
    filterAmountMax,
  ].filter(Boolean).length;

  const clearAllFilters = () => {
    setFilterType('all');
    setFilterCategory('Semua Kategori');
    setFilterDateFrom(undefined);
    setFilterDateTo(undefined);
    setFilterAmountMin('');
    setFilterAmountMax('');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Search and Filter Section */}
      <div className="bg-white px-4 py-4">
        {/* Search Input */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Cari berdasarkan deskripsi, kategori"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 h-12 bg-gray-100 border-0 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* Filter Toggle Button */}
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className="flex-1 h-11 bg-white border border-gray-300 rounded-xl hover:bg-gray-50"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
            {activeFiltersCount > 0 && (
              <Badge className="ml-2 bg-red-500 text-white">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
          
          {activeFiltersCount > 0 && (
            <Button
              onClick={clearAllFilters}
              variant="ghost"
              className="px-3 h-11 text-gray-600 hover:text-red-600"
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white px-4 py-4 border-t border-gray-200 space-y-4">
          {/* Transaction Type Filter */}
          <div>
            <label className="text-sm text-gray-700 mb-2 block">Jenis Transaksi</label>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterType('all')}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  filterType === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 border border-gray-200'
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setFilterType('income')}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  filterType === 'income'
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-gray-600 border border-gray-200'
                }`}
              >
                Pemasukan
              </button>
              <button
                onClick={() => setFilterType('expense')}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  filterType === 'expense'
                    ? 'bg-red-500 text-white'
                    : 'bg-white text-gray-600 border border-gray-200'
                }`}
              >
                Pengeluaran
              </button>
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="text-sm text-gray-700 mb-2 block">Kategori</label>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full h-11 bg-white border-2 border-gray-200 rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range Filter */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-700 mb-2 block">Dari Tanggal</label>
              <Popover open={showDateFromCalendar} onOpenChange={setShowDateFromCalendar}>
                <PopoverTrigger asChild>
                  <button className="w-full px-3 py-2 text-left bg-white border-2 border-gray-200 rounded-lg text-sm hover:border-blue-400">
                    {filterDateFrom ? format(filterDateFrom, 'dd MMM') : 'Tanggal mulai'}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={filterDateFrom}
                    onSelect={(date) => {
                      setFilterDateFrom(date);
                      setShowDateFromCalendar(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <label className="text-sm text-gray-700 mb-2 block">Sampai Tanggal</label>
              <Popover open={showDateToCalendar} onOpenChange={setShowDateToCalendar}>
                <PopoverTrigger asChild>
                  <button className="w-full px-3 py-2 text-left bg-white border-2 border-gray-200 rounded-lg text-sm hover:border-blue-400">
                    {filterDateTo ? format(filterDateTo, 'dd MMM') : 'Tanggal akhir'}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={filterDateTo}
                    onSelect={(date) => {
                      setFilterDateTo(date);
                      setShowDateToCalendar(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Amount Range Filter */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-700 mb-2 block">Jumlah Minimum</label>
              <Input
                type="number"
                placeholder="0"
                value={filterAmountMin}
                onChange={(e) => setFilterAmountMin(e.target.value)}
                className="h-11 bg-white border-2 border-gray-200 rounded-lg"
              />
            </div>
            
            <div>
              <label className="text-sm text-gray-700 mb-2 block">Jumlah Maksimum</label>
              <Input
                type="number"
                placeholder="∞"
                value={filterAmountMax}
                onChange={(e) => setFilterAmountMax(e.target.value)}
                className="h-11 bg-white border-2 border-gray-200 rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-hide">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600">
            {filteredTransactions.length} transaksi ditemukan
          </p>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Tidak ada transaksi ditemukan</p>
            <p className="text-sm text-gray-400 mt-2">Coba sesuaikan pencarian atau filter Anda</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg flex-shrink-0 ${ 
                    transaction.type === 'income' 
                      ? 'bg-green-100' 
                      : 'bg-red-100'
                  }`}>
                    {transaction.type === 'income' ? (
                      <ArrowUpCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <ArrowDownCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="text-gray-900 flex-1 min-w-0">
                        {transaction.description}
                      </h4>
                      <div className={`flex-shrink-0 ${
                        transaction.type === 'income' 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm text-gray-500">{transaction.category}</p>
                      <p className={`text-sm flex-shrink-0 ${
                        transaction.type === 'income' 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {formatCurrency(transaction.amount)}
                      </p>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {format(transaction.date, 'dd MMM yyyy')}
                      {transaction.receipt && (
                        <span className="ml-2 text-blue-600">• Ada kuitansi</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}