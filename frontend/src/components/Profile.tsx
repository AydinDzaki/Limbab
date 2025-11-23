import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { LogOut, Shield, Users, ChevronRight } from "lucide-react";

interface ProfileProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function Profile({ onNavigate, onLogout }: ProfileProps) {
  const [userData] = useState({
    name: "Ahmad Wijaya",
    email: "ahmad@example.com",
    status: "Pemilik" as "Pemilik" | "Akuntan" | "Kasir"
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pemilik":
        return "bg-purple-500";
      case "Akuntan":
        return "bg-blue-500";
      case "Kasir":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="flex-1 p-4 space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-lg">Profil</h1>
        <p className="text-xs text-muted-foreground">Kelola profil dan pengaturan akun</p>
      </div>

      {/* Profile Card */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg">
                {userData.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-base">{userData.name}</h3>
              <p className="text-xs text-muted-foreground">{userData.email}</p>
              <Badge className={`${getStatusColor(userData.status)} mt-2 text-xs px-2 py-0`}>
                {userData.status}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Menu Options */}
      <div className="space-y-2">
        {/* Security Settings */}
        <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => onNavigate('security')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm">Keamanan</h3>
                <p className="text-xs text-muted-foreground">Ubah password dan keamanan akun</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        {/* Member Management - Only for Pemilik */}
        {userData.status === "Pemilik" && (
          <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => onNavigate('members')}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm">Manajemen Anggota</h3>
                  <p className="text-xs text-muted-foreground">Kelola tim dan akses pengguna</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Logout Button */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            variant="destructive" 
            size="sm"
            className="w-full h-9 text-sm"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Keluar
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-sm">Keluar dari Akun?</AlertDialogTitle>
            <AlertDialogDescription className="text-xs">
              Anda akan keluar dari akun dan perlu login kembali untuk mengakses aplikasi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-8 text-xs">Batal</AlertDialogCancel>
            <AlertDialogAction onClick={onLogout} className="h-8 text-xs">
              Keluar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* App Info */}
      <div className="text-center text-xs text-muted-foreground pt-4">
        <p>FinanceBook v.0.0.1</p>
      </div>
    </div>
  );
}
