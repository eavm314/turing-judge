import { CloseOnAuth } from "@/components/auth/close-on-auth";
import { auth } from "@/lib/auth";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (session) return <CloseOnAuth />;
  
  return children;
}