"use client"

import { type User } from "next-auth";
import { createContext, useContext, useRef } from "react";

export const UserContext = createContext<User | undefined>(undefined);

interface EditorProviderProps {
  children: React.ReactNode,
  user?: User,
};

export const SessionProvider = ({ children, user }: EditorProviderProps) => {
  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  )
}

export const useSession = () => useContext(UserContext);