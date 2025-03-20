"use server"

import { auth, signIn, signOut } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export { auth, signIn, signOut };

export const revalidate = async () => {
  revalidatePath("/");
}