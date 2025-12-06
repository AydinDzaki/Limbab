import { useState } from 'react';
import { Calendar, Upload, X, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar as CalendarComponent } from './ui/calendar';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { toast } from 'sonner@2.0.3';

interface TransactionEntryProps {
  onBack?: () => void;
}

const incomeCategories = [
  { value: 'salary', label: 'Gaji', icon: '💼' },
  { value: 'sales', label: 'Pendapatan Penjualan', icon: '💰' },
  { value: 'investment', label: 'Hasil Investasi', icon: '📈' },
  { value: 'loan', label: 'Pinjaman/Pembiayaan', icon: '🏦' },
  { value: 'other-income', label: 'Pendapatan Lainnya', icon: '💵' },
];

const expenseCategories = [
  { value: 'operational', label: 'Biaya Operasional', icon: '⚙️' },
  { value: 'inventory', label: 'Inventori/Stok', icon: '📦' },
  { value: 'salary-expense', label: 'Gaji Karyawan', icon: '👥' },
  { value: 'marketing', label: 'Pemasaran', icon: '📢' },
  { value: 'utilities', label: 'Utilitas', icon: '💡' },
  { value: 'rent', label: 'Sewa', icon: '🏢' },
  { value: 'transport', label: 'Transportasi', icon: '🚗' },
  { value: 'tax', label: 'Pajak & Biaya', icon: '📋' },
  { value: 'other-expense', label: 'Pengeluaran Lainnya', icon: '💳' },
];

export function TransactionEntry({ onBack }: TransactionEntryProps) {
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [receipt, setReceipt] = useState<string | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const categories = transactionType === 'income' ? incomeCategories : expenseCategories;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceipt(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveReceipt = () => {
    setReceipt(null);
  };

  const handleSaveTransaction = () => {
    if (!amount || !category) {
      toast.error('Mohon lengkapi semua field yang wajib diisi');
      return;
    }

    // Mock save functionality
    toast.success(`Transaksi ${transactionType === 'income' ? 'pemasukan' : 'pengeluaran'} berhasil disimpan!`);
    
    // Reset form
    setAmount('');
    setCategory('');
    setDescription('');
    setReceipt(null);
    setDate(new Date());
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-6">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="p-1 hover:bg-blue-700 rounded-lg transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
          )}
          <div>
            <h1 className="text-white text-xl">Tambah Transaksi</h1>
          </div>
        </div>
      </div>

      {/* Type Toggle */}
      <div className="bg-white px-4 py-4 shadow-sm">
        <div className="flex gap-3">
          <button
            onClick={() => setTransactionType('expense')}
            className={`flex-1 py-3 rounded-xl transition-all ${
              transactionType === 'expense'
                ? 'bg-red-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Pengeluaran
          </button>
          <button
            onClick={() => setTransactionType('income')}
            className={`flex-1 py-3 rounded-xl transition-all ${
              transactionType === 'income'
                ? 'bg-green-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Pemasukan
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-hide">
        {/* Amount Input - Large and Prominent */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <Label htmlFor="amount" className="text-gray-700 mb-2 block">
            Jumlah (Nominal) *
          </Label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-gray-400">Rp</span>
            <Input
              id="amount"
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-3xl h-16 pl-16 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">Masukkan jumlah transaksi</p>
        </div>

        {/* Date Picker */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <Label htmlFor="date" className="text-gray-700 mb-2 block">
            Tanggal Transaksi *
          </Label>
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <button
                id="date"
                className="w-full flex items-center justify-between px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white"
              >
                <span className="text-gray-900">{format(date, 'PPP', { locale: id })}</span>
                <Calendar className="w-5 h-5 text-gray-400" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={(newDate) => {
                  if (newDate) {
                    setDate(newDate);
                    setIsCalendarOpen(false);
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Category Dropdown */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <Label htmlFor="category" className="text-gray-700 mb-2 block">
            Kategori *
          </Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger
              id="category"
              className="w-full h-12 border-2 border-gray-200 rounded-xl hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            >
              <SelectValue placeholder="Pilih kategori" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  <div className="flex items-center gap-2">
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <Label htmlFor="description" className="text-gray-700 mb-2 block">
            Deskripsi
          </Label>
          <Textarea
            id="description"
            placeholder="Tambahkan catatan atau detail transaksi..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[120px] border-2 border-gray-200 rounded-xl resize-none hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
          />
        </div>

        {/* Upload Receipt/Proof Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <Label className="text-gray-700 mb-3 block">
            Upload Bukti/Struk
          </Label>
          
          {!receipt ? (
            <label
              htmlFor="receipt-upload"
              className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 cursor-pointer bg-gray-50 hover:bg-blue-50 transition-all"
            >
              <Upload className="w-10 h-10 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-1">Klik untuk upload bukti</p>
              <p className="text-xs text-gray-400">PNG, JPG maksimal 10MB</p>
              <input
                id="receipt-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          ) : (
            <div className="relative">
              <img
                src={receipt}
                alt="Receipt"
                className="w-full h-48 object-cover rounded-xl"
              />
              <button
                onClick={handleRemoveReceipt}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer with Save Button */}
      <div className="bg-white px-4 py-4 shadow-lg border-t border-gray-200">
        <Button
          onClick={handleSaveTransaction}
          className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition-all hover:shadow-lg"
        >
          Simpan Transaksi
        </Button>
      </div>
    </div>
  );
}