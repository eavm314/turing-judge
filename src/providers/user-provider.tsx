"use client"

import { type User } from "next-auth";
import { createContext, useContext } from "react";

export const UserContext = createContext<User | undefined>(undefined);

interface SessionProviderProps {
  children: React.ReactNode,
  user?: User,
};

export const SessionProvider = ({ children, user }: SessionProviderProps) => {
  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  )
}

export const useSession = () => useContext(UserContext);