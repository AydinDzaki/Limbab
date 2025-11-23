import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { ArrowLeft, UserPlus, Mail, Trash2 } from "lucide-react";

interface Member {
  id: string;
  name: string;
  email: string;
  status: "Pemilik" | "Akuntan" | "Kasir"; // Mapping dari 'role' di backend
}

interface MemberManagementProps {
  onNavigate: (page: string) => void;
}

export function MemberManagement({ onNavigate }: MemberManagementProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteStatus, setInviteStatus] = useState<"Akuntan" | "Kasir">("Kasir");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- AMBIL DATA DARI BACKEND ---
  const fetchMembers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/members');
      const data = await res.json();
      // Mapping: Backend pakai 'role', Frontend pakai 'status' (sesuai kode lama Anda)
      const mappedData = data.map((u: any) => ({ ...u, status: u.role }));
      setMembers(mappedData);
    } catch (error) {
      console.error("Gagal ambil member:", error);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // --- TAMBAH MEMBER ---
  const handleInviteMember = async () => {
    if (!inviteEmail) {
      alert("Masukkan email yang valid!");
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail, role: inviteStatus })
      });

      const result = await response.json();

      if (result.success) {
        alert(`Undangan terkirim ke ${inviteEmail}! (Password default: 123)`);
        fetchMembers(); // Refresh list
        setInviteEmail("");
        setDialogOpen(false);
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert("Gagal menambah anggota");
    } finally {
      setLoading(false);
    }
  };

  // --- HAPUS MEMBER ---
  const handleRemoveMember = async (memberId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/members/${memberId}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      
      if (result.success) {
        fetchMembers(); // Refresh list
        alert("Anggota berhasil dihapus!");
      }
    } catch (error) {
      alert("Gagal menghapus anggota");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pemilik": return "bg-purple-500";
      case "Akuntan": return "bg-blue-500";
      case "Kasir": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="flex-1 p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate('profile')}
          className="h-8 w-8 p-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-lg">Manajemen Anggota</h1>
          <p className="text-xs text-muted-foreground">Kelola akses tim Anda</p>
        </div>
        
        {/* Add Member Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="h-8 text-xs">
              <UserPlus className="h-3 w-3 mr-1" />
              Tambah
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-sm">Undang Anggota Baru</DialogTitle>
              <DialogDescription className="text-xs">
                Kirim undangan untuk menambahkan anggota tim.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="h-9 text-sm pl-9"
                    placeholder="nama@email.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Status / Role</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={inviteStatus === "Kasir" ? "default" : "outline"}
                    size="sm"
                    className="flex-1 h-8 text-xs"
                    onClick={() => setInviteStatus("Kasir")}
                  >
                    Kasir
                  </Button>
                  <Button
                    type="button"
                    variant={inviteStatus === "Akuntan" ? "default" : "outline"}
                    size="sm"
                    className="flex-1 h-8 text-xs"
                    onClick={() => setInviteStatus("Akuntan")}
                  >
                    Akuntan
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleInviteMember} size="sm" className="h-8 text-xs w-full" disabled={loading}>
                {loading ? "Mengirim..." : "Kirim Undangan"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Members List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Daftar Anggota ({members.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {members.map((member) => (
            <div key={member.id} className="flex items-center gap-3 p-3 rounded-lg border bg-card">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm truncate">{member.name}</h3>
                  <Badge className={`${getStatusColor(member.status)} text-xs px-2 py-0`}>
                    {member.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground truncate">{member.email}</p>
              </div>
              
              {member.status !== "Pemilik" && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-sm">Hapus Anggota?</AlertDialogTitle>
                      <AlertDialogDescription className="text-xs">
                        Yakin ingin menghapus akses untuk {member.name}?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="h-8 text-xs">Batal</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleRemoveMember(member.id)}
                        className="h-8 text-xs bg-destructive hover:bg-destructive/90"
                      >
                        Hapus
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
      
      {/* Info */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground text-center">
            *User baru akan memiliki password default: <strong>123</strong>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}