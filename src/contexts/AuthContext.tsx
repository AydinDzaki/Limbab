import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  name: string;
  email: string;
  businessName: string;
  role: string;
  profilePhoto?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User }>;
  register: (data: RegisterData) => Promise<{ success: boolean; user?: User }>;
  logout: () => void;
  updateProfile: (data: { name?: string; profilePhoto?: string }) => void;
}

interface RegisterData {
  fullName: string;
  businessName: string;
  email: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for saved auth on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('financebook_user');
    const savedAuth = localStorage.getItem('financebook_auth');
    
    if (savedUser && savedAuth === 'true') {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('financebook_user');
        localStorage.removeItem('financebook_auth');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; user?: User }> => {
    // Simulasi login - dalam production, ini akan hit API
    return new Promise((resolve) => {
      setTimeout(() => {
        // Cek apakah user sudah terdaftar
        const savedUsers = localStorage.getItem('financebook_users');
        let users: any[] = [];
        
        if (savedUsers) {
          try {
            users = JSON.parse(savedUsers);
          } catch (error) {
            console.error('Error parsing users:', error);
          }
        }

        const foundUser = users.find(u => u.email === email && u.password === password);

        if (foundUser || email === 'demo@financebook.com') {
          // User ditemukan atau menggunakan demo account
          const userData: User = foundUser ? {
            name: foundUser.fullName,
            email: foundUser.email,
            businessName: foundUser.businessName,
            role: 'Owner'
          } : {
            name: 'Demo User',
            email: 'demo@financebook.com',
            businessName: 'Demo Business',
            role: 'Owner'
          };

          setUser(userData);
          setIsAuthenticated(true);
          localStorage.setItem('financebook_user', JSON.stringify(userData));
          localStorage.setItem('financebook_auth', 'true');
          
          resolve({ success: true, user: userData });
        } else {
          resolve({ success: false });
        }
      }, 1500);
    });
  };

  const register = async (data: RegisterData): Promise<{ success: boolean; user?: User }> => {
    // Simulasi register - dalam production, ini akan hit API
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simpan user baru ke localStorage
        const savedUsers = localStorage.getItem('financebook_users');
        let users: any[] = [];
        
        if (savedUsers) {
          try {
            users = JSON.parse(savedUsers);
          } catch (error) {
            console.error('Error parsing users:', error);
          }
        }

        // Cek apakah email sudah terdaftar
        const existingUser = users.find(u => u.email === data.email);
        if (existingUser) {
          resolve({ success: false });
          return;
        }

        // Simpan user baru
        const newUser = {
          fullName: data.fullName,
          businessName: data.businessName,
          email: data.email,
          password: data.password,
          createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('financebook_users', JSON.stringify(users));

        const userData: User = {
          name: data.fullName,
          email: data.email,
          businessName: data.businessName,
          role: 'Owner'
        };

        // Auto-login setelah registrasi
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('financebook_user', JSON.stringify(userData));
        localStorage.setItem('financebook_auth', 'true');

        resolve({ success: true, user: userData });
      }, 1500);
    });
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('financebook_user');
    localStorage.removeItem('financebook_auth');
  };

  const updateProfile = (data: { name?: string; profilePhoto?: string }) => {
    if (user) {
      const updatedUser: User = {
        ...user,
        name: data.name || user.name,
        profilePhoto: data.profilePhoto || user.profilePhoto
      };

      setUser(updatedUser);
      localStorage.setItem('financebook_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout, updateProfile }}>
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