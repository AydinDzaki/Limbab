import express, { Request, Response } from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

// --- 1. KONFIGURASI SERVER ---
const app = express();
const PORT = 5000;
const DB_FILE = path.join(__dirname, '../db.json');

// Middleware
app.use(cors()); 
app.use(express.json()); 

// --- 2. HELPER DATABASE --

// Fungsi untuk MEMBACA data dari file db.json
const readDB = () => {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data); 
  } catch (err) {
    return { users: [], transactions: [], debtEntries: [], financialSummary: {} };
  }
};

// Fungsi untuk MENULIS data ke file db.json
const writeDB = (data: any) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// --- 3. HELPER TANGGAL ---
const getTodayDate = () => {
  const d = new Date();
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

const parseDate = (dateStr: string) => new Date(dateStr);


// ==========================================
//                ROUTES API
// ==========================================

// --- A. LOGIN & REGISTER ---

app.post('/api/login', (req: Request, res: Response): any => {
  const { email, password } = req.body;
  const db = readDB();
  
  // Cari user yang email dan passwordnya cocok
  const user = db.users.find((u: any) => u.email === email && u.password === password);
  
  if (user) {
    // Jika ketemu, kirim data user (tanpa password)
    return res.json({ 
      success: true, 
      message: "Login Berhasil", 
      token: "mock-token", // Token pura-pura
      user: { name: user.name, role: user.role } 
    });
  } else {
    return res.status(401).json({ success: false, message: "Email atau Password Salah" });
  }
});

app.post('/api/register', (req: Request, res: Response): any => {
  const db = readDB();
  const { userName, email, password } = req.body;

  // Validasi data sederhana
  if (!userName || !email || !password) {
    return res.status(400).json({ success: false, message: "Data tidak lengkap" });
  }

  // Cek apakah email sudah dipakai
  if (db.users.find((u: any) => u.email === email)) {
    return res.status(400).json({ success: false, message: "Email sudah terdaftar" });
  }

  // Buat user baru
  const newUser = {
    id: Date.now().toString(),
    name: userName,
    email,
    password,
    role: "Kasir" // Default role
  };

  db.users.push(newUser);
  writeDB(db); // Simpan permanen ke file

  res.json({ success: true, message: "Registrasi Berhasil! Silakan Login." });
});


// --- B. DASHBOARD ---

app.get('/api/dashboard', (req: Request, res: Response) => {
  const db = readDB();
  const transactions = db.transactions;
  const now = new Date();
  
  // 1. Hitung Total Saldo 
  const initialBalance = 20000000; 
  const totalIncomeAllTime = transactions.filter((t: any) => t.type === 'income' || t.type === 'receivable').reduce((a:any, b:any) => a + b.amount, 0);
  const totalExpenseAllTime = transactions.filter((t: any) => t.type === 'expense' || t.type === 'debt').reduce((a:any, b:any) => a + b.amount, 0);
  const currentTotalBalance = initialBalance + totalIncomeAllTime - totalExpenseAllTime;

  // 2. Persiapan Filter Bulan Ini vs Bulan Lalu
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1; // Handle Januari ke Desember
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  // Filter Transaksi
  const thisMonthTx = transactions.filter((t: any) => {
    const d = parseDate(t.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const lastMonthTx = transactions.filter((t: any) => {
    const d = parseDate(t.date);
    return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
  });

  // 3. Hitung Total Nominal (Bulan Ini)
  const incomeThisMonth = thisMonthTx.filter((t: any) => t.type === 'income').reduce((a:any, b:any) => a + b.amount, 0);
  const expenseThisMonth = thisMonthTx.filter((t: any) => t.type === 'expense').reduce((a:any, b:any) => a + b.amount, 0);
  const netProfitThisMonth = incomeThisMonth - expenseThisMonth;

  // 4. Hitung Total Nominal (Bulan Lalu) - untuk perbandingan
  const incomeLastMonth = lastMonthTx.filter((t: any) => t.type === 'income').reduce((a:any, b:any) => a + b.amount, 0);
  const expenseLastMonth = lastMonthTx.filter((t: any) => t.type === 'expense').reduce((a:any, b:any) => a + b.amount, 0);
  const netProfitLastMonth = incomeLastMonth - expenseLastMonth;

  // Fungsi hitung % pertumbuhan
  const calcGrowth = (current: number, last: number) => {
    if (last === 0) return current > 0 ? 100 : 0;
    return ((current - last) / last) * 100;
  };

  // 5. Logika Grafik 7 Hari Terakhir (CURRENTLY BROKEN)
  const chartData: any[] = []; 
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    
    const dateStr = `${d.getDate()} ${months[d.getMonth()]}`; 
    
    const dailyTx = transactions.filter((t: any) => t.date.includes(dateStr));
    
    chartData.push({
      name: dateStr,
      pemasukan: dailyTx.filter((t: any) => t.type === 'income' || t.type === 'receivable').reduce((a:any, b:any) => a + b.amount, 0),
      pengeluaran: dailyTx.filter((t: any) => t.type === 'expense' || t.type === 'debt').reduce((a:any, b:any) => a + b.amount, 0),
    });
  }

  // Kirim Response Lengkap ke Frontend
  res.json({
    totalBalance: currentTotalBalance,
    accountNumber: db.financialSummary.accountNumber,
    incomeThisMonth,
    expenseThisMonth,
    netProfitThisMonth,
    incomeGrowth: calcGrowth(incomeThisMonth, incomeLastMonth).toFixed(1),
    expenseGrowth: calcGrowth(expenseThisMonth, expenseLastMonth).toFixed(1),
    netProfitGrowth: calcGrowth(netProfitThisMonth, netProfitLastMonth).toFixed(1),
    chartData,
    recentActivity: transactions.slice(0, 5) // Ambil 5 transaksi paling atas (terbaru)
  });
});


// --- C. TRANSAKSI ---

app.get('/api/transactions', (req, res) => {
  const db = readDB();
  res.json(db.transactions);
});

app.post('/api/transactions', (req, res) => {
  const db = readDB();
  const { type, amount, description, category, date } = req.body;
  
  const newTx = {
    id: Date.now(),
    type,
    amount: Number(amount),
    description,
    category,
    date: date || getTodayDate(), // Pakai tanggal hari ini jika kosong
    contact: "Umum",
    hasReceipt: false
  };

  db.transactions.unshift(newTx); // Masukkan ke urutan pertama (paling atas)
  writeDB(db); // Simpan
  res.json({ success: true, data: newTx });
});


// --- D. UTANG PIUTANG ---

app.get('/api/debts', (req, res) => {
  const db = readDB();
  res.json(db.debtEntries);
});

app.post('/api/debts', (req, res) => {
  const db = readDB();
  const newDebt = req.body;
  
  // Lengkapi data utang
  newDebt.id = Date.now();
  newDebt.status = 'belum_lunas';
  newDebt.createdDate = new Date().toISOString().split('T')[0];

  // 1. Simpan ke List Utang
  db.debtEntries.unshift(newDebt);

  // 2. Catat juga di Riwayat Transaksi
  const newTx = {
    id: Date.now() + 1, // ID beda dikit biar gak bentrok
    type: newDebt.type === 'utang' ? 'debt' : 'receivable',
    amount: newDebt.amount,
    description: `[Catatan] ${newDebt.description || 'Utang Baru'}`,
    category: newDebt.type === 'utang' ? 'Utang Usaha' : 'Piutang Usaha',
    date: getTodayDate(),
    contact: newDebt.customerSupplierName
  };
  db.transactions.unshift(newTx);

  writeDB(db);
  res.json({ success: true, data: newDebt });
});

// Endpoint Pelunasan Utang
app.patch('/api/debts/:id/pay', (req, res) => {
  const db = readDB();
  const { id } = req.params;
  const debtIndex = db.debtEntries.findIndex((d: any) => d.id === Number(id));

  if (debtIndex !== -1) {
    const debt = db.debtEntries[debtIndex];
    
    // 1. Update status jadi Lunas
    db.debtEntries[debtIndex].status = 'lunas';

    // 2. Catat Transaksi Pelunasan (Uang Beneran Keluar/Masuk)
    const transactionType = debt.type === 'utang' ? 'expense' : 'income';
    const newTx = {
      id: Date.now(),
      type: transactionType,
      amount: debt.amount,
      description: `Pelunasan: ${debt.customerSupplierName}`,
      category: 'Pelunasan Utang',
      date: getTodayDate(),
      contact: debt.customerSupplierName,
      hasReceipt: true
    };
    db.transactions.unshift(newTx);

    writeDB(db);
    res.json({ success: true, message: "Lunas & Tercatat" });
  } else {
    res.status(404).json({ success: false, message: "Data tidak ditemukan" });
  }
});


// --- E. MANAJEMEN MEMBER ---

app.get('/api/members', (req, res) => {
  const db = readDB();
  // Kembalikan data user TANPA password agar aman
  const members = db.users.map((u: any) => ({ id: u.id, name: u.name, email: u.email, role: u.role }));
  res.json(members);
});

app.post('/api/members', (req, res): any => {
  const db = readDB();
  const { email, role } = req.body;
  
  if (db.users.find((u: any) => u.email === email)) {
    return res.status(400).json({ success: false, message: "Email sudah terdaftar" });
  }

  const newUser = {
    id: Date.now().toString(),
    name: email.split('@')[0], // Ambil nama dari depan email
    email,
    password: "123", // Password default untuk member baru
    role
  };
  
  db.users.push(newUser);
  writeDB(db);
  res.json({ success: true, data: newUser });
});

app.delete('/api/members/:id', (req, res) => {
  const db = readDB();
  const { id } = req.params;
  const index = db.users.findIndex((u: any) => u.id === id);

  if (index !== -1) {
    db.users.splice(index, 1); 
    writeDB(db);
    res.json({ success: true });
  } else {
    res.status(404).json({ success: false });
  }
});


// --- MENJALANKAN SERVER ---
app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
});