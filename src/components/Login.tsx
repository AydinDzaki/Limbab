import { useState } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Eye, EyeOff, Calculator } from "lucide-react";

interface LoginProps {
  onLogin: () => void;
  onForgotPassword: () => void;
}

export function Login({ onLogin, onForgotPassword }: LoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    userName: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="flex-1 flex flex-col justify-center px-4 py-6">
      {/* Compact App Logo */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-3">
          <div className="p-2 bg-primary rounded-xl">
            <Calculator className="h-6 w-6 text-primary-foreground" />
          </div>
        </div>
        <h1 className="text-xl mb-1">FinanceBook</h1>
      </div>

      {/* Compact Login Form */}
      <Card className="mx-auto w-full max-w-sm">
        <CardHeader className="pb-3">
          <Tabs value={isLogin ? "login" : "register"} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger 
                value="login" 
                onClick={() => setIsLogin(true)}
                className="text-sm"
              >
                Masuk
              </TabsTrigger>
              <TabsTrigger 
                value="register" 
                onClick={() => setIsLogin(false)}
                className="text-sm"
              >
                Daftar
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        
        <CardContent className="pt-0">
          <form onSubmit={handleSubmit} className="space-y-3">
            {!isLogin && (
              <div className="space-y-1">
                <Label htmlFor="userName" className="text-xs">Nama Pengguna</Label>
                <Input
                  id="userName"
                  placeholder="Masukkan nama pengguna"
                  value={formData.userName}
                  onChange={(e) => handleInputChange("userName", e.target.value)}
                  className="h-9 text-sm"
                  required={!isLogin}
                />
              </div>
            )}
            
            <div className="space-y-1">
              <Label htmlFor="email" className="text-xs">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@domain.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="h-9 text-sm"
                required
              />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="password" className="text-xs">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="h-9 text-sm pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-9 w-9 px-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                </Button>
              </div>
            </div>
            
            {!isLogin && (
              <div className="space-y-1">
                <Label htmlFor="confirmPassword" className="text-xs">Konfirmasi</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Ulangi password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  className="h-9 text-sm"
                  required={!isLogin}
                />
              </div>
            )}
            
            <Button type="submit" className="w-full h-10 mt-4">
              {isLogin ? "Masuk" : "Daftar"}
            </Button>
          </form>
          
          {isLogin && (
            <div className="text-center mt-3">
              <Button 
                variant="link" 
                className="text-xs h-6"
                onClick={onForgotPassword}
              >
                Lupa Password?
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}