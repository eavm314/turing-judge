import { revalidateAll, signOut } from "@/actions/auth"

export const handleSignIn = () => {
  return new Promise((resolve, reject) => {
    try {
      const popup = window.open("/signin", "Sign In", "width=480,height=600,top=100,left=460");
      popup?.focus();
      const checkPopupClosed = setInterval(() => {
        if (!popup || popup.closed) {
          clearInterval(checkPopupClosed);
          revalidateAll();
          resolve(0);
        }
      }, 500);
    } catch (error) {
      console.error("Error opening sign-in popup:", error);
      reject(error);
    }
  });
}

export const handleSignOut = () => signOut({redirectTo: "/"});