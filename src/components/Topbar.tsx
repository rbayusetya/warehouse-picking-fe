"use client";

import { useAuth } from "@/lib/auth-context";
import { useDarkMode } from "@/lib/dark-mode";
import { useRouter } from "next/navigation";
import { LogOut, Warehouse, Menu, X, Sun, Moon } from "lucide-react";

export default function Topbar({ onMenuToggle, menuOpen }: { onMenuToggle?: () => void; menuOpen?: boolean }) {
  const { user, logout } = useAuth();
  const { dark, toggle } = useDarkMode();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  if (!user) return null;

  return (
    <header className="sticky top-0 z-30 flex h-12 items-center justify-between gap-2 border-b border-[var(--line)] bg-[var(--surface)]/92 px-3 backdrop-blur-[14px] lg:px-4">
      <div className="flex min-w-0 items-center gap-2">
        <button
          onClick={onMenuToggle}
          className="flex lg:hidden h-7 w-7 items-center justify-center rounded-md border border-[var(--line)] text-[var(--text-secondary)] hover:bg-[var(--surface-soft)]"
          aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
        >
          {menuOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-teal-700 text-white font-bold">
          <Warehouse size={16} />
        </div>
        <h1 className="truncate text-sm font-bold text-[var(--text-primary)]">Picking Control</h1>
      </div>
      <div className="flex items-center gap-1.5">
        <button
          onClick={toggle}
          className="flex h-7 w-7 items-center justify-center rounded-md border border-[var(--line)] text-[var(--text-secondary)] hover:bg-[var(--surface-soft)]"
          aria-label={dark ? "Mode terang" : "Mode gelap"}
        >
          {dark ? <Sun size={14} /> : <Moon size={14} />}
        </button>
        <span className="hidden text-xs text-[var(--muted)] sm:block">{user.name}</span>
        <button
          onClick={handleLogout}
          className="flex h-7 items-center gap-1 rounded-md border border-[var(--line)] bg-[var(--surface)] px-2 text-xs font-bold text-[var(--text-secondary)] hover:bg-[var(--surface-soft)]"
        >
          <LogOut size={12} />
          <span className="hidden sm:inline">Keluar</span>
        </button>
      </div>
    </header>
  );
}
