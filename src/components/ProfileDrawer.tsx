import { X } from 'lucide-react';
import { Profile } from './Profile';

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileDrawer({ isOpen, onClose }: ProfileDrawerProps) {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}
      
      {/* Drawer */}
      <div 
        className={`fixed top-0 left-0 h-full w-full bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out overflow-y-auto scrollbar-hide ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Close Button */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 p-4 flex items-center justify-between z-10">
          <h2 className="text-white">Profile</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="size-5 text-white" />
          </button>
        </div>
        
        {/* Profile Content */}
        <div className="px-4 pb-20">
          <Profile />
        </div>
      </div>
    </>
  );
}