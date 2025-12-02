"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '../src/store/useAuthStore';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, logout } = useAuthStore();

  const NavLink = ({ href, label }: { href: string; label: string }) => (
    <Link href={href} className={`px-3 py-1.5 rounded-md text-sm ${pathname === href ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-200'}`}>
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/80 border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight text-lg">Referral Credits</Link>
        <nav className="flex items-center gap-2">
          <NavLink href="/" label="Home" />
          {!isAuthenticated && <>
            <NavLink href="/register" label="Register" />
            <NavLink href="/login" label="Login" />
          </>}
          {isAuthenticated && <>
            <NavLink href="/dashboard" label="Dashboard" />
            <NavLink href="/purchase" label="Purchase" />
            <button onClick={logout} className="px-3 py-1.5 rounded-md text-sm bg-red-600 text-white hover:bg-red-700">Logout</button>
          </>}
        </nav>
      </div>
    </header>
  );
}
