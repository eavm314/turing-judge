"use client"

import { revalidate, signOut } from "@/actions/auth"
import { Button, ButtonProps } from "@/components/ui/button"

export const SignInButton = ({ variant = "default" }: { variant?: ButtonProps["variant"] }) => {
  const handleClick = () => {
    const popup = window.open("/signin", "Sign In", "width=480,height=600,top=100,left=460");
    popup?.focus();
    const checkPopupClosed = setInterval(() => {
      if (!popup || popup.closed) {
        clearInterval(checkPopupClosed);
        revalidate();
      }
    }, 1000);
  }

  return (
    <Button variant={variant} onClick={handleClick}>Sign In</Button>
  )
}

export const SignOutButton = () => {
  return (
    <button className="w-full text-left" onClick={() => signOut()}>Log Out</button>
  )
}