import Link from 'next/link';
import Card from '../components/Card';
import Button from '../components/Button';

export default function HomePage() {
  return (
    <main className="py-16">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Earn Credits by Sharing</h1>
        <p className="text-gray-600 mb-8">Refer friends, and when they make their first purchase, both of you earn credits. Simple and fair.</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/register"><Button variant="primary">Create Account</Button></Link>
          <Link href="/login"><Button variant="secondary">Login</Button></Link>
          <Link href="/dashboard"><Button variant="ghost">View Dashboard</Button></Link>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
        <Card className="p-5"><h3 className="font-semibold mb-1">1. Share</h3><p className="text-sm text-gray-600">Send your unique referral link to a friend.</p></Card>
        <Card className="p-5"><h3 className="font-semibold mb-1">2. Purchase</h3><p className="text-sm text-gray-600">Your friend completes their first purchase.</p></Card>
        <Card className="p-5"><h3 className="font-semibold mb-1">3. Earn</h3><p className="text-sm text-gray-600">Both accounts get +2 credits instantly.</p></Card>
      </div>
    </main>
  );
}
