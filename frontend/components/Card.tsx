import React from 'react';

export default function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`group rounded-lg border border-gray-200 bg-white/90 shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5 ${className}`}>
      {children}
    </div>
  );
}
