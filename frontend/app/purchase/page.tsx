"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../../src/lib/api';
import { loadFromStorage, useAuthStore } from '../../src/store/useAuthStore';
import Card from '../../components/Card';
import Button from '../../components/Button';

export default function PurchasePage() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadFromStorage(); }, []);
  useEffect(() => { if (!token) router.replace('/login'); }, [token, router]);

  const buy = async () => {
    setLoading(true); setMessage(null); setError(null);
    try {
      const res = await apiFetch('/purchase', { method: 'POST' });
      setMessage('Purchase Complete! You earned credits.');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) return null;

  return (
    <main className="max-w-lg mx-auto py-10 space-y-4">
      <h1 className="text-2xl font-semibold">Purchase Simulation</h1>
      <Card className="p-4 flex items-center justify-between">
        <div>
          <p className="font-medium">Pro Plan</p>
          <p className="text-gray-600 text-sm">One-time purchase (simulated)</p>
        </div>
        <p className="text-lg font-semibold">$10</p>
      </Card>
      {message && <p className="text-green-700">{message}</p>}
      {error && <p className="text-red-600">{error}</p>}
      <div className="flex gap-2">
        <Button onClick={buy} disabled={loading} className="bg-green-600 hover:bg-green-700">{loading ? 'Processing...' : 'Buy Now'}</Button>
        <Button variant="ghost" onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
      </div>
    </main>
  );
}
