import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ArrowUpRight, ArrowDownLeft, Upload, Camera, Zap, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface TransactionEntryProps {
  onNavigate: (page: string) => void;
}

export function TransactionEntry({ onNavigate }: TransactionEntryProps) {
  const [activeTab, setActiveTab] = useState("income");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [transactionDate, setTransactionDate] = useState<Date>(new Date());
  
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    category: ""
  });

  const incomeCategories = ["Penjualan Produk", "Penjualan Jasa", "Pembayaran Piutang", "Lainnya"];
  const expenseCategories = ["Pembelian Bahan", "Operasional", "Gaji", "Sewa", "Marketing", "Lainnya"];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setUploadedFile(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('dashboard');
  };

  const formatCurrency = (value: string) => {
    const number = value.replace(/\D/g, '');
    return new Intl.NumberFormat('id-ID').format(parseInt(number) || 0);
  };

  return (
    <div className="flex-1 p-4 space-y-4">
      {/* Compact Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
          <Zap className="h-4 w-4 text-white" />
        </div>
        <div>
          <h1 className="text-lg">Transaksi</h1>
          <p className="text-xs text-muted-foreground">Catat keuangan harian</p>
        </div>
      </div>

      {/* Compact Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 h-9">
          <TabsTrigger value="income" className="text-xs data-[state=active]:bg-green-500 data-[state=active]:text-white">
            <ArrowDownLeft className="h-3 w-3 mr-1" />
            Masuk
          </TabsTrigger>
          <TabsTrigger value="expense" className="text-xs data-[state=active]:bg-red-500 data-[state=active]:text-white">
            <ArrowUpRight className="h-3 w-3 mr-1" />
            Keluar
          </TabsTrigger>
        </TabsList>

        {/* Income Form */}
        <TabsContent value="income" className="mt-3">
          <Card className="border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-green-600 flex items-center gap-2">
                <ArrowDownLeft className="h-4 w-4" />
                Transaksi Masuk
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Jumlah (Rp)</Label>
                    <Input
                      placeholder="0"
                      value={formatCurrency(formData.amount)}
                      onChange={(e) => handleInputChange("amount", e.target.value.replace(/\D/g, ''))}
                      className="h-10 text-sm"
                      required
                    />
                    <div className="text-xs text-muted-foreground">Terlihat sebagai: Rp {formatCurrency(formData.amount)}</div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Kategori</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Pilih" />
                      </SelectTrigger>
                      <SelectContent>
                        {incomeCategories.map((cat) => (
                          <SelectItem key={cat} value={cat} className="text-sm">{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Deskripsi</Label>
                  <Input
                    placeholder="Penjualan produk ke customer"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="h-8 text-sm"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Tanggal Transaksi</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="h-8 justify-start text-left text-sm w-full"
                      >
                        <CalendarIcon className="mr-2 h-3 w-3" />
                        {format(transactionDate, "dd MMM yyyy", { locale: id })}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={transactionDate}
                        onSelect={(date) => date && setTransactionDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Compact File Upload */}
                <div className="space-y-1">
                  <Label className="text-xs">📸 Bukti</Label>
                  <div className="border-2 border-dashed border-green-200 bg-green-50 rounded-lg p-3">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <div className="text-center">
                        <Camera className="h-4 w-4 text-green-600 mx-auto mb-1" />
                        <p className="text-xs text-green-700">
                          {uploadedFile ? uploadedFile.name : "Upload bukti"}
                        </p>
                      </div>
                    </label>
                  </div>
                  {uploadedFile && (
                    <Badge variant="default" className="text-xs bg-green-500">
                      ✅ {uploadedFile.name}
                    </Badge>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button type="button" variant="outline" className="flex-1 h-10 text-sm" onClick={() => onNavigate('dashboard')}>
                    Batal
                  </Button>
                  <Button type="submit" className="flex-1 h-10 text-sm bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-700 hover:to-green-600">
                    Simpan
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Similar compact forms for expense and debt tabs */}
        <TabsContent value="expense" className="mt-3">
          <Card className="border-red-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-red-600 flex items-center gap-2">
                <ArrowUpRight className="h-4 w-4" />
                Transaksi Keluar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Jumlah (Rp)</Label>
                    <Input
                      placeholder="0"
                      value={formatCurrency(formData.amount)}
                      onChange={(e) => handleInputChange("amount", e.target.value.replace(/\D/g, ''))}
                      className="h-8 text-sm"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Kategori</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Pilih" />
                      </SelectTrigger>
                      <SelectContent>
                        {expenseCategories.map((cat) => (
                          <SelectItem key={cat} value={cat} className="text-sm">{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Deskripsi</Label>
                  <Input
                    placeholder="Pembelian bahan baku"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="h-8 text-sm"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Tanggal Transaksi</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="h-8 justify-start text-left text-sm w-full"
                      >
                        <CalendarIcon className="mr-2 h-3 w-3" />
                        {format(transactionDate, "dd MMM yyyy", { locale: id })}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={transactionDate}
                        onSelect={(date) => date && setTransactionDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Compact File Upload */}
                <div className="space-y-1">
                  <Label className="text-xs">📸 Bukti</Label>
                  <div className="border-2 border-dashed border-red-200 bg-red-50 rounded-lg p-3">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload-expense"
                    />
                    <label htmlFor="file-upload-expense" className="cursor-pointer">
                      <div className="text-center">
                        <Camera className="h-4 w-4 text-red-600 mx-auto mb-1" />
                        <p className="text-xs text-red-700">
                          {uploadedFile ? uploadedFile.name : "Upload bukti"}
                        </p>
                      </div>
                    </label>
                  </div>
                  {uploadedFile && (
                    <Badge variant="default" className="text-xs bg-red-500">
                      ✅ {uploadedFile.name}
                    </Badge>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button type="button" variant="outline" className="flex-1 h-8 text-xs" onClick={() => onNavigate('dashboard')}>
                    Batal
                  </Button>
                  <Button type="submit" className="flex-1 h-8 text-xs bg-red-600 hover:bg-red-700">
                    Simpan
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
