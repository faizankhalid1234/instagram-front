import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import AuthProvider from '@/components/providers/AuthProvider'

export const metadata: Metadata = {
  metadataBase: new URL('https://instagram-clone.local'),
  title: {
    default: 'Instagram Clone - Share Moments Instantly',
    template: '%s | Instagram Clone',
  },
  description:
    'A modern Instagram-inspired social platform to share photos, connect with friends, and explore trending content.',
  keywords: [
    'instagram clone',
    'social media app',
    'photo sharing',
    'nextjs app',
    'tailwind css',
  ],
  openGraph: {
    title: 'Instagram Clone - Share Moments Instantly',
    description:
      'Explore a beautiful and fast Instagram-inspired experience built with Next.js and Tailwind CSS.',
    type: 'website',
    siteName: 'Instagram Clone',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Instagram Clone - Share Moments Instantly',
    description:
      'Discover an SEO-friendly Instagram clone with responsive UI, dark mode, and smooth authentication.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var stored = localStorage.getItem('theme');
                  var isDark = stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  if (isDark) document.documentElement.classList.add('dark');
                  else document.documentElement.classList.remove('dark');
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
        <AuthProvider>
          {children}
          <Toaster position="top-center" />
        </AuthProvider>
      </body>
    </html>
  )
}
