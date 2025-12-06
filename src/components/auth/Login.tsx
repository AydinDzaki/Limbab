import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';

interface LoginProps {
  onNavigateToRegister: () => void;
  onNavigateToForgotPassword: () => void;
  onLoginSuccess?: (userName: string) => void;
}

export function Login({ onNavigateToRegister, onNavigateToForgotPassword, onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Email dan password wajib diisi');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await login(email, password);
      
      if (result.success) {
        toast.success('Berhasil masuk!');
      } else {
        toast.error('Email atau password salah');
        console.error(result.error);
      }
    } catch (error) {
      toast.error('Terjadi kesalahan koneksi');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-3xl mb-4 shadow-lg">
            <span className="text-4xl">💼</span>
          </div>
          <h1 className="text-blue-900 mb-2">FinanceBook</h1>
          <p className="text-gray-600">Kelola keuangan UMKM Anda</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="mb-6">
            <h2 className="text-gray-900 mb-1">Masuk ke Akun</h2>
            <p className="text-gray-600">Silakan masuk untuk melanjutkan</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <Label htmlFor="email" className="text-gray-700 mb-2 block">Email</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-12 border-2 border-gray-200 rounded-xl"
                  placeholder="email@contoh.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-700 mb-2 block">Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 pr-12 h-12 border-2 border-gray-200 rounded-xl"
                  placeholder="Password Anda"
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

            <div className="flex justify-end">
              <button type="button" onClick={onNavigateToForgotPassword} className="text-blue-600 hover:text-blue-700">
                Lupa Password?
              </button>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md disabled:opacity-50"
            >
              {isLoading ? 'Masuk...' : 'Masuk'}
            </Button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-gray-400">atau</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <div className="text-center">
            <p className="text-gray-600">
              Belum punya akun?{' '}
              <button onClick={onNavigateToRegister} className="text-blue-600 hover:text-blue-700">
                Daftar Sekarang
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}