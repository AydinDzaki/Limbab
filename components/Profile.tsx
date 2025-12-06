import { useState, useRef } from 'react';
import { User, Lock, Users, Mail, Edit2, Trash2, UserPlus, Eye, EyeOff, Shield, LogOut, Camera } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { toast } from 'sonner@2.0.3';
import { useAuth } from '../contexts/AuthContext';

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: 'Owner' | 'Staff' | 'Cashier';
  joinedDate: string;
  avatar?: string;
}

const mockTeamMembers: TeamMember[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@company.com',
    role: 'Owner',
    joinedDate: '2024-01-15',
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.j@company.com',
    role: 'Staff',
    joinedDate: '2024-03-20',
  },
  {
    id: 3,
    name: 'Mike Chen',
    email: 'mike.chen@company.com',
    role: 'Cashier',
    joinedDate: '2024-06-10',
  },
  {
    id: 4,
    name: 'Lisa Anderson',
    email: 'lisa.a@company.com',
    role: 'Staff',
    joinedDate: '2024-08-05',
  },
];

export function Profile() {
  const [activeSection, setActiveSection] = useState<'profile' | 'security' | 'team'>('profile');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showEditNameDialog, setShowEditNameDialog] = useState(false);
  const [editedName, setEditedName] = useState('');
  const { user, logout, updateProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Password states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Team management states
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'Staff' | 'Cashier'>('Staff');
  const [editRole, setEditRole] = useState<'Staff' | 'Cashier'>('Staff');

  const currentUser = {
    name: user?.name || 'John Doe',
    email: user?.email || 'john.doe@company.com',
    role: user?.role || 'Owner',
    company: user?.businessName || 'ABC Trading Company',
    profilePhoto: user?.profilePhoto,
  };

  const getUserInitials = () => {
    return currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleLogout = () => {
    logout();
    toast.success('Berhasil keluar dari akun');
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validasi ukuran file (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Ukuran file maksimal 5MB');
        return;
      }

      // Validasi tipe file
      if (!file.type.startsWith('image/')) {
        toast.error('File harus berupa gambar');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const photoUrl = reader.result as string;
        updateProfile({ profilePhoto: photoUrl });
        toast.success('Foto profil berhasil diperbarui');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNameEdit = () => {
    setEditedName(currentUser.name);
    setShowEditNameDialog(true);
  };

  const handleSaveName = () => {
    if (!editedName.trim()) {
      toast.error('Nama tidak boleh kosong');
      return;
    }

    updateProfile({ name: editedName });
    toast.success('Nama berhasil diperbarui');
    setShowEditNameDialog(false);
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Semua field password wajib diisi');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Password baru tidak cocok');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('Password minimal 8 karakter');
      return;
    }
    
    toast.success('Password berhasil diubah');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleInviteMember = () => {
    if (!inviteName || !inviteEmail) {
      toast.error('Semua field wajib diisi');
      return;
    }

    const newMember: TeamMember = {
      id: teamMembers.length + 1,
      name: inviteName,
      email: inviteEmail,
      role: inviteRole,
      joinedDate: new Date().toISOString().split('T')[0],
    };

    setTeamMembers([...teamMembers, newMember]);
    toast.success(`Undangan dikirim ke ${inviteName}`);
    setShowInviteDialog(false);
    setInviteName('');
    setInviteEmail('');
    setInviteRole('Staff');
  };

  const handleEditMember = () => {
    if (!selectedMember) return;

    setTeamMembers(teamMembers.map(member => 
      member.id === selectedMember.id 
        ? { ...member, role: editRole }
        : member
    ));
    toast.success(`Role ${selectedMember.name} berhasil diubah`);
    setShowEditDialog(false);
    setSelectedMember(null);
  };

  const handleDeleteMember = () => {
    if (!selectedMember) return;

    setTeamMembers(teamMembers.filter(member => member.id !== selectedMember.id));
    toast.success(`${selectedMember.name} dihapus dari tim`);
    setShowDeleteDialog(false);
    setSelectedMember(null);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Owner':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Staff':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Cashier':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Section Navigation */}
      <div className="bg-white px-4 py-4 shadow-sm sticky top-0 z-10">
        <h2 className="text-gray-900 mb-4">Profil & Pengaturan</h2>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide [-webkit-overflow-scrolling:touch]">
          <button
            onClick={() => setActiveSection('profile')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
              activeSection === 'profile'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <User className="w-4 h-4" />
            Profil
          </button>
          <button
            onClick={() => setActiveSection('security')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
              activeSection === 'security'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Lock className="w-4 h-4" />
            Keamanan
          </button>
          <button
            onClick={() => setActiveSection('team')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
              activeSection === 'team'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Users className="w-4 h-4" />
            Tim
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide">
        {/* Profile Section */}
        {activeSection === 'profile' && (
          <div className="space-y-4">
            <Card className="p-6 rounded-2xl shadow-sm">
              {/* Profile Photo Section */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative mb-4">
                  <Avatar className="w-24 h-24 border-4 border-blue-100">
                    {currentUser.profilePhoto ? (
                      <AvatarImage src={currentUser.profilePhoto} alt={currentUser.name} />
                    ) : (
                      <AvatarFallback className="bg-blue-600 text-white text-2xl">
                        {getUserInitials()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors shadow-lg border-2 border-white"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </div>
                <h3 className="text-gray-900">{currentUser.name}</h3>
                <p className="text-sm text-gray-500">{currentUser.role}</p>
                <p className="text-xs text-gray-400 mt-1">{currentUser.company}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="username" className="text-gray-700">
                      Nama Lengkap
                    </Label>
                    <button
                      onClick={handleNameEdit}
                      className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm transition-colors"
                    >
                      <Edit2 className="w-3 h-3" />
                      Ubah
                    </button>
                  </div>
                  <Input
                    id="username"
                    value={currentUser.name}
                    readOnly
                    className="bg-gray-50 border-2 border-gray-200 rounded-xl cursor-not-allowed"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-gray-700 mb-2 block">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={currentUser.email}
                      readOnly
                      className="pl-10 bg-gray-50 border-2 border-gray-200 rounded-xl cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="company" className="text-gray-700 mb-2 block">
                    Nama Usaha
                  </Label>
                  <Input
                    id="company"
                    value={currentUser.company}
                    readOnly
                    className="bg-gray-50 border-2 border-gray-200 rounded-xl cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-900">Informasi Terlindungi</p>
                    <p className="text-xs text-blue-700 mt-1">
                      Email dan nama usaha tidak dapat diubah. Hubungi support untuk bantuan.
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Logout Button */}
            <Card className="p-6 rounded-2xl shadow-sm border-2 border-red-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-gray-900 flex items-center gap-2">
                    <LogOut className="w-5 h-5 text-red-600" />
                    Keluar dari Akun
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Keluar dari akun FinanceBook Anda
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setShowLogoutDialog(true)}
                className="w-full h-12 bg-red-600 hover:bg-red-700 text-white rounded-xl"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </Button>
            </Card>
          </div>
        )}

        {/* Security Section */}
        {activeSection === 'security' && (
          <div className="space-y-4">
            <Card className="p-6 rounded-2xl shadow-sm">
              <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-600" />
                Ubah Password
              </h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="current-password" className="text-gray-700 mb-2 block">
                    Password Saat Ini
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="current-password"
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="pl-10 pr-10 border-2 border-gray-200 rounded-xl focus:border-blue-500"
                      placeholder="Masukkan password saat ini"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="new-password" className="text-gray-700 mb-2 block">
                    Password Baru
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="new-password"
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-10 pr-10 border-2 border-gray-200 rounded-xl focus:border-blue-500"
                      placeholder="Masukkan password baru"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="confirm-password" className="text-gray-700 mb-2 block">
                    Konfirmasi Password Baru
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 pr-10 border-2 border-gray-200 rounded-xl focus:border-blue-500"
                      placeholder="Konfirmasi password baru"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <Button
                  onClick={handleChangePassword}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl mt-2"
                >
                  Perbarui Password
                </Button>
              </div>

              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-sm text-amber-900">Persyaratan password:</p>
                <ul className="text-xs text-amber-700 mt-2 space-y-1 ml-4 list-disc">
                  <li>Minimal 8 karakter</li>
                  <li>Kombinasi huruf besar dan kecil</li>
                  <li>Minimal satu angka</li>
                </ul>
              </div>
            </Card>
          </div>
        )}

        {/* Team Management Section */}
        {activeSection === 'team' && (
          <div className="space-y-4">
            {/* Header with Invite Button */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-900">Anggota Tim</h3>
                <p className="text-sm text-gray-500">{teamMembers.length} anggota</p>
              </div>
              <Button
                onClick={() => setShowInviteDialog(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-10"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Undang
              </Button>
            </div>

            {/* Team Members List */}
            <div className="space-y-3">
              {teamMembers.map((member) => (
                <Card key={member.id} className="p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white flex-shrink-0">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-gray-900 truncate">{member.name}</h4>
                          {member.role === 'Owner' && (
                            <Shield className="w-4 h-4 text-purple-600 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-gray-500 truncate flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {member.email}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`inline-flex px-2 py-1 rounded-lg text-xs border ${getRoleBadgeColor(member.role)}`}>
                            {member.role}
                          </span>
                          <span className="text-xs text-gray-400">
                            Bergabung {new Date(member.joinedDate).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {member.role !== 'Owner' && (
                      <div className="flex items-center gap-2 ml-2">
                        <button
                          onClick={() => {
                            setSelectedMember(member);
                            setEditRole(member.role as 'Staff' | 'Cashier');
                            setShowEditDialog(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedMember(member);
                            setShowDeleteDialog(true);
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            {/* Info Box */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-900">Manajemen Tim</p>
                  <p className="text-xs text-blue-700 mt-1">
                    Kelola tingkat akses dan izin untuk anggota tim Anda
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Name Dialog */}
      <Dialog open={showEditNameDialog} onOpenChange={setShowEditNameDialog}>
        <DialogContent className="max-w-[90%] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Ubah Nama</DialogTitle>
            <DialogDescription>
              Perbarui nama pengguna Anda
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Label htmlFor="edit-name" className="text-gray-700 mb-2 block">
              Nama Lengkap
            </Label>
            <Input
              id="edit-name"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              placeholder="Masukkan nama lengkap"
              className="border-2 border-gray-200 rounded-xl"
            />
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEditNameDialog(false)}
              className="rounded-xl"
            >
              Batal
            </Button>
            <Button
              onClick={handleSaveName}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
            >
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invite Member Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent className="max-w-[90%] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Undang Anggota Tim Baru</DialogTitle>
            <DialogDescription>
              Kirim undangan untuk menambahkan anggota baru ke tim Anda
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="invite-name" className="text-gray-700 mb-2 block">
                Nama Lengkap
              </Label>
              <Input
                id="invite-name"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                placeholder="Masukkan nama lengkap"
                className="border-2 border-gray-200 rounded-xl"
              />
            </div>
            
            <div>
              <Label htmlFor="invite-email" className="text-gray-700 mb-2 block">
                Alamat Email
              </Label>
              <Input
                id="invite-email"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="email@company.com"
                className="border-2 border-gray-200 rounded-xl"
              />
            </div>
            
            <div>
              <Label htmlFor="invite-role" className="text-gray-700 mb-2 block">
                Role
              </Label>
              <Select value={inviteRole} onValueChange={(value: 'Staff' | 'Cashier') => setInviteRole(value)}>
                <SelectTrigger className="w-full border-2 border-gray-200 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Staff">Staff</SelectItem>
                  <SelectItem value="Cashier">Cashier</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowInviteDialog(false)}
              className="rounded-xl"
            >
              Batal
            </Button>
            <Button
              onClick={handleInviteMember}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
            >
              Kirim Undangan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Member Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-[90%] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Ubah Anggota Tim</DialogTitle>
            <DialogDescription>
              Perbarui role untuk {selectedMember?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="edit-role" className="text-gray-700 mb-2 block">
                Role
              </Label>
              <Select value={editRole} onValueChange={(value: 'Staff' | 'Cashier') => setEditRole(value)}>
                <SelectTrigger className="w-full border-2 border-gray-200 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Staff">Staff</SelectItem>
                  <SelectItem value="Cashier">Cashier</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEditDialog(false)}
              className="rounded-xl"
            >
              Batal
            </Button>
            <Button
              onClick={handleEditMember}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
            >
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Member Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="max-w-[90%] rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Anggota Tim</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus {selectedMember?.name} dari tim? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteMember}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Logout Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="max-w-[90%] rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Keluar dari Akun</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin keluar dari akun? Anda perlu login kembali untuk mengakses aplikasi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
            >
              Ya, Keluar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
