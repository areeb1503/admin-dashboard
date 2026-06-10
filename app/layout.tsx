import type { Metadata } from 'next';
import AuthProvider from '@/components/layout/AuthProvider';
import MuiProvider from '@/components/layout/MuiProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'AdminHub',
  description: 'Admin Dashboard built with Next.js, MUI, Zustand',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          <MuiProvider>{children}</MuiProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
