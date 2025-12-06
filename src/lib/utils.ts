import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { 
  ShoppingBag, Utensils, Car, Zap, Briefcase, 
  TrendingUp, Package, Layers, Wrench, 
  Banknote, Smartphone, Home, DollarSign, HelpCircle
} from 'lucide-react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Logic pemetaan teks database ke Ikon & Warna UI
export const getCategoryStyle = (category: string) => {
  const normalized = category?.toLowerCase() || '';

  // Expense Categories
  if (normalized.includes('makan') || normalized.includes('food')) 
    return { icon: Utensils, color: 'text-orange-600', bg: 'bg-orange-100', bar: 'bg-orange-500' };
  if (normalized.includes('transport') || normalized.includes('bensin')) 
    return { icon: Car, color: 'text-purple-600', bg: 'bg-purple-100', bar: 'bg-purple-500' };
  if (normalized.includes('utilitas') || normalized.includes('listrik') || normalized.includes('air')) 
    return { icon: Zap, color: 'text-yellow-600', bg: 'bg-yellow-100', bar: 'bg-yellow-500' };
  if (normalized.includes('operasional') || normalized.includes('biaya')) 
    return { icon: Wrench, color: 'text-blue-600', bg: 'bg-blue-100', bar: 'bg-blue-500' };
  if (normalized.includes('inventori') || normalized.includes('stok') || normalized.includes('perlengkapan')) 
    return { icon: ShoppingBag, color: 'text-indigo-600', bg: 'bg-indigo-100', bar: 'bg-indigo-500' };
  if (normalized.includes('gaji') || normalized.includes('salary')) 
    return { icon: Briefcase, color: 'text-pink-600', bg: 'bg-pink-100', bar: 'bg-pink-500' };
  if (normalized.includes('sewa')) 
    return { icon: Home, color: 'text-teal-600', bg: 'bg-teal-100', bar: 'bg-teal-500' };
  if (normalized.includes('pemasaran')) 
    return { icon: Smartphone, color: 'text-rose-600', bg: 'bg-rose-100', bar: 'bg-rose-500' };
  
  // Income & Debt Categories
  if (normalized.includes('utang') || normalized.includes('piutang')) 
    return { icon: Banknote, color: 'text-cyan-600', bg: 'bg-cyan-100', bar: 'bg-cyan-500' };
  if (normalized.includes('pendapatan') || normalized.includes('jual') || normalized.includes('investasi')) 
    return { icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-100', bar: 'bg-emerald-500' };

  // Default
  return { icon: Layers, color: 'text-slate-600', bg: 'bg-slate-100', bar: 'bg-slate-500' };
};