import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';

// Tipe data User kita (gabungan Auth Supabase + Table Profiles)
export interface User {
  id: string;
  name: string;
  email: string;
  businessName: string;
  role: string;
  profilePhoto?: string;
}

interface RegisterData {
  fullName: string;
  businessName: string;
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: { name?: string; profilePhoto?: string }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Cek sesi login saat aplikasi dibuka
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email!);
      } else {
        setIsLoading(false);
      }
    });

    // 2. Dengar perubahan auth (Login/Logout/Register)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email!);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Helper: Ambil data profil tambahan dari database PostgreSQL
  const fetchProfile = async (userId: string, email: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.warn('Profile not found, using metadata');
      }

      // Jika data profil belum ada (baru register), pakai metadata
      // Jika sudah ada, pakai data dari tabel
      setUser({
        id: userId,
        email: email,
        name: data?.full_name || 'Pengguna Baru',
        businessName: data?.business_name || 'Bisnis Saya',
        role: data?.role || 'Owner',
        profilePhoto: data?.avatar_url
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  const register = async (data: RegisterData) => {
    // Kita kirim data tambahan (metadata) agar Trigger SQL bisa menangkapnya
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
          business_name: data.businessName,
        },
      },
    });

    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateProfile = async (data: { name?: string; profilePhoto?: string }) => {
    if (!user) return;

    // 1. Update State Lokal (biar responsif)
    setUser(prev => prev ? { 
      ...prev, 
      name: data.name || prev.name, 
      profilePhoto: data.profilePhoto || prev.profilePhoto 
    } : null);

    // 2. Update Database Supabase
    const updates: any = {};
    if (data.name) updates.full_name = data.name;
    if (data.profilePhoto) updates.avatar_url = data.profilePhoto;

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (error) console.error('Gagal update profil:', error);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading,
      login, 
      register, 
      logout, 
      updateProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}