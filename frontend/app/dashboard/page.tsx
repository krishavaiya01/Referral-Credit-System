"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../../src/lib/api';
import { useAuthStore, loadFromStorage } from '../../src/store/useAuthStore';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

function StatCard({ label, value }: { label: string; value: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, latest => Math.round(latest));
  useEffect(() => {
    const controls = animate(count, value, { duration: 1.2 });
    return controls.stop;
  }, [value]);
  return (
    <Card className="p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <motion.p className="text-2xl font-semibold" aria-label={`${label}: ${value}`}>
        {rounded}
      </motion.p>
    </Card>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const logout = useAuthStore((s) => s.logout);
  const [stats, setStats] = useState<{ totalCredits: number; referredUsers: number; convertedUsers: number; referralCode: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadFromStorage(); }, []);
  useEffect(() => {
    if (!token) return;
    apiFetch('/dashboard')
      .then(setStats)
      .catch((e) => setError(e.message));
  }, [token]);

  useEffect(() => {
    if (!token) router.replace('/login');
  }, [token, router]);

  const copyLink = async () => {
    if (!stats) return;
    const url = `${window.location.origin}/register?r=${stats.referralCode}`;
    await navigator.clipboard.writeText(url);
    alert('Referral link copied!');
  };

  if (!token) return null;

  return (
    <main className="py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => router.push('/purchase')}>Purchase</Button>
          <Button variant="secondary" onClick={logout}>Logout</Button>
        </div>
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Credits" value={stats?.totalCredits || 0} />
        <StatCard label="Referred Users" value={stats?.referredUsers || 0} />
        <StatCard label="Converted Users" value={stats?.convertedUsers || 0} />
      </div>
      <Card className="p-4">
        <p className="text-sm text-gray-600 mb-2">Referral Link</p>
        <div className="flex gap-2 items-center">
          <input readOnly className="flex-1 border rounded px-3 py-2" value={stats ? `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/register?r=${stats.referralCode}` : ''} />
          <Button onClick={copyLink}>Copy</Button>
        </div>
      </Card>
    </main>
  );
}
