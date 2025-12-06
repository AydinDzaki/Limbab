import { useState, useEffect, useRef } from 'react';
import { 
  User, Lock, Users, Mail, Edit2, UserPlus, 
  Eye, EyeOff, LogOut, Camera, Building2, Trash2, Check, ChevronsUpDown 
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: 'Owner' | 'Staff' | 'Cashier';
  created_at: string;
}

export function Profile() {
  const [activeSection, setActiveSection] = useState<'profile' | 'security' | 'team'>('profile');
  
  // State Data Real
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoadingTeam, setIsLoadingTeam] = useState(false);
  
  // Dialog States
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showEditNameDialog, setShowEditNameDialog] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  
  // Form States
  const [editedName, setEditedName] = useState('');
  const { user, logout, updateProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Password states
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Invite Form States
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'Staff' | 'Cashier'>('Staff');

  useEffect(() => {
    if (activeSection === 'team') {
      fetchTeamMembers();
    }
  }, [activeSection]);

  const fetchTeamMembers = async () => {
    try {
      setIsLoadingTeam(true);
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setTeamMembers(data || []);
    } catch (error) {
      console.error('Error fetching team:', error);
      toast.error('Gagal memuat data tim');
    } finally {
      setIsLoadingTeam(false);
    }
  };

  const getUserInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Berhasil keluar dari akun');
    } catch (error) {
      toast.error('Gagal logout');
    }
  };

  const handleUpdateRole = async (id: number, newRole: string) => {
    const oldMembers = [...teamMembers];
    setTeamMembers(prev => prev.map(m => m.id === id ? { ...m, role: newRole as any } : m));

    try {
      const { error } = await supabase
        .from('team_members')
        .update({ role: newRole })
        .eq('id', id);

      if (error) throw error;
      toast.success('Jabatan berhasil diperbarui');
    } catch (error) {
      setTeamMembers(oldMembers);
      toast.error('Gagal mengubah jabatan');
    }
  };

  const handleInviteMember = async () => {
    if (!inviteName || !inviteEmail) {
      toast.error('Nama dan Email wajib diisi');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('team_members')
        .insert([
          { name: inviteName, email: inviteEmail, role: inviteRole }
        ])
        .select()
        .single();

      if (error) throw error;

      setTeamMembers([...teamMembers, data]);
      
      toast.success(`Berhasil menambahkan ${inviteName}`);
      setShowInviteDialog(false);
      
      setInviteName('');
      setInviteEmail('');
      setInviteRole('Staff');
    } catch (error) {
      console.error(error);
      toast.error('Gagal menambahkan anggota. Pastikan tabel database sudah dibuat.');
    }
  };

  const handleDeleteMember = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus anggota ini?')) return;

    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTeamMembers(teamMembers.filter(m => m.id !== id));
      toast.success('Anggota tim dihapus');
    } catch (error) {
      toast.error('Gagal menghapus anggota');
    }
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 2MB');
      return;
    }
    if (!file.type.startsWith('image/')) {
      toast.error('File harus berupa gambar');
      return;
    }

    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      await updateProfile({ profilePhoto: publicUrl });
      toast.success('Foto profil berhasil diperbarui');

    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error('Gagal mengupload gambar');
    } finally {
      setIsUploading(false);
    }
  };

  const handleNameEdit = () => {
    if (user) setEditedName(user.name);
    setShowEditNameDialog(true);
  };

  const handleSaveName = async () => {
    if (!editedName.trim()) {
      toast.error('Nama tidak boleh kosong');
      return;
    }
    try {
      await updateProfile({ name: editedName });
      toast.success('Nama berhasil diperbarui');
      setShowEditNameDialog(false);
    } catch (error) {
      toast.error('Gagal memperbarui nama');
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error('Password baru wajib diisi');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Password baru tidak cocok');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password minimal 6 karakter');
      return;
    }
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success('Password berhasil diubah');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast.error(error.message || 'Gagal mengubah password');
    }
  };

  return (
    <div className="flex flex-col min-h-screen pb-20">
      {/* Sticky Header */}
      <div className="bg-white px-4 py-4 shadow-sm sticky top-0 z-10">
        <h2 className="text-gray-900 mb-4 font-semibold">Profil & Pengaturan</h2>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide [-webkit-overflow-scrolling:touch]">
          <button
            onClick={() => setActiveSection('profile')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
              activeSection === 'profile' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <User className="w-4 h-4" /> Profil
          </button>
          <button
            onClick={() => setActiveSection('security')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
              activeSection === 'security' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Lock className="w-4 h-4" /> Keamanan
          </button>
          <button
            onClick={() => setActiveSection('team')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
              activeSection === 'team' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Users className="w-4 h-4" /> Tim
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide">
        
        {activeSection === 'profile' && user && (
          <div className="space-y-4">
            <Card className="p-6 rounded-2xl shadow-sm border-none bg-white">
              <div className="flex flex-col items-center mb-6">
                <div className="relative mb-4">
                  <Avatar className="w-24 h-24 border-4 border-blue-50">
                    {user.profilePhoto ? (
                      <AvatarImage src={user.profilePhoto} alt={user.name} className="object-cover" />
                    ) : (
                      <AvatarFallback className="bg-blue-600 text-white text-2xl">{getUserInitials(user.name)}</AvatarFallback>
                    )}
                  </Avatar>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 shadow-lg border-2 border-white"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                </div>
                <h3 className="text-gray-900 font-semibold text-lg">{user.name}</h3>
                <p className="text-sm text-gray-500">{user.role}</p>
                <div className="flex items-center gap-1 mt-1 px-3 py-1 bg-gray-100 rounded-full">
                  <Building2 className="w-3 h-3 text-gray-500" />
                  <p className="text-xs text-gray-600">{user.businessName}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-gray-600 text-xs uppercase tracking-wider font-semibold">Nama Lengkap</Label>
                    <button onClick={handleNameEdit} className="text-blue-600 flex items-center gap-1 text-xs font-medium">
                      <Edit2 className="w-3 h-3" /> Ubah
                    </button>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl text-gray-900 border border-gray-100">{user.name}</div>
                </div>
                <div>
                  <Label className="text-gray-600 text-xs uppercase tracking-wider font-semibold mb-2 block">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <div className="pl-10 p-3 bg-gray-50 rounded-xl text-gray-500 border border-gray-100 overflow-hidden text-ellipsis">
                      {user.email}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 rounded-2xl shadow-sm border border-red-100 bg-red-50/30">
              <div className="mb-4">
                <h3 className="text-red-900 font-medium">Keluar Akun</h3>
                <p className="text-sm text-red-600/80 mt-1">Sesi Anda akan berakhir.</p>
              </div>
              <Button onClick={() => setShowLogoutDialog(true)} variant="destructive" className="w-full h-12 rounded-xl bg-red-600 hover:bg-red-700 shadow-none">
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </Button>
            </Card>
          </div>
        )}

        {activeSection === 'security' && (
          <div className="space-y-4">
            <Card className="p-6 rounded-2xl shadow-sm border-none">
              <h3 className="text-gray-900 mb-6 flex items-center gap-2 font-semibold">
                <Lock className="w-5 h-5 text-blue-600" /> Ubah Password
              </h3>
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-700 mb-2 block">Password Baru</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-10 pr-10 border-gray-200 rounded-xl h-11"
                      placeholder="Minimal 6 karakter"
                    />
                    <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <Label className="text-gray-700 mb-2 block">Konfirmasi Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 pr-10 border-gray-200 rounded-xl h-11"
                      placeholder="Ulangi password baru"
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <Button onClick={handleChangePassword} className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl mt-2">
                  Simpan Password Baru
                </Button>
              </div>
            </Card>
          </div>
        )}

        {activeSection === 'team' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-900 font-semibold">Anggota Tim</h3>
                <p className="text-sm text-gray-500">Kelola akses staff & kasir</p>
              </div>
              <Button onClick={() => setShowInviteDialog(true)} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                <UserPlus className="w-4 h-4 mr-2" /> Undang
              </Button>
            </div>

            <div className="space-y-3">
              {isLoadingTeam ? (
                <div className="text-center py-8 text-gray-400">Memuat data tim...</div>
              ) : teamMembers.length === 0 ? (
                <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed">
                  Belum ada anggota tim
                </div>
              ) : (
                teamMembers.map((member) => (
                  <Card key={member.id} className="p-4 rounded-xl shadow-sm border-none bg-white">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                            {getUserInitials(member.name)}
                          </div>
                          <div>
                            <h4 className="text-gray-900 font-medium text-sm">{member.name}</h4>
                            <p className="text-xs text-gray-500">{member.email}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleDeleteMember(member.id)}
                          className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-2 bg-gray-50 p-2 rounded-lg">
                        <span className="text-xs text-gray-500 font-medium ml-1">Akses:</span>
                        <Select 
                          value={member.role} 
                          onValueChange={(val) => handleUpdateRole(member.id, val)}
                        >
                          <SelectTrigger className="h-8 border-none bg-white shadow-sm w-[120px] text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Staff">Staff</SelectItem>
                            <SelectItem value="Cashier">Cashier</SelectItem>
                            <SelectItem value="Owner">Owner</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <Dialog open={showEditNameDialog} onOpenChange={setShowEditNameDialog}>
        <DialogContent className="max-w-[90%] rounded-2xl">
          <DialogHeader><DialogTitle>Ubah Nama</DialogTitle></DialogHeader>
          <div className="py-4">
            <Label className="mb-2 block">Nama Lengkap</Label>
            <Input value={editedName} onChange={(e) => setEditedName(e.target.value)} className="rounded-xl" />
          </div>
          <DialogFooter className="flex-row gap-2">
            <Button variant="outline" onClick={() => setShowEditNameDialog(false)} className="flex-1 rounded-xl">Batal</Button>
            <Button onClick={handleSaveName} className="flex-1 bg-blue-600 text-white rounded-xl">Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent className="max-w-[90%] rounded-2xl">
          <DialogHeader><DialogTitle>Undang Anggota</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
             <div>
               <Label className="mb-2 block text-sm">Nama Lengkap</Label>
               <Input placeholder="Contoh: Budi Santoso" value={inviteName} onChange={e => setInviteName(e.target.value)} className="rounded-xl" />
             </div>
             <div>
               <Label className="mb-2 block text-sm">Email</Label>
               <Input placeholder="nama@email.com" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} className="rounded-xl" />
             </div>
             <div>
               <Label className="mb-2 block text-sm">Jabatan / Role</Label>
               <Select value={inviteRole} onValueChange={(val: any) => setInviteRole(val)}>
                  <SelectTrigger className="w-full rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Staff">Staff</SelectItem>
                    <SelectItem value="Cashier">Cashier</SelectItem>
                  </SelectContent>
               </Select>
             </div>
          </div>
          <DialogFooter><Button onClick={handleInviteMember} className="w-full bg-blue-600 text-white rounded-xl">Simpan Anggota</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="max-w-[90%] rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Keluar Akun?</AlertDialogTitle>
            <AlertDialogDescription>Anda harus login kembali untuk mengakses data.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} className="bg-red-600 text-white rounded-xl">Keluar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}