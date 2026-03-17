'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
  });
  const [previewAvatar, setPreviewAvatar] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setAuth } = useAuthStore();

  // Generate preview avatar when username changes
  const generateAvatar = (username: string) => {
    if (!username) {
      setPreviewAvatar('');
      return;
    }
    const avatarStyles = ['avataaars', 'bottts', 'identicon', 'personas', 'pixel-art'];
    const randomStyle = avatarStyles[Math.floor(Math.random() * avatarStyles.length)];
    const randomSeed = Math.random().toString(36).substring(7);
    const avatarUrl = `https://api.dicebear.com/7.x/${randomStyle}/svg?seed=${username}${randomSeed}`;
    setPreviewAvatar(avatarUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const data = isLogin
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await api.post(endpoint, data);
      setAuth(response.data.user, response.data.token);
      toast.success(isLogin ? 'Logged in successfully!' : 'Account created!');
      router.push('/home');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-instagram-pink via-instagram-purple to-instagram-orange bg-clip-text text-transparent">
            Instagram
          </h1>
          <p className="mt-2 text-gray-600">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </p>
        </div>

        <form className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-md" onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <div className="flex items-center space-x-3 mt-1">
                  {previewAvatar && (
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-instagram-pink flex-shrink-0">
                      <img 
                        src={previewAvatar} 
                        alt="Avatar preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <input
                    id="username"
                    type="text"
                    required={!isLogin}
                    value={formData.username}
                    onChange={(e) => {
                      setFormData({ ...formData, username: e.target.value });
                      generateAvatar(e.target.value);
                    }}
                    className="flex-1 block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-instagram-pink focus:border-transparent"
                    placeholder="Enter username"
                  />
                </div>
                {previewAvatar && (
                  <p className="mt-1 text-xs text-gray-500">
                    ✨ Random avatar will be generated for you!
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-instagram-pink focus:border-transparent"
                />
              </div>
            </>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-instagram-pink focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-instagram-pink focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-instagram-pink to-instagram-purple hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-instagram-pink disabled:opacity-50"
          >
            {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-instagram-pink hover:text-instagram-purple"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
