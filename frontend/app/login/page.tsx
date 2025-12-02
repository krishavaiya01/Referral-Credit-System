"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../../src/lib/api';
import { useAuthStore } from '../../src/store/useAuthStore';
import Card from '../../components/Card';
import Button from '../../components/Button';

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      const data = await apiFetch('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      login({ token: data.token, user: data.user });
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-6">Login</h1>
      <Card className="p-6">
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input type="email" className="w-full border rounded px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input type="password" className="w-full border rounded px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <Button type="submit" variant="secondary" className="w-full">{loading ? 'Signing in...' : 'Login'}</Button>
        </form>
      </Card>
    </main>
  );
}
