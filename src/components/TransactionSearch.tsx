import { useState, useEffect } from 'react';
import { Search, Filter, X, Calendar as CalendarIcon, ArrowUpCircle, ArrowDownCircle, Loader2, FileText } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { format } from 'date-fns';
import { Badge } from './ui/badge';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { getCategoryStyle, cn } from '../lib/utils';

const categories = [
  'Semua Kategori',
  'Pendapatan Penjualan', 'Gaji', 'Hasil Investasi', // Income
  'Biaya Operasional', 'Inventaris', 'Gaji Karyawan', 'Pemasaran', 'Utilitas', 'Sewa', 'Transportasi', 'Pajak & Biaya' // Expense
];

export function TransactionSearch() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Toggle
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter States
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState('Semua Kategori');
  
  // Date Filters
  const [filterDateFrom, setFilterDateFrom] = useState<Date | undefined>();
  const [filterDateTo, setFilterDateTo] = useState<Date | undefined>();
  const [showDateFromCalendar, setShowDateFromCalendar] = useState(false);
  const [showDateToCalendar, setShowDateToCalendar] = useState(false);

  // Amount Filters
  const [filterAmountMin, setFilterAmountMin] = useState('');
  const [filterAmountMax, setFilterAmountMax] = useState('');

  useEffect(() => {
    if (user) fetchTransactions();
  }, [user]);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user!.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = 
      searchQuery === '' ||
      (transaction.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (transaction.category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.amount.toString().includes(searchQuery);

    const matchesType = filterType === 'all' || transaction.type === filterType;

    const matchesCategory = filterCategory === 'Semua Kategori' || transaction.category === filterCategory;

    const tDate = new Date(transaction.date);
    tDate.setHours(0,0,0,0);
    
    let matchesDateFrom = true;
    if (filterDateFrom) {
        const from = new Date(filterDateFrom);
        from.setHours(0,0,0,0);
        matchesDateFrom = tDate >= from;
    }

    let matchesDateTo = true;
    if (filterDateTo) {
        const to = new Date(filterDateTo);
        to.setHours(0,0,0,0);
        matchesDateTo = tDate <= to;
    }

    const matchesAmountMin = !filterAmountMin || transaction.amount >= parseFloat(filterAmountMin);
    const matchesAmountMax = !filterAmountMax || transaction.amount <= parseFloat(filterAmountMax);

    return matchesSearch && matchesType && matchesCategory && 
           matchesDateFrom && matchesDateTo && matchesAmountMin && matchesAmountMax;
  });

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
    setSearchQuery('');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 min-h-screen pb-24">
      <div className="bg-white px-4 py-4 sticky top-0 z-20 shadow-sm">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Cari deskripsi, kategori, nominal..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 h-12 bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className={`flex-1 h-11 border rounded-xl transition-all ${showFilters ? 'border-blue-500 bg-blue-50 text-blue-600' : 'bg-white border-gray-300'}`}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
            {activeFiltersCount > 0 && (
              <Badge className="ml-2 bg-red-500 text-white hover:bg-red-600">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
          
          {(activeFiltersCount > 0 || searchQuery) && (
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

      {showFilters && (
        <div className="bg-white px-4 py-4 border-t border-gray-200 space-y-4 animate-in slide-in-from-top-2">
          <div>
            <label className="text-sm text-gray-700 mb-2 block font-medium">Jenis Transaksi</label>
            <div className="flex gap-2">
              <button onClick={() => setFilterType('all')} className={`flex-1 py-2 rounded-lg transition-all border ${filterType === 'all' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200'}`}>Semua</button>
              <button onClick={() => setFilterType('income')} className={`flex-1 py-2 rounded-lg transition-all border ${filterType === 'income' ? 'bg-green-500 text-white border-green-500' : 'bg-white text-gray-600 border-gray-200'}`}>Pemasukan</button>
              <button onClick={() => setFilterType('expense')} className={`flex-1 py-2 rounded-lg transition-all border ${filterType === 'expense' ? 'bg-red-500 text-white border-red-500' : 'bg-white text-gray-600 border-gray-200'}`}>Pengeluaran</button>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-700 mb-2 block font-medium">Kategori</label>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full h-11 bg-white border-2 border-gray-200 rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-700 mb-2 block font-medium">Dari Tanggal</label>
              <Popover open={showDateFromCalendar} onOpenChange={setShowDateFromCalendar}>
                <PopoverTrigger asChild>
                  <button className="w-full px-3 py-2.5 text-left bg-white border-2 border-gray-200 rounded-lg text-sm flex items-center justify-between">
                    <span className={!filterDateFrom ? "text-gray-500" : "text-gray-900"}>
                        {filterDateFrom ? format(filterDateFrom, 'dd MMM yyyy') : 'Tanggal mulai'}
                    </span>
                    <CalendarIcon className="w-4 h-4 text-gray-400" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={filterDateFrom} onSelect={(date) => { setFilterDateFrom(date); setShowDateFromCalendar(false); }} />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <label className="text-sm text-gray-700 mb-2 block font-medium">Sampai Tanggal</label>
              <Popover open={showDateToCalendar} onOpenChange={setShowDateToCalendar}>
                <PopoverTrigger asChild>
                  <button className="w-full px-3 py-2.5 text-left bg-white border-2 border-gray-200 rounded-lg text-sm flex items-center justify-between">
                    <span className={!filterDateTo ? "text-gray-500" : "text-gray-900"}>
                        {filterDateTo ? format(filterDateTo, 'dd MMM yyyy') : 'Tanggal akhir'}
                    </span>
                    <CalendarIcon className="w-4 h-4 text-gray-400" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={filterDateTo} onSelect={(date) => { setFilterDateTo(date); setShowDateToCalendar(false); }} />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-700 mb-2 block font-medium">Min. Nominal</label>
              <Input type="number" placeholder="0" value={filterAmountMin} onChange={(e) => setFilterAmountMin(e.target.value)} className="h-11 bg-white border-2 border-gray-200 rounded-lg" />
            </div>
            <div>
              <label className="text-sm text-gray-700 mb-2 block font-medium">Max. Nominal</label>
              <Input type="number" placeholder="∞" value={filterAmountMax} onChange={(e) => setFilterAmountMax(e.target.value)} className="h-11 bg-white border-2 border-gray-200 rounded-lg" />
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-hide space-y-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-500 font-medium">
            {isLoading ? 'Memuat...' : `${filteredTransactions.length} transaksi ditemukan`}
          </p>
        </div>

        {isLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-500 w-8 h-8" /></div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">Tidak ada transaksi ditemukan</p>
            <p className="text-sm text-gray-400 mt-1">Coba sesuaikan pencarian atau filter Anda</p>
          </div>
        ) : (
          filteredTransactions.map((transaction) => {
            const searchKey = (transaction.category === 'Lainnya' || transaction.category === 'other') ? transaction.description : transaction.category;
            const style = getCategoryStyle(searchKey);
            const Icon = style.icon;
            const isIncome = transaction.type === 'income';
            
            const iconBg = isIncome ? 'bg-green-100' : style.bg;
            const iconColor = isIncome ? 'text-green-600' : style.color;
            const amountColor = isIncome ? 'text-green-600' : 'text-red-600'; 

            return (
              <div
                key={transaction.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow active:scale-[0.99]"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg flex-shrink-0 ${iconBg} ${iconColor}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="text-gray-900 font-medium text-sm flex-1 min-w-0 line-clamp-1">
                        {transaction.description || transaction.category}
                      </h4>
                      <div className={`flex-shrink-0 font-semibold text-sm ${amountColor}`}>
                        {isIncome ? '+' : '-'} {formatCurrency(transaction.amount)}
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs text-gray-500 truncate bg-gray-50 px-2 py-0.5 rounded">
                        {transaction.category}
                      </p>
                      <div className="flex items-center gap-2">
                        {transaction.image_url && (
                            <span className="flex items-center gap-1 text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                                <FileText className="size-3"/> Struk
                            </span>
                        )}
                        <p className="text-xs text-gray-400">
                            {format(new Date(transaction.date), 'dd MMM yyyy')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}