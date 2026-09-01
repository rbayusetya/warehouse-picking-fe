"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/providers/auth-context";

export default function LoginForm() {
  const { user, login, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/dashboard");
    }
  }, [user, isLoading, router]);

  if (isLoading) return null;
  if (user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password.trim()) {
      setError("Username dan password wajib diisi.");
      return;
    }
    const ok = await login(username.trim(), password);
    if (!ok) {
      setError("Username atau password salah.");
      return;
    }
    const redirectTo = searchParams.get("redirect") || "/dashboard";
    router.replace(redirectTo);
  };

  return (
    <div className="login-bg flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-[440px] rounded-lg border border-[var(--line)] bg-[var(--surface)] p-6 shadow-lg">
        <div className="mb-[18px] h-1.5 w-[54px] rounded-full bg-teal-700" />
        <h1 className="mb-2 text-2xl font-bold text-[var(--text-primary)]">Picking Control Gudang</h1>
        <p className="mb-5 leading-relaxed text-[var(--muted)]">
          Masuk sebagai admin gudang, kepala gudang, pengurus ekspedisi, atau dealer.
        </p>
        {error && (
          <div className="mb-4 rounded-lg border border-[#fecdca] bg-[#fff1f0] px-4 py-3 text-sm text-[#7a271a]">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-[7px]">
            <label className="text-[13px] font-bold text-[var(--text-secondary)]">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-md border border-[var(--line)] px-[11px] py-[10px] text-[var(--text-primary)]"
              placeholder="admin / kepala / tunas / jagat / dealer-lecf / dealer-lech / dealer-kcey"
              autoComplete="username"
            />
          </div>
          <div className="grid gap-[7px]">
            <label className="text-[13px] font-bold text-[var(--text-secondary)]">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-[var(--line)] px-[11px] py-[10px] text-[var(--text-primary)]"
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-teal-700 px-[13px] py-[9px] font-bold text-white hover:bg-teal-800"
          >
            Masuk
          </button>
        </form>
        <div className="mt-4 text-xs text-[var(--muted)]">
          <p className="mb-1 font-semibold">Test accounts:</p>
          <p>admin/admin123 | kepala/kepala123 | tunas/tunas123</p>
          <p>jagat/jagat123 | dealer-lecf/lecf123 | dealer-lech/lech123 | dealer-kcey/kcey123</p>
        </div>
      </div>
    </div>
  );
}
