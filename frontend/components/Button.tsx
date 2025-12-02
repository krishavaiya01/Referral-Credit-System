"use client";
import clsx from 'clsx';
import React from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost';
};

export default function Button({ variant = 'primary', className, ...props }: Props) {
  const base = 'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed';
  const styles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-900 text-white hover:bg-black focus:ring-gray-700',
    ghost: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-400'
  } as const;
  return <button className={clsx(base, styles[variant], className)} {...props} />;
}
