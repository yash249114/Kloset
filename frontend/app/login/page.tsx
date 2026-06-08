import LoginForm from '@/components/auth/LoginForm';
import PetalBackground from '@/components/floral/PetalBackground';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In — Kloset',
  description: 'Sign in to your Kloset account to browse and rent designer outfits.',
};

export default function LoginPage() {
  return (
    <>
      <PetalBackground />
      <div
        className="min-h-[calc(100vh-var(--nav-height))] flex items-center justify-center py-12 px-6 relative z-10"
        style={{
          background:
            'radial-gradient(ellipse at 50% 30%, rgba(249,232,232,0.6) 0%, transparent 60%)',
        }}
      >
        <LoginForm />
      </div>
    </>
  );
}
