"use client"

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const CloseOnAuth = () => {
  const router = useRouter();
  useEffect(() => {
    window.close();
    router.replace("/");
  }, []);
  return null;
}
