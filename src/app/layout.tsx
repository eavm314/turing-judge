import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/providers/theme-provider"
import { SessionProvider } from "@/providers/user-provider";
import { auth } from "@/lib/auth";
import { ModalProvider } from "@/providers/modal-provider";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "TuringProject",
  description: "Automaton Designer",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${roboto.variable} antialiased`}
      >
        <ThemeProvider>
          <ModalProvider>
            <SessionProvider user={session?.user}>
              {children}
            </SessionProvider>
          </ModalProvider>
        </ThemeProvider>
      </body>
    </html >
  );
}
