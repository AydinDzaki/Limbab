import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ArrowLeft, Calculator, Mail, CheckCircle } from "lucide-react";

interface ForgotPasswordProps {
  onBackToLogin: () => void;
}

export function ForgotPassword({ onBackToLogin }: ForgotPasswordProps) {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    setIsSubmitted(true);
  };

  const handleResetForm = () => {
    setIsSubmitted(false);
    setEmail("");
  };

  if (isSubmitted) {
    return (
      <div className="flex-1 flex flex-col justify-center px-4 py-6">
        {/* Success State */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-3">
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h1 className="text-xl mb-2">Email Terkirim!</h1>
          <p className="text-sm text-muted-foreground mb-4">
            Instruksi reset password telah dikirim ke email Anda.
          </p>
        </div>

        <Card className="mx-auto w-full max-w-sm">
          <CardContent className="pt-6">
            <div className="space-y-4 text-center">
              <div className="p-4 bg-muted/50 rounded-lg">
                <Mail className="h-5 w-5 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-1">
                  Email dikirim ke:
                </p>
                <p className="text-sm font-medium">{email}</p>
              </div>
              
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Periksa folder inbox dan spam</p>
                <p>• Link berlaku selama 24 jam</p>
                <p>• Jika tidak menerima email, coba kirim ulang</p>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <Button 
                  onClick={handleResetForm}
                  variant="outline" 
                  className="w-full"
                  size="sm"
                >
                  Kirim Ulang
                </Button>
                <Button 
                  onClick={onBackToLogin}
                  className="w-full"
                  size="sm"
                >
                  Kembali ke Login
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-center px-4 py-6">
      {/* Header with back button */}
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBackToLogin}
          className="mr-2 h-8 w-8 p-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-lg">Lupa Password</h1>
      </div>

      {/* App Logo */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-3">
          <div className="p-2 bg-primary rounded-xl">
            <Calculator className="h-6 w-6 text-primary-foreground" />
          </div>
        </div>
        <h2 className="text-xl mb-1">FinanceBook</h2>
        <p className="text-sm text-muted-foreground">
          Reset password akun Anda
        </p>
      </div>

      {/* Forgot Password Form */}
      <Card className="mx-auto w-full max-w-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-center text-lg">Reset Password</CardTitle>
          <p className="text-center text-sm text-muted-foreground">
            Masukkan email untuk menerima instruksi reset password
          </p>
        </CardHeader>
        
        <CardContent className="pt-0">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10"
                required
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Gunakan email yang terdaftar di akun FinanceBook Anda
              </p>
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-10" 
              disabled={isLoading || !email.trim()}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Mengirim...
                </div>
              ) : (
                "Kirim Instruksi Reset Password"
              )}
            </Button>
          </form>
          
          <div className="text-center mt-4">
            <Button 
              variant="link" 
              className="text-sm h-6"
              onClick={onBackToLogin}
            >
              Kembali ke Login
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Help text */}
      <div className="mt-6 text-center">
        <p className="text-xs text-muted-foreground">
          Butuh bantuan? Hubungi support kami
        </p>
      </div>
    </div>
  );
}