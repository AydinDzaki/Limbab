import { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner@2.0.3';

interface ForgotPasswordProps {
  onNavigateToLogin: () => void;
}

export function ForgotPassword({ onNavigateToLogin }: ForgotPasswordProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error('Email wajib diisi');
      return;
    }

    if (!email.includes('@')) {
      toast.error('Format email tidak valid');
      return;
    }

    setIsLoading(true);

    // Simulasi reset password
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      toast.success('Link reset password telah dikirim ke email Anda');
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Success Card */}
          <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            
            <h2 className="text-gray-900 mb-3">Email Terkirim!</h2>
            <p className="text-gray-600 mb-6">
              Kami telah mengirimkan link reset password ke email <strong>{email}</strong>. 
              Silakan periksa inbox atau folder spam Anda.
            </p>

            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-blue-900">
                💡 <strong>Tips:</strong> Link akan kadaluarsa dalam 1 jam. Jika tidak menerima email, 
                periksa folder spam atau coba kirim ulang.
              </p>
            </div>

            <Button
              onClick={onNavigateToLogin}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition-all hover:shadow-lg"
            >
              Kembali ke Login
            </Button>

            <button
              onClick={() => setIsSuccess(false)}
              className="w-full mt-3 text-blue-600 hover:text-blue-700 transition-colors"
            >
              Kirim Ulang Email
            </button>
          </div>

          {/* Footer */}
          <p className="text-center text-gray-500 mt-6">
            © 2024 FinanceBook. Solusi Keuangan UMKM
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={onNavigateToLogin}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali ke Login</span>
        </button>

        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-3xl mb-4 shadow-lg">
            <span className="text-4xl">🔐</span>
          </div>
          <h1 className="text-blue-900 mb-2">Lupa Password?</h1>
          <p className="text-gray-600">Jangan khawatir, kami akan mengirimkan instruksi reset password</p>
        </div>

        {/* Reset Password Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <form onSubmit={handleResetPassword} className="space-y-5">
            {/* Email Input */}
            <div>
              <Label htmlFor="email" className="text-gray-700 mb-2 block">
                Email Terdaftar
              </Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Masukkan email yang terdaftar pada akun FinanceBook Anda
              </p>
            </div>

            {/* Info Box */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-sm text-amber-900">
                <strong>Catatan:</strong> Kami akan mengirimkan link reset password ke email Anda. 
                Pastikan email yang dimasukkan benar dan aktif.
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Mengirim...' : 'Kirim Link Reset Password'}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-gray-400">atau</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-gray-600">
              Ingat password Anda?{' '}
              <button
                onClick={onNavigateToLogin}
                className="text-blue-600 hover:text-blue-700 transition-colors"
              >
                Masuk di sini
              </button>
            </p>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6 bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-gray-900 mb-3">Butuh Bantuan?</h3>
          <p className="text-sm text-gray-600 mb-3">
            Jika Anda mengalami kesulitan, hubungi tim support kami:
          </p>
          <div className="space-y-2 text-sm">
            <p className="text-gray-600">
              📧 Email: <a href="mailto:support@financebook.com" className="text-blue-600 hover:text-blue-700">support@financebook.com</a>
            </p>
            <p className="text-gray-600">
              📱 WhatsApp: <a href="https://wa.me/628123456789" className="text-blue-600 hover:text-blue-700">+62 812-3456-7890</a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 mt-6">
          © 2024 FinanceBook. Solusi Keuangan UMKM
        </p>
      </div>
    </div>
  );
}
