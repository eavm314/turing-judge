'use client';

import { SignInModal } from '@/components/auth/signin-modal';
import { type User } from 'next-auth';
import { createContext, useContext, useEffect, useState } from 'react';

interface UserContextType {
  user?: User;
  openSignIn: boolean;
  setOpenSignIn: (open: boolean) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

interface SessionProviderProps {
  children: React.ReactNode;
  user?: User;
}

export const SessionProvider = ({ children, user }: SessionProviderProps) => {
  const [openSignIn, setOpenSignIn] = useState(false);

  useEffect(() => {
    if (user) {
      setOpenSignIn(false);
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, openSignIn, setOpenSignIn }}>
      {children}
      <SignInModal />
    </UserContext.Provider>
  );
};

export function useSession() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a UserContext');
  }
  return context;
}
