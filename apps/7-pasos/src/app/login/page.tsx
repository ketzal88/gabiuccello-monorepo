"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { LoginForm } from "@/components/auth/login-form";
import Link from "next/link";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="w-10 h-10 border-3 border-victoria-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col">
      <header className="p-6">
        <Link href="/" className="text-xl font-display font-bold text-stone-900">
          7 Pasos
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 pb-12">
        <LoginForm />
      </main>
    </div>
  );
}
