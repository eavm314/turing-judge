"use client"
import { signIn } from "@/actions/auth"
import { useSession } from "@/providers/user-provider";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { user, setOpenSignIn } = useSession();

  useEffect(() => {
    if (user) {
      setOpenSignIn(false);
      window.close();
      router.replace("/");
    } else {
      signIn(searchParams.get('provider') || 'google');
    }
  }, [user, searchParams]);

  return null;
}