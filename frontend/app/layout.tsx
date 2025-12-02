import './globals.css';
import type { Metadata } from 'next';
import Header from '../components/Header';

export const metadata: Metadata = {
  title: 'Referral Credit System',
  description: 'First-purchase referral credits demo',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900">
        <Header />
        <div className="max-w-6xl mx-auto p-4">{children}</div>
      </body>
    </html>
  );
}
