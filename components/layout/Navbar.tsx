'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { FiHome, FiSearch, FiPlusSquare, FiHeart, FiUser } from 'react-icons/fi';
import Link from 'next/link';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const navItems = [
    { icon: FiHome, path: '/home', label: 'Home' },
    { icon: FiSearch, path: '/explore', label: 'Explore' },
    { icon: FiPlusSquare, path: '/create', label: 'Create' },
    { icon: FiHeart, path: '/activity', label: 'Activity' },
    { icon: FiUser, path: `/profile/${user?._id}`, label: 'Profile' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/home" className="text-2xl font-bold bg-gradient-to-r from-instagram-pink via-instagram-purple to-instagram-orange bg-clip-text text-transparent">
            Instagram
          </Link>

          <div className="flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path || 
                (item.path.includes('/profile') && pathname?.includes('/profile'));
              
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`p-2 ${isActive ? 'text-instagram-pink' : 'text-gray-700'} hover:text-instagram-pink transition-colors`}
                >
                  <Icon size={24} />
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-white bg-instagram-pink rounded-md hover:opacity-90"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
