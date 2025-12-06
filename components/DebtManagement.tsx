import { Building2, User, Calendar, Plus, ArrowDownRight, ArrowUpRight, Wallet, Check, X, Clock, TrendingDown, TrendingUp, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';

interface Transaction {
  id: number;
  type: 'payable' | 'receivable';
  name: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'active' | 'overdue' | 'paid';
  icon: any;
}

const initialTransactions: Transaction[] = [
  {
    id: 1,
    type: 'payable',
    name: 'Bank Mandiri',
    description: 'Pinjaman Modal Usaha',
    amount: 32000000,
    dueDate: '2024-12-20',
    status: 'active',
    icon: Building2,
  },
  {
    id: 2,
    type: 'payable',
    name: 'PT Supplier Jaya',
    description: 'Pembelian Stok Barang',
    amount: 8500000,
    dueDate: '2024-12-25',
    status: 'active',
    icon: User,
  },
  {
    id: 3,
    type: 'payable',
    name: 'BCA KUR',
    description: 'Kredit Tanpa Agunan',
    amount: 45000000,
    dueDate: '2024-12-08',
    status: 'overdue',
    icon: Building2,
  },
  {
    id: 4,
    type: 'receivable',
    name: 'Toko Maju Jaya',
    description: 'Penjualan Kredit',
    amount: 15000000,
    dueDate: '2024-12-15',
    status: 'active',
    icon: Building2,
  },
  {
    id: 5,
    type: 'receivable',
    name: 'CV Sejahtera',
    description: 'Piutang Usaha',
    amount: 22000000,
    dueDate: '2024-12-10',
    status: 'active',
    icon: Building2,
  },
  {
    id: 6,
    type: 'receivable',
    name: 'PT Berkah Sentosa',
    description: 'Invoice #2024-089',
    amount: 18000000,
    dueDate: '2024-12-05',
    status: 'overdue',
    icon: User,
  },
];

export function DebtManagement() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [activeTab, setActiveTab] = useState<'all' | 'payable' | 'receivable'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  
  // Add form states
  const [addType, setAddType] = useState<'payable' | 'receivable'>('payable');
  const [newCategory, setNewCategory] = useState('');
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newDueDate, setNewDueDate] = useState('');

  // Payment form states
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentNote, setPaymentNote] = useState('');

  // Calculate totals
  const activeTransactions = transactions.filter(t => t.status !== 'paid');
  const totalPayables = activeTransactions
    .filter(t => t.type === 'payable')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalReceivables = activeTransactions
    .filter(t => t.type === 'receivable')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const netBalance = totalReceivables - totalPayables;

  // Filter based on active tab
  const filteredTransactions = activeTransactions.filter(t => {
    if (activeTab === 'all') return true;
    return t.type === activeTab;
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  };

  const getDaysUntil = (dateStr: string) => {
    const today = new Date();
    const dueDate = new Date(dateStr);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handlePayClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setPaymentAmount(transaction.amount.toString());
    setPaymentNote('');
    setShowPayModal(true);
  };

  const handlePaymentSubmit = () => {
    if (!selectedTransaction) return;
    
    const amount = parseFloat(paymentAmount);
    
    if (amount >= selectedTransaction.amount) {
      setTransactions(transactions.map(t => 
        t.id === selectedTransaction.id 
          ? { ...t, status: 'paid' as const } 
          : t
      ));
    } else {
      setTransactions(transactions.map(t => 
        t.id === selectedTransaction.id 
          ? { ...t, amount: t.amount - amount } 
          : t
      ));
    }
    
    setShowPayModal(false);
    setSelectedTransaction(null);
  };

  const handleAddNew = () => {
    setNewCategory('');
    setNewName('');
    setNewDescription('');
    setNewAmount('');
    setNewDueDate('');
    setShowAddModal(true);
  };

  const handleAddSubmit = () => {
    const newTransaction: Transaction = {
      id: Math.max(...transactions.map(t => t.id)) + 1,
      type: addType,
      name: newName,
      description: newDescription,
      amount: parseFloat(newAmount),
      dueDate: newDueDate,
      status: 'active',
      icon: Building2,
    };
    
    setTransactions([...transactions, newTransaction]);
    setShowAddModal(false);
  };

  const formatCurrency = (amount: number) => {
    const formatted = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
    
    // Convert to short format
    if (amount >= 1000000) {
      return 'Rp' + (amount / 1000000).toFixed(1) + 'jt';
    }
    return formatted.replace(/\s/g, '');
  };

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      {/* Page Title Banner - Full Width */}
      <div className="bg-blue-600 px-4 py-6 -mx-4">
        <h1 className="text-white text-xl">Utang & Piutang</h1>
      </div>

      {/* Ringkasan Section */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-gray-900">Ringkasan</h2>
          <Button
            onClick={handleAddNew}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white h-8 px-3 rounded-lg"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-2.5">
            <p className="text-[10px] text-blue-100 mb-0.5">Saldo Bersih</p>
            <p className={`text-sm text-white`}>
              {formatCurrency(Math.abs(netBalance))}
            </p>
          </div>
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-2.5">
            <p className="text-[10px] text-red-100 mb-0.5">Utang</p>
            <p className="text-sm text-white">
              {formatCurrency(totalPayables)}
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-2.5">
            <p className="text-[10px] text-green-100 mb-0.5">Piutang</p>
            <p className="text-sm text-white">
              {formatCurrency(totalReceivables)}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 py-3 bg-white border-y sticky top-0 z-10">
        <div className="flex gap-1.5">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-1.5 px-2 rounded-md text-xs font-medium transition-all ${
              activeTab === 'all'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Semua · {activeTransactions.length}
          </button>
          <button
            onClick={() => setActiveTab('payable')}
            className={`flex-1 py-1.5 px-2 rounded-md text-xs font-medium transition-all ${
              activeTab === 'payable'
                ? 'bg-red-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Utang · {activeTransactions.filter(t => t.type === 'payable').length}
          </button>
          <button
            onClick={() => setActiveTab('receivable')}
            className={`flex-1 py-1.5 px-2 rounded-md text-xs font-medium transition-all ${
              activeTab === 'receivable'
                ? 'bg-green-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Piutang · {activeTransactions.filter(t => t.type === 'receivable').length}
          </button>
        </div>
      </div>

      {/* Compact Transaction List */}
      <div className="px-4 py-3">
        {filteredTransactions.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center">
            <p className="text-sm text-gray-500">Tidak ada data</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredTransactions.map((transaction) => {
              const Icon = transaction.icon;
              const daysUntil = getDaysUntil(transaction.dueDate);
              const isOverdue = daysUntil < 0;
              const isPayable = transaction.type === 'payable';
              
              return (
                <div
                  key={transaction.id}
                  className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    {/* Compact Icon */}
                    <div className={`p-2 rounded-lg shrink-0 ${
                      isPayable ? 'bg-red-50' : 'bg-green-50'
                    }`}>
                      <Icon className={`w-4 h-4 ${
                        isPayable ? 'text-red-600' : 'text-green-600'
                      }`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-900 truncate">{transaction.name}</h4>
                          <p className="text-xs text-gray-500 truncate">{transaction.description}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className={`text-sm font-semibold ${
                            isPayable ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {formatCurrency(transaction.amount)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                            {formatDate(transaction.dueDate)}
                          </span>
                          {isOverdue && (
                            <span className="px-1.5 py-0.5 bg-red-100 text-red-600 rounded text-[10px] font-medium">
                              Lewat
                            </span>
                          )}
                        </div>

                        <Button
                          onClick={() => handlePayClick(transaction)}
                          size="sm"
                          className={`h-7 px-2.5 rounded-lg text-xs ${
                            isPayable
                              ? 'bg-red-600 hover:bg-red-700 text-white'
                              : 'bg-green-600 hover:bg-green-700 text-white'
                          }`}
                        >
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
        <DialogContent className="sm:max-w-[400px] p-0 gap-0 overflow-hidden">
          {/* Header */}
          <div className={`p-4 ${
            selectedTransaction?.type === 'payable' 
              ? 'bg-gradient-to-br from-red-500 to-red-600' 
              : 'bg-gradient-to-br from-green-500 to-green-600'
          }`}>
            <DialogTitle className="text-white flex items-center gap-2 mb-1">
              {selectedTransaction?.type === 'payable' ? (
                <>
                  <Wallet className="w-5 h-5" />
                  Bayar Utang
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Terima Pembayaran
                </>
              )}
            </DialogTitle>
            <DialogDescription className="text-white/80 text-sm">
              {selectedTransaction?.name}
            </DialogDescription>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            {/* Total */}
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-600 mb-0.5">Total Tagihan</p>
              <p className="text-xl font-semibold text-gray-900">
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0,
                }).format(selectedTransaction?.amount || 0)}
              </p>
            </div>

            {/* Payment Input */}
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1.5 block">
                Jumlah Bayar
              </label>
              <Input
                type="number"
                placeholder="0"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="h-10 text-base"
              />
            </div>

            {/* Partial Info */}
            {parseFloat(paymentAmount) > 0 && parseFloat(paymentAmount) < (selectedTransaction?.amount || 0) && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5">
                <p className="text-xs text-blue-900 font-medium mb-0.5">Pembayaran Sebagian</p>
                <p className="text-xs text-blue-800">
                  Sisa: {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                  }).format((selectedTransaction?.amount || 0) - parseFloat(paymentAmount))}
                </p>
              </div>
            )}

            {/* Note */}
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1.5 block">
                Catatan (Opsional)
              </label>
              <Textarea
                placeholder="Tambahkan catatan..."
                value={paymentNote}
                onChange={(e) => setPaymentNote(e.target.value)}
                className="h-20 text-sm resize-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 p-4 pt-0">
            <Button
              variant="outline"
              className="flex-1 h-10"
              onClick={() => setShowPayModal(false)}
            >
              Batal
            </Button>
            <Button
              className={`flex-1 h-10 ${
                selectedTransaction?.type === 'payable'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-green-600 hover:bg-green-700'
              } text-white`}
              onClick={handlePaymentSubmit}
              disabled={!paymentAmount || parseFloat(paymentAmount) <= 0}
            >
              Konfirmasi
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-[400px] p-0 gap-0 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4">
            <DialogTitle className="text-white mb-1">Tambah Transaksi</DialogTitle>
            <DialogDescription className="text-white/80 text-sm">
              Catat utang atau piutang baru
            </DialogDescription>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
            {/* Type Selector */}
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1.5 block">Tipe</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setAddType('payable')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    addType === 'payable'
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200'
                  }`}
                >
                  <TrendingDown className={`w-5 h-5 mx-auto mb-1 ${
                    addType === 'payable' ? 'text-red-600' : 'text-gray-400'
                  }`} />
                  <p className={`text-xs font-medium ${
                    addType === 'payable' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    Utang
                  </p>
                </button>
                <button
                  onClick={() => setAddType('receivable')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    addType === 'receivable'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200'
                  }`}
                >
                  <TrendingUp className={`w-5 h-5 mx-auto mb-1 ${
                    addType === 'receivable' ? 'text-green-600' : 'text-gray-400'
                  }`} />
                  <p className={`text-xs font-medium ${
                    addType === 'receivable' ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    Piutang
                  </p>
                </button>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1.5 block">Kategori</label>
              <Select value={newCategory} onValueChange={setNewCategory}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {addType === 'payable' ? (
                    <>
                      <SelectItem value="Pinjaman Bank">Pinjaman Bank</SelectItem>
                      <SelectItem value="Kredit Supplier">Kredit Supplier</SelectItem>
                      <SelectItem value="Kredit Usaha">Kredit Usaha</SelectItem>
                      <SelectItem value="Lainnya">Lainnya</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="Penjualan Kredit">Penjualan Kredit</SelectItem>
                      <SelectItem value="Piutang Usaha">Piutang Usaha</SelectItem>
                      <SelectItem value="Invoice">Invoice</SelectItem>
                      <SelectItem value="Lainnya">Lainnya</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Name */}
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1.5 block">
                {addType === 'payable' ? 'Nama Kreditor' : 'Nama Debitor'}
              </label>
              <Input
                placeholder={addType === 'payable' ? 'Contoh: Bank Mandiri' : 'Contoh: PT ABC'}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="h-10"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1.5 block">Deskripsi</label>
              <Input
                placeholder="Keterangan singkat"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="h-10"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1.5 block">Jumlah</label>
              <Input
                type="number"
                placeholder="0"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                className="h-10"
              />
            </div>

            {/* Due Date */}
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1.5 block">Jatuh Tempo</label>
              <Input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="h-10"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 p-4 pt-0 border-t">
            <Button
              variant="outline"
              className="flex-1 h-10"
              onClick={() => setShowAddModal(false)}
            >
              Batal
            </Button>
            <Button
              className="flex-1 h-10 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleAddSubmit}
              disabled={!newName || !newAmount || !newDueDate}
            >
              Simpan
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}