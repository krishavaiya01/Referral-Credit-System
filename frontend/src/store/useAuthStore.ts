"use client";
import { create } from 'zustand';

type User = {
  id: string;
  email: string;
  username: string;
  referralCode: string;
  credits: number;
  hasPurchased: boolean;
};

type State = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (payload: { token: string; user: User }) => void;
  logout: () => void;
};

export const useAuthStore = create<State>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  login: ({ token, user }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ token, user, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ token: null, user: null, isAuthenticated: false });
  },
}));

export function loadFromStorage() {
  if (typeof window === 'undefined') return;
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  if (token && userStr) {
    const user = JSON.parse(userStr) as User;
    useAuthStore.setState({ token, user, isAuthenticated: true });
  }
}
