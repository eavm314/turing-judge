import { Suspense } from 'react';
import type { Metadata, Viewport } from 'next';
import { Orbitron } from 'next/font/google';
import './globals.css';

import { ThemeProvider } from '@/providers/theme-provider';
import { SessionProvider } from '@/providers/user-provider';
import { auth } from '@/lib/auth';
import { ModalProvider } from '@/providers/modal-provider';
import { APP_NAME } from '@/constants/app';
import { Toaster } from '@/components/ui/toaster';

const orbitron = Orbitron({
  variable: '--font-orbitron',
  subsets: ['latin'],
  weight: ['500', '600', '700'],
});

export const metadata: Metadata = {
  title: APP_NAME,
  description: 'Automaton Designer',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  interactiveWidget: 'resizes-content',
};

async function AppSessionProvider({ children }: { children: React.ReactNode }) {
  const session = await auth();
  return <SessionProvider user={session?.user}>{children}</SessionProvider>;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${orbitron.variable} antialiased`}>
        <ThemeProvider>
          <ModalProvider>
            <Suspense fallback={null}>
              <AppSessionProvider>
                {children}
                <Toaster />
              </AppSessionProvider>
            </Suspense>
          </ModalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
