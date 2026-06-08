import RegisterForm from '@/components/auth/RegisterForm';
import PetalBackground from '@/components/floral/PetalBackground';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Join Kloset — Create Your Account',
  description:
    'Create a Kloset account to rent designer outfits or list your wardrobe for rental income.',
};

export default function RegisterPage() {
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
        <RegisterForm />
      </div>
    </>
  );
}
