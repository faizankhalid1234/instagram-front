'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import ThemeToggle from '@/components/ui/ThemeToggle';

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
      if (typeof window !== 'undefined') {
        localStorage.removeItem('isDemoLogin');
      }
      setAuth(response.data.user, response.data.token);
      toast.success(isLogin ? 'Logged in successfully!' : 'Account created!');
      router.push('/home');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    const demoCredentials = {
      email: 'demo@instaclone.com',
      password: '11223344',
    };
    const demoProfile = {
      username: 'faizan_demo',
      fullName: 'Faizan Khalid',
      ...demoCredentials,
    };

    setFormData((prev) => ({ ...prev, ...demoCredentials }));
    setLoading(true);

    try {
      let response;
      try {
        response = await api.post('/auth/login', demoCredentials);
      } catch (loginError: any) {
        // If demo user is missing, create it once then log in.
        const status = loginError?.response?.status;
        if (status === 401 || status === 404 || status === 400) {
          await api.post('/auth/register', demoProfile);
          response = await api.post('/auth/login', demoCredentials);
        } else {
          throw loginError;
        }
      }

      if (!response) {
        throw new Error('Demo login failed');
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('isDemoLogin', 'true');
      }
      setAuth(response.data.user, response.data.token);
      toast.success('Demo account logged in!');
      router.push('/home');
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Demo login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-rose-50 via-white to-violet-100 px-4 py-12 transition-colors duration-300 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute -top-24 -left-20 h-72 w-72 rounded-full bg-instagram-pink/20 blur-3xl dark:bg-instagram-pink/10" />
      <div className="pointer-events-none absolute right-0 bottom-8 h-80 w-80 rounded-full bg-instagram-purple/20 blur-3xl dark:bg-instagram-purple/10" />

      <section className="relative mx-auto w-full max-w-md space-y-8">
        <div className="flex justify-end">
          <ThemeToggle />
        </div>

        <div className="text-center">
          <h1 className="bg-gradient-to-r from-instagram-pink via-instagram-purple to-instagram-orange bg-clip-text text-4xl font-extrabold text-transparent sm:text-5xl">
            InstaGlow
          </h1>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            {isLogin
              ? 'Sign in to continue exploring moments around the world.'
              : 'Create your account and start sharing your beautiful stories.'}
          </p>
        </div>

        <form
          className="mt-8 space-y-6 rounded-2xl border border-white/50 bg-white/80 p-8 shadow-xl backdrop-blur dark:border-slate-700 dark:bg-slate-900/80"
          onSubmit={handleSubmit}
        >
          {!isLogin && (
            <>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
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
                    className="flex-1 block rounded-lg border border-slate-300 bg-white px-3 py-2 shadow-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-instagram-pink dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                    placeholder="Enter username"
                  />
                </div>
                {previewAvatar && (
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    ✨ Random avatar will be generated for you!
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 shadow-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-instagram-pink dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
            </>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 shadow-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-instagram-pink dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 shadow-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-instagram-pink dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg border border-transparent bg-gradient-to-r from-instagram-pink to-instagram-purple px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-instagram-pink focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>

          {isLogin && (
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Try Demo Login
            </button>
          )}

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-medium text-instagram-pink transition hover:text-instagram-purple"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </form>

        <footer className="pt-4 text-center text-xs text-slate-500 dark:text-slate-400">
          <div className="rounded-2xl border border-white/50 bg-white/70 p-4 shadow-md backdrop-blur dark:border-slate-700 dark:bg-slate-900/70">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Faizan Khalid</p>
            <p className="mt-1">Phone: 03029655325</p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-xs">
              <a
                href="https://portfolio-faizan-topaz.vercel.app/"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-slate-300 px-3 py-1 font-medium text-slate-600 transition hover:border-instagram-pink hover:text-instagram-pink dark:border-slate-600 dark:text-slate-300"
              >
                Portfolio
              </a>
              <a
                href="https://www.linkedin.com/in/faizan-khalid-developerp/"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-slate-300 px-3 py-1 font-medium text-slate-600 transition hover:border-instagram-pink hover:text-instagram-pink dark:border-slate-600 dark:text-slate-300"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/faizankhalid1234"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-slate-300 px-3 py-1 font-medium text-slate-600 transition hover:border-instagram-pink hover:text-instagram-pink dark:border-slate-600 dark:text-slate-300"
              >
                GitHub
              </a>
            </div>
            <p className="mt-3">© {new Date().getFullYear()} Faizan Khalid. All rights reserved.</p>
          </div>
        </footer>
      </section>
    </main>
  );
}
