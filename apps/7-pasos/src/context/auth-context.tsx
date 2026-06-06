"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUserProfile, createUserProfile, type UserProfile } from "@/lib/firestore";
import { cacheGet, cacheSet, cacheInvalidate, cacheInvalidateAll, cacheKey, TTL } from "@/lib/cache";

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    if (user) {
      cacheInvalidate(cacheKey.profile(user.uid));
      const p = await getUserProfile(user.uid);
      if (p) cacheSet(cacheKey.profile(user.uid), p, TTL.PROFILE);
      setProfile(p);
    }
  };

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const uid = firebaseUser.uid;

        // Try cache first for instant UI
        const cached = cacheGet<UserProfile>(cacheKey.profile(uid));
        if (cached) {
          setProfile(cached);
          setLoading(false);
        }

        // createUserProfile returns the profile (1 read instead of 2)
        const p = await createUserProfile(firebaseUser);
        cacheSet(cacheKey.profile(uid), p, TTL.PROFILE);
        setProfile(p);
      } else {
        setProfile(null);
        cacheInvalidateAll();
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
