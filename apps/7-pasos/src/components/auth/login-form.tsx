"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from "@/lib/auth";

export function LoginForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password, name);
      } else {
        await signInWithEmail(email, password);
      }
      router.push("/dashboard");
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code || "";
      if (code === "auth/user-not-found" || code === "auth/wrong-password" || code === "auth/invalid-credential") {
        setError("Email o contraseña incorrectos");
      } else if (code === "auth/email-already-in-use") {
        setError("Este email ya está registrado");
      } else if (code === "auth/weak-password") {
        setError("La contraseña debe tener al menos 6 caracteres");
      } else {
        setError("Ocurrió un error. Intentá de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithGoogle();
      router.push("/dashboard");
    } catch {
      setError("Error al iniciar sesión con Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-display font-bold text-stone-900 mb-2">
          {isSignUp ? "Creá tu cuenta" : "Bienvenido de vuelta"}
        </h1>
        <p className="text-stone-500">
          {isSignUp
            ? "Empezá tu transformación de 180 días"
            : "Continuá tu camino de 180 días"}
        </p>
      </div>

      <button
        onClick={handleGoogleAuth}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-700 font-medium hover:bg-stone-50 hover:border-stone-300 transition-all duration-200 mb-6 disabled:opacity-50"
      >
        <svg width="20" height="20" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Continuar con Google
      </button>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-stone-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-cream-50 text-stone-400">o</span>
        </div>
      </div>

      <form onSubmit={handleEmailAuth} className="space-y-4">
        {isSignUp && (
          <Input
            label="Nombre"
            type="text"
            placeholder="Tu nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
        <Input
          label="Email"
          type="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />

        {error && (
          <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-lg">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading
            ? "Cargando..."
            : isSignUp
            ? "Crear cuenta"
            : "Iniciar sesión"}
        </Button>
      </form>

      <p className="text-center text-sm text-stone-500 mt-6">
        {isSignUp ? "¿Ya tenés cuenta?" : "¿No tenés cuenta?"}{" "}
        <button
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError("");
          }}
          className="text-victoria-600 font-medium hover:text-victoria-700 transition-colors"
        >
          {isSignUp ? "Iniciá sesión" : "Registrate"}
        </button>
      </p>
    </div>
  );
}
