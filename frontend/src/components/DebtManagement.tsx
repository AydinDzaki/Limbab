import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Plus, User, Calendar, DollarSign, CheckCircle, AlertTriangle, Clock } from "lucide-react";

interface DebtManagementProps {
  onNavigate: (page: string) => void;
}

interface DebtEntry {
  id: number;
  type: 'utang' | 'piutang';
  customerSupplierName: string;
  amount: number;
  dueDate: string;
  description: string;
  status: 'belum_lunas' | 'lunas';
  createdDate: string;
}

export function DebtManagement({ onNavigate }: DebtManagementProps) {
  const [activeTab, setActiveTab] = useState("utang");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [currentType, setCurrentType] = useState<'utang' | 'piutang'>('utang');
  const [entries, setEntries] = useState<DebtEntry[]>([]); // Data dari Backend
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    customerSupplierName: "",
    amount: "",
    dueDate: "",
    description: ""
  });

  // --- AMBIL DATA DARI BACKEND ---
  const fetchDebts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/debts');
      const data = await res.json();
      setEntries(data);
    } catch (error) {
      console.error("Gagal ambil data utang:", error);
    }
  };

  useEffect(() => {
    fetchDebts();
  }, []);

  // --- FORMAT CURRENCY ---
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      customerSupplierName: "",
      amount: "",
      dueDate: "",
      description: ""
    });
  };

  // --- SIMPAN DATA BARU KE BACKEND ---
  const handleAddEntry = async () => {
    if (!formData.customerSupplierName || !formData.amount || !formData.dueDate) {
      alert('Mohon lengkapi semua field yang wajib diisi');
      return;
    }

    setIsLoading(true);
    const rawAmount = parseInt(formData.amount.replace(/\D/g, ''));

    const payload = {
      type: currentType,
      customerSupplierName: formData.customerSupplierName,
      amount: rawAmount,
      dueDate: formData.dueDate,
      description: formData.description,
    };

    try {
      const response = await fetch('http://localhost:5000/api/debts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.success) {
        // Refresh data setelah berhasil simpan
        fetchDebts(); 
        resetForm();
        setShowAddDialog(false);
      }
    } catch (error) {
      alert("Gagal menyimpan data");
    } finally {
      setIsLoading(false);
    }
  };

  // --- TANDAI LUNAS (PATCH) ---
  const handleMarkPaid = async (id: number) => {
    if(!confirm("Yakin ingin menandai ini sebagai Lunas?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/debts/${id}/pay`, {
        method: 'PATCH'
      });
      
      const result = await response.json();
      if (result.success) {
        // Update tampilan lokal biar cepat (Optimistic UI) atau fetch ulang
        setEntries(entries.map(entry => 
          entry.id === id ? { ...entry, status: 'lunas' } : entry
        ));
      }
    } catch (error) {
      alert("Gagal update status");
    }
  };

  const handleOpenAddDialog = (type: 'utang' | 'piutang') => {
    setCurrentType(type);
    resetForm();
    setShowAddDialog(true);
  };

  const utangEntries = entries.filter(entry => entry.type === 'utang');
  const piutangEntries = entries.filter(entry => entry.type === 'piutang');

  const renderEntryList = (entryList: DebtEntry[]) => (
    <div className="space-y-3">
      {entryList.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
            <DollarSign className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-sm">Belum ada data {activeTab}</p>
          <p className="text-xs text-muted-foreground">Tambah data {activeTab} pertama Anda</p>
        </div>
      ) : (
        entryList.map((entry) => (
          <Card key={entry.id} className={entry.status === 'lunas' ? 'opacity-60' : ''}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <h4 className="text-sm font-medium">{entry.customerSupplierName}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{entry.description}</p>
                  
                  <div className="flex items-center gap-4 mb-2">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm font-medium">{formatCurrency(entry.amount)}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className={`text-sm ${
                        isOverdue(entry.dueDate) && entry.status === 'belum_lunas' 
                          ? 'text-red-600 font-medium' 
                          : 'text-muted-foreground'
                      }`}>
                        {formatDate(entry.dueDate)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={entry.status === 'lunas' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {entry.status === 'lunas' ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Lunas
                        </>
                      ) : (
                        <>
                          <Clock className="h-3 w-3 mr-1" />
                          Belum Lunas
                        </>
                      )}
                    </Badge>
                    
                    {isOverdue(entry.dueDate) && entry.status === 'belum_lunas' && (
                      <Badge variant="destructive" className="text-xs">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Jatuh Tempo
                      </Badge>
                    )}
                  </div>
                </div>

                {entry.status === 'belum_lunas' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleMarkPaid(entry.id)}
                    className="text-xs"
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Tandai Lunas
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );

  return (
    <div className="flex-1 p-4 space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-xl">Utang Piutang</h1>
        <p className="text-sm text-muted-foreground">Kelola catatan utang dan piutang bisnis Anda</p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="utang">Utang</TabsTrigger>
          <TabsTrigger value="piutang">Piutang</TabsTrigger>
        </TabsList>

        {/* Utang Tab */}
        <TabsContent value="utang" className="mt-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg">Daftar Utang</h3>
            <Button 
              onClick={() => handleOpenAddDialog('utang')}
              className="bg-red-600 hover:bg-red-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah Utang
            </Button>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {renderEntryList(utangEntries)}
          </div>
        </TabsContent>

        {/* Piutang Tab */}
        <TabsContent value="piutang" className="mt-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg">Daftar Piutang</h3>
            <Button 
              onClick={() => handleOpenAddDialog('piutang')}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah Piutang
            </Button>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {renderEntryList(piutangEntries)}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Entry Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Tambah {currentType === 'utang' ? 'Utang' : 'Piutang'} Baru
            </DialogTitle>
            <DialogDescription>
              Lengkapi formulir di bawah.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customerSupplierName">
                Nama {currentType === 'utang' ? 'Pemasok' : 'Pelanggan'} *
              </Label>
              <Input
                id="customerSupplierName"
                placeholder={`Contoh: ${currentType === 'utang' ? 'PT Supplier Jaya' : 'Toko Abadi'}`}
                value={formData.customerSupplierName}
                onChange={(e) => handleInputChange("customerSupplierName", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Jumlah Uang *</Label>
              <Input
                id="amount"
                placeholder="0"
                value={formData.amount ? formatCurrency(parseInt(formData.amount.replace(/\D/g, '')) || 0) : ''}
                onChange={(e) => handleInputChange("amount", e.target.value.replace(/\D/g, ''))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Tanggal Jatuh Tempo *</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange("dueDate", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                placeholder="Keterangan tambahan..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowAddDialog(false)}
              >
                Batal
              </Button>
              <Button 
                onClick={handleAddEntry}
                disabled={isLoading}
                className={`flex-1 ${
                  currentType === 'utang' 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isLoading ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}