import { useState, useEffect } from 'react';
import { Building2, User, Calendar, Plus, TrendingDown, TrendingUp, Wallet, Check, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

// Tipe Data DB
interface DebtTransaction {
  id: string;
  type: 'payable' | 'receivable';
  name: string;
  description: string;
  amount: number;
  due_date: string;
  status: 'active' | 'overdue' | 'paid';
}

export function DebtManagement() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<DebtTransaction[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'payable' | 'receivable'>('all');
  const [isLoading, setIsLoading] = useState(true);
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<DebtTransaction | null>(null);
  
  // Add Form
  const [addType, setAddType] = useState<'payable' | 'receivable'>('payable');
  const [newCategory, setNewCategory] = useState('');
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newDueDate, setNewDueDate] = useState('');

  // Pay Form
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentNote, setPaymentNote] = useState('');

  // 1. FETCH DATA
  const fetchDebts = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('debts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDebts();
  }, [user]);

  // 2. TAMBAH DATA
  const handleAddSubmit = async () => {
    if (!newName || !newAmount || !newDueDate) {
        toast.error('Lengkapi data wajib');
        return;
    }

    try {
      const { error } = await supabase.from('debts').insert({
        user_id: user?.id,
        type: addType,
        name: newName,
        description: newDescription,
        amount: parseFloat(newAmount),
        due_date: newDueDate,
        status: 'active'
      });

      if (error) throw error;

      toast.success('Disimpan');
      fetchDebts();
      setShowAddModal(false);
      
      // Reset
      setNewName(''); setNewAmount(''); setNewDescription(''); setNewDueDate('');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // 3. BAYAR / LUNAS (Interconnected)
  const handlePayClick = (t: DebtTransaction) => {
    setSelectedTransaction(t);
    setPaymentAmount(t.amount.toString());
    setShowPayModal(true);
  };

  const handlePaymentSubmit = async () => {
    if (!selectedTransaction || !user) return;

    try {
      // A. Update Status -> Paid
      const { error: updateError } = await supabase
        .from('debts')
        .update({ status: 'paid' })
        .eq('id', selectedTransaction.id);

      if (updateError) throw updateError;

      // B. Catat di Arus Kas
      const isPayable = selectedTransaction.type === 'payable';
      
      await supabase.from('transactions').insert({
        user_id: user.id,
        amount: parseFloat(paymentAmount),
        type: isPayable ? 'expense' : 'income',
        category: isPayable ? 'Bayar Utang' : 'Terima Piutang', // Kategori agar Ikon muncul
        description: `${selectedTransaction.name} ${paymentNote ? '(' + paymentNote + ')' : ''}`,
        date: new Date().toISOString().split('T')[0]
      });

      toast.success('Lunas & Tercatat di Arus Kas');
      fetchDebts();
      setShowPayModal(false);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // 4. HITUNG SUMMARY (Hanya Active & Overdue)
  const activeTransactions = transactions.filter(t => t.status !== 'paid');
  const totalPayables = activeTransactions.filter(t => t.type === 'payable').reduce((sum, t) => sum + Number(t.amount), 0);
  const totalReceivables = activeTransactions.filter(t => t.type === 'receivable').reduce((sum, t) => sum + Number(t.amount), 0);
  const netBalance = totalReceivables - totalPayables;

  const filteredTransactions = activeTransactions.filter(t => {
    if (activeTab === 'all') return true;
    return t.type === activeTab;
  });

  const formatCurrency = (amount: number) => {
    const formatted = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Math.abs(amount));
    if (Math.abs(amount) >= 1000000) return 'Rp' + (Math.abs(amount) / 1000000).toFixed(1) + 'jt';
    return formatted.replace(/\s/g, '');
  };

  const getDaysUntil = (dateStr: string) => {
    const today = new Date(); today.setHours(0,0,0,0);
    const dueDate = new Date(dateStr); dueDate.setHours(0,0,0,0);
    return Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      {/* Page Title */}
      <div className="bg-blue-600 px-4 py-6 -mx-4">
        <h1 className="text-white text-xl">Utang & Piutang</h1>
      </div>

      {/* Ringkasan */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-gray-900">Ringkasan</h2>
          <Button onClick={() => setShowAddModal(true)} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white h-8 px-3 rounded-lg"><Plus className="w-4 h-4" /></Button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-2.5">
            <p className="text-[10px] text-blue-100 mb-0.5">Saldo Bersih</p>
            <p className="text-sm text-white font-semibold">{formatCurrency(netBalance)}</p>
          </div>
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-2.5">
            <p className="text-[10px] text-red-100 mb-0.5">Utang</p>
            <p className="text-sm text-white font-semibold">{formatCurrency(totalPayables)}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-2.5">
            <p className="text-[10px] text-green-100 mb-0.5">Piutang</p>
            <p className="text-sm text-white font-semibold">{formatCurrency(totalReceivables)}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 py-3 bg-white border-y sticky top-0 z-10 shadow-sm">
        <div className="flex gap-1.5">
          {['all', 'payable', 'receivable'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab as any)} className={`flex-1 py-1.5 px-2 rounded-md text-xs font-medium transition-all ${activeTab === tab ? (tab === 'payable' ? 'bg-red-500 text-white' : tab === 'receivable' ? 'bg-green-500 text-white' : 'bg-blue-600 text-white') : 'text-gray-600 hover:bg-gray-100'}`}>
              {tab === 'all' ? 'Semua' : tab === 'payable' ? 'Utang' : 'Piutang'} · {activeTransactions.filter(t => tab === 'all' ? true : t.type === tab).length}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="px-4 py-3">
        {isLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-blue-500 w-8 h-8"/></div>
        ) : filteredTransactions.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-dashed text-gray-500 text-sm">Tidak ada data aktif</div>
        ) : (
          <div className="space-y-2">
            {filteredTransactions.map((t) => {
              const days = getDaysUntil(t.due_date);
              const isOverdue = days < 0;
              const isPayable = t.type === 'payable';
              
              return (
                <div key={t.id} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg shrink-0 ${isPayable ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                      {isPayable ? <Building2 className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-900 truncate">{t.name}</h4>
                          <p className="text-xs text-gray-500 truncate">{t.description || '-'}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className={`text-sm font-semibold ${isPayable ? 'text-red-600' : 'text-green-600'}`}>
                            {formatCurrency(t.amount)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                            {new Date(t.due_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                          </span>
                          {isOverdue && <span className="px-1.5 py-0.5 bg-red-100 text-red-600 rounded text-[10px] font-bold">Lewat {Math.abs(days)} hari</span>}
                        </div>

                        <Button onClick={() => handlePayClick(t)} size="sm" className={`h-7 px-2.5 rounded-lg text-xs font-medium shadow-sm transition-colors ${isPayable ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}>
                          {isPayable ? 'Bayar' : 'Terima'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Payment Modal */}
      <Dialog open={showPayModal} onOpenChange={setShowPayModal}>
        <DialogContent className="sm:max-w-[400px] p-0 gap-0 overflow-hidden rounded-2xl">
          <div className={`p-4 ${selectedTransaction?.type === 'payable' ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-green-500 to-green-600'}`}>
            <DialogTitle className="text-white flex items-center gap-2 mb-1">
              {selectedTransaction?.type === 'payable' ? <><Wallet className="w-5 h-5" /> Bayar Utang</> : <><Check className="w-5 h-5" /> Terima Pembayaran</>}
            </DialogTitle>
            <DialogDescription className="text-white/80 text-xs">{selectedTransaction?.name}</DialogDescription>
          </div>
          <div className="p-5 space-y-4">
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 text-center">
              <p className="text-xs text-gray-500 mb-1">Total Tagihan</p>
              <p className="text-2xl font-bold text-gray-900">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(selectedTransaction?.amount || 0)}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1.5 block">Jumlah Bayar</label>
              <Input type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} className="h-11" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1.5 block">Catatan</label>
              <Textarea value={paymentNote} onChange={(e) => setPaymentNote(e.target.value)} className="h-20 resize-none" placeholder="Opsional..." />
            </div>
          </div>
          <div className="flex gap-3 p-5 pt-0">
            <Button variant="outline" className="flex-1 h-11 rounded-xl" onClick={() => setShowPayModal(false)}>Batal</Button>
            <Button className={`flex-1 h-11 rounded-xl text-white ${selectedTransaction?.type === 'payable' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`} onClick={handlePaymentSubmit}>Konfirmasi</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-[400px] p-0 gap-0 overflow-hidden rounded-2xl">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
            <DialogTitle className="text-white mb-1">Tambah Baru</DialogTitle>
            <DialogDescription className="text-white/80 text-xs">Catat utang atau piutang baru</DialogDescription>
          </div>
          <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1.5 block">Jenis</label>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setAddType('payable')} className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1 ${addType === 'payable' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 text-gray-600'}`}>
                  <TrendingDown className="w-5 h-5" /> <span className="text-xs font-bold">Utang</span>
                </button>
                <button onClick={() => setAddType('receivable')} className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1 ${addType === 'receivable' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600'}`}>
                  <TrendingUp className="w-5 h-5" /> <span className="text-xs font-bold">Piutang</span>
                </button>
              </div>
            </div>
            
            {/* Category Select (Opsional) */}
            <div>
               <label className="text-xs font-medium text-gray-700 mb-1.5 block">Kategori</label>
               <Select value={newCategory} onValueChange={setNewCategory}>
                  <SelectTrigger className="h-11 rounded-xl">
                     <SelectValue placeholder="Pilih kategori (Opsional)" />
                  </SelectTrigger>
                  <SelectContent>
                     {addType === 'payable' ? (
                        <>
                           <SelectItem value="Pinjaman Bank">Pinjaman Bank</SelectItem>
                           <SelectItem value="Kredit Supplier">Kredit Supplier</SelectItem>
                           <SelectItem value="Lainnya">Lainnya</SelectItem>
                        </>
                     ) : (
                        <>
                           <SelectItem value="Penjualan Kredit">Penjualan Kredit</SelectItem>
                           <SelectItem value="Piutang Usaha">Piutang Usaha</SelectItem>
                           <SelectItem value="Lainnya">Lainnya</SelectItem>
                        </>
                     )}
                  </SelectContent>
               </Select>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-700 mb-1.5 block">{addType === 'payable' ? 'Nama Kreditor' : 'Nama Debitor'}</label>
              <Input placeholder="Contoh: Bank BRI" value={newName} onChange={e => setNewName(e.target.value)} className="h-11 rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-3">
               <div><label className="text-xs font-medium text-gray-700 mb-1.5 block">Jumlah</label><Input type="number" value={newAmount} onChange={e => setNewAmount(e.target.value)} className="h-11 rounded-xl" /></div>
               <div><label className="text-xs font-medium text-gray-700 mb-1.5 block">Jatuh Tempo</label><Input type="date" value={newDueDate} onChange={e => setNewDueDate(e.target.value)} className="h-11 rounded-xl" /></div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1.5 block">Keterangan</label>
              <Input placeholder="Opsional" value={newDescription} onChange={e => setNewDescription(e.target.value)} className="h-11 rounded-xl" />
            </div>
          </div>
          <div className="flex gap-3 p-5 pt-0 border-t border-gray-100 mt-4">
            <Button variant="outline" className="flex-1 h-11 rounded-xl" onClick={() => setShowAddModal(false)}>Batal</Button>
            <Button className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl" onClick={handleAddSubmit}>Simpan</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}