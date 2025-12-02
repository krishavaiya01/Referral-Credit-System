"use client";
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { apiFetch } from '../../src/lib/api';
import { useAuthStore } from '../../src/store/useAuthStore';
import Card from '../../components/Card';
import Button from '../../components/Button';

function RegisterForm() {
  const params = useSearchParams();
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const r = params.get('r');
    if (r) setReferralCode(r);
  }, [params]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      const data = await apiFetch('/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, username, referralCode: referralCode || undefined })
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
    <Card className="p-6">
      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="block text-sm mb-1">Username</label>
          <input className="w-full border rounded px-3 py-2" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="yourname" />
        </div>
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input type="email" className="w-full border rounded px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input type="password" className="w-full border rounded px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm mb-1">Referral Code (optional)</label>
          <input className="w-full border rounded px-3 py-2" value={referralCode} onChange={(e) => setReferralCode(e.target.value)} placeholder="ABC123" />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full">{loading ? 'Creating...' : 'Register'}</Button>
      </form>
    </Card>
  );
}

export default function RegisterPage() {
  return (
    <main className="max-w-md mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-6">Create Account</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <RegisterForm />
      </Suspense>
    </main>
  );
}
