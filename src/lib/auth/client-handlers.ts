import { revalidate, signOut } from "@/actions/auth"

export const handleSignIn = () => {
  const popup = window.open("/signin", "Sign In", "width=480,height=600,top=100,left=460");
  popup?.focus();
  const checkPopupClosed = setInterval(() => {
    if (!popup || popup.closed) {
      clearInterval(checkPopupClosed);
      revalidate();
    }
  }, 1000);
}

export const handleSignOut = () => signOut();