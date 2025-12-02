export function generateReferralCode(seed: string) {
  const base = seed.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 6);
  const rand = Math.random().toString(36).slice(2, 6);
  return (base || 'user') + rand;
}
