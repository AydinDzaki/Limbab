import { useState } from 'react';
import { Calendar, Upload, X, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar as CalendarComponent } from './ui/calendar';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { toast } from 'sonner'; 
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface TransactionEntryProps {
  onBack?: () => void;
}

const incomeCategories = [
  { value: 'Gaji', label: 'Gaji', icon: '💼' },
  { value: 'Pendapatan Penjualan', label: 'Pendapatan Penjualan', icon: '💰' },
  { value: 'Hasil Investasi', label: 'Hasil Investasi', icon: '📈' },
  { value: 'Pinjaman', label: 'Pinjaman', icon: '🏦' },
  { value: 'Lainnya', label: 'Pendapatan Lainnya', icon: '💵' },
];

const expenseCategories = [
  { value: 'Biaya Operasional', label: 'Biaya Operasional', icon: '⚙️' },
  { value: 'Inventaris', label: 'Inventori/Stok', icon: '📦' },
  { value: 'Gaji Karyawan', label: 'Gaji Karyawan', icon: '👥' },
  { value: 'Pemasaran', label: 'Pemasaran', icon: '📢' },
  { value: 'Utilitas', label: 'Utilitas', icon: '💡' },
  { value: 'Sewa', label: 'Sewa', icon: '🏢' },
  { value: 'Transportasi', label: 'Transportasi', icon: '🚗' },
  { value: 'Makanan & Minuman', label: 'Makan & Minum', icon: '🍽️' },
  { value: 'Lainnya', label: 'Pengeluaran Lainnya', icon: '💳' },
];

export function TransactionEntry({ onBack }: TransactionEntryProps) {
  const { user } = useAuth();
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const categories = transactionType === 'income' ? incomeCategories : expenseCategories;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setReceiptPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveReceipt = () => {
    setReceiptFile(null);
    setReceiptPreview(null);
  };

  const handleSaveTransaction = async () => {
    if (!amount || !category) {
      toast.error('Isi jumlah dan kategori!');
      return;
    }

    setIsLoading(true);
    try {
      let imageUrl = null;
      if (receiptFile && user) {
        const fileName = `${user.id}/${Date.now()}`;
        const { error: uploadError } = await supabase.storage.from('receipts').upload(fileName, receiptFile);
        if (!uploadError) {
          const { data } = supabase.storage.from('receipts').getPublicUrl(fileName);
          imageUrl = data.publicUrl;
        }
      }

      await supabase.from('transactions').insert({
        user_id: user?.id,
        amount: parseFloat(amount),
        type: transactionType,
        category,
        description,
        date: format(date, 'yyyy-MM-dd'),
        image_url: imageUrl
      });

      toast.success('Disimpan!');
      setAmount(''); setCategory(''); setDescription(''); handleRemoveReceipt();
      if (onBack) onBack();
    } catch (error) {
      toast.error('Gagal menyimpan');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
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

      <div className="bg-white px-4 py-4 shadow-sm">
        <div className="flex gap-3">
          <button onClick={() => setTransactionType('expense')} className={`flex-1 py-3 rounded-xl transition-all ${transactionType === 'expense' ? 'bg-red-500 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Pengeluaran</button>
          <button onClick={() => setTransactionType('income')} className={`flex-1 py-3 rounded-xl transition-all ${transactionType === 'income' ? 'bg-green-500 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Pemasukan</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-hide">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <Label className="text-gray-700 mb-2 block">Jumlah (Nominal) *</Label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-gray-400">Rp</span>
            <Input type="number" placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)} className="text-3xl h-16 pl-16 border-2 border-gray-200 rounded-xl" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <Label className="text-gray-700 mb-2 block">Tanggal Transaksi *</Label>
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <button className="w-full flex items-center justify-between px-4 py-3 border-2 border-gray-200 rounded-xl bg-white">
                <span className="text-gray-900">{format(date, 'PPP', { locale: id })}</span>
                <Calendar className="w-5 h-5 text-gray-400" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent mode="single" selected={date} onSelect={(d) => { if(d) setDate(d); setIsCalendarOpen(false); }} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <Label className="text-gray-700 mb-2 block">Kategori *</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full h-12 border-2 border-gray-200 rounded-xl"><SelectValue placeholder="Pilih kategori" /></SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  <div className="flex items-center gap-2"><span>{cat.icon}</span><span>{cat.label}</span></div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <Label className="text-gray-700 mb-2 block">Deskripsi</Label>
          <Textarea placeholder="Tambahkan catatan..." value={description} onChange={(e) => setDescription(e.target.value)} className="min-h-[100px] border-2 border-gray-200 rounded-xl resize-none" />
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <Label className="text-gray-700 mb-3 block">Upload Bukti/Struk</Label>
          {!receiptPreview ? (
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-blue-50">
              <Upload className="w-10 h-10 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">Klik untuk upload bukti</p>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          ) : (
            <div className="relative">
              <img src={receiptPreview} alt="Receipt" className="w-full h-48 object-cover rounded-xl" />
              <button onClick={handleRemoveReceipt} className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full shadow-lg"><X className="w-4 h-4" /></button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white px-4 py-4 shadow-lg border-t border-gray-200">
        <Button onClick={handleSaveTransaction} disabled={isLoading} className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md">
          {isLoading ? <Loader2 className="animate-spin" /> : 'Simpan Transaksi'}
        </Button>
      </div>
    </div>
  );
}