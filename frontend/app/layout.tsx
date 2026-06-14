import type { Metadata } from 'next';
import './globals.css';
import GoogleProvider from '@/components/providers/GoogleProvider';
import PostHogProvider from '@/components/providers/PostHogProvider';
import AppShell from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'Kloset Luxe — Luxury Fashion Rental Studio',
  description: 'Rent premium wedding wear, designer sarees, sherwanis, and bridal couture across India.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Dynamic Editorial Web Fonts */}
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased min-h-screen bg-ivory text-charcoal font-sans">
        <PostHogProvider>
          <GoogleProvider>
            <AppShell>
              {children}
            </AppShell>
          </GoogleProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
