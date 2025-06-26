import type { Metadata } from 'next';
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${orbitron.variable} antialiased`}>
        <ThemeProvider>
          <ModalProvider>
            <SessionProvider user={session?.user}>
              {children}
              <Toaster />
            </SessionProvider>
          </ModalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
