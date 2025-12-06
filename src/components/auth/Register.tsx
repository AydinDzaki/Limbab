import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User, Building2, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner'; // Pastikan import dari 'sonner' bukan 'sonner@2.0.3'
import { useAuth } from '../../contexts/AuthContext';

interface RegisterProps {
  onNavigateToLogin: () => void;
  onRegisterSuccess?: (userName: string) => void;
}

export function Register({ onNavigateToLogin, onRegisterSuccess }: RegisterProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  const { register } = useAuth();

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi
    if (!formData.fullName || !formData.businessName || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error('Semua field wajib diisi');
      return;
    }

    if (!formData.email.includes('@')) {
      toast.error('Format email tidak valid');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password minimal 6 karakter');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Password tidak cocok');
      return;
    }

    if (!acceptTerms) {
      toast.error('Anda harus menyetujui syarat dan ketentuan');
      return;
    }

    setIsLoading(true);

    try {
      // Panggil fungsi register asli (Supabase)
      const result = await register({
        fullName: formData.fullName,
        businessName: formData.businessName,
        email: formData.email,
        password: formData.password,
      });

      if (result.success) {
        toast.success('Akun berhasil dibuat!');
        onRegisterSuccess?.(formData.fullName);
      } else {
        // Tampilkan pesan error spesifik dari Supabase (misal: Email sudah dipakai)
        toast.error(result.error || 'Gagal mendaftar');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan jaringan');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <button
          onClick={onNavigateToLogin}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali ke Login</span>
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-3xl mb-4 shadow-lg">
            <span className="text-4xl">💼</span>
          </div>
          <h1 className="text-blue-900 mb-2">Daftar Akun Baru</h1>
          <p className="text-gray-600">Mulai kelola keuangan UMKM Anda</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <Label htmlFor="fullName" className="text-gray-700 mb-2 block">Nama Lengkap *</Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  className="pl-12 h-12 border-2 border-gray-200 rounded-xl"
                  placeholder="Nama Lengkap Anda"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="businessName" className="text-gray-700 mb-2 block">Nama Usaha *</Label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) => handleChange('businessName', e.target.value)}
                  className="pl-12 h-12 border-2 border-gray-200 rounded-xl"
                  placeholder="Nama Bisnis Anda"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-gray-700 mb-2 block">Email *</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="pl-12 h-12 border-2 border-gray-200 rounded-xl"
                  placeholder="email@contoh.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-700 mb-2 block">Password *</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className="pl-12 pr-12 h-12 border-2 border-gray-200 rounded-xl"
                  placeholder="Minimal 6 karakter"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-gray-700 mb-2 block">Konfirmasi Password *</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  className="pl-12 pr-12 h-12 border-2 border-gray-200 rounded-xl"
                  placeholder="Ulangi password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1 w-4 h-4 text-blue-600 rounded"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                Saya menyetujui <a href="#" className="text-blue-600">syarat dan ketentuan</a>
              </label>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md disabled:opacity-50"
            >
              {isLoading ? 'Mendaftarkan...' : 'Daftar Sekarang'}
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              Sudah punya akun?{' '}
              <button onClick={onNavigateToLogin} className="text-blue-600 hover:text-blue-700">Masuk di sini</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}