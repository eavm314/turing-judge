import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (session?.user?.role !== "EDITOR") {
    notFound();
  }

  return children;
}
