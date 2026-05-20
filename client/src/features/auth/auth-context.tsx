"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/types";

type AuthContextValue = {
  user: User | null;
  token: string | null;
  isReady: boolean;
  signIn: (token: string, user: User) => void;
  signOut: () => void;
};

const AuthContext =
  createContext<AuthContextValue | null>(null);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    null
  );
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const storedToken =
      localStorage.getItem("verisure_token");
    const storedUser =
      localStorage.getItem("verisure_user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setIsReady(true);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isReady,
      signIn(nextToken: string, nextUser: User) {
        localStorage.setItem(
          "verisure_token",
          nextToken
        );
        localStorage.setItem(
          "verisure_user",
          JSON.stringify(nextUser)
        );
        setToken(nextToken);
        setUser(nextUser);
        router.replace("/dashboard");
      },
      signOut() {
        localStorage.removeItem("verisure_token");
        localStorage.removeItem("verisure_user");
        setToken(null);
        setUser(null);
        router.replace("/login");
      },
    }),
    [isReady, router, token, user]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }
  return context;
}
