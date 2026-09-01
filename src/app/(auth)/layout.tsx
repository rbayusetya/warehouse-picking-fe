"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/providers/auth-context";
import Topbar from "@/components/Topbar";
import Sidebar from "@/components/Sidebar";
import {
  LayoutDashboard,
  Upload,
  ClipboardList,
  Handshake,
  DollarSign,
  History,
  Store,
  Warehouse,
} from "lucide-react";

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const closeMenu = () => setMenuOpen(false);

  if (isLoading) return null;
  if (!user) return null;

  const isActive = (path: string) => pathname.startsWith(path);

  const linkClass = (path: string) =>
    `flex w-full items-center justify-between gap-[10px] rounded-md px-[11px] py-[10px] text-left text-sm text-[var(--text-secondary)] no-underline ${
      isActive(path) ? "bg-teal-50 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300 font-semibold" : "hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:text-teal-800 dark:hover:text-teal-300"
    }`;

  return (
    <div className="min-h-screen">
      <Topbar onMenuToggle={() => setMenuOpen((v) => !v)} menuOpen={menuOpen} />

      {/* Mobile slide-over drawer */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 lg:hidden ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/40"
          onClick={closeMenu}
        />
        <aside
          className={`absolute left-0 top-0 h-full w-[280px] bg-[var(--surface)] shadow-xl transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-12 items-center gap-2 border-b border-[var(--line)] px-3">
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-teal-700 text-white font-bold">
              <Warehouse size={16} />
            </div>
            <div className="text-xs font-bold text-[var(--text-primary)]">Picking Control</div>
          </div>
          <nav className="flex flex-col gap-0.5 overflow-y-auto p-3" style={{ height: "calc(100% - 48px)" }}>
            <Link href="/dashboard" className={linkClass("/dashboard")} onClick={closeMenu}>
              <span className="flex items-center gap-2">
                <LayoutDashboard size={16} />
                <span><strong>Dashboard</strong><br /><small className="text-[var(--muted)]">Ringkasan</small></span>
              </span>
              <span className="text-[var(--muted)]">&gt;</span>
            </Link>

            {(user.role === "admin" || user.role === "kepala") && (
              <Link href="/upload" className={linkClass("/upload")} onClick={closeMenu}>
                <span className="flex items-center gap-2">
                  <Upload size={16} />
                  <span><strong>Upload Excel</strong><br /><small className="text-[var(--muted)]">Import</small></span>
                </span>
                <span className="text-[var(--muted)]">&gt;</span>
              </Link>
            )}

            {(user.role === "admin" || user.role === "kepala") && (
              <Link href="/picking" className={linkClass("/picking")} onClick={closeMenu}>
                <span className="flex items-center gap-2">
                  <ClipboardList size={16} />
                  <span><strong>Picking</strong><br /><small className="text-[var(--muted)]">Checklist</small></span>
                </span>
                <span className="text-[var(--muted)]">&gt;</span>
              </Link>
            )}

            {(user.role === "admin" || user.role === "kepala") && (
              <Link href="/handover" className={linkClass("/handover")} onClick={closeMenu}>
                <span className="flex items-center gap-2">
                  <Handshake size={16} />
                  <span><strong>Serah Terima</strong><br /><small className="text-[var(--muted)]">Bukti</small></span>
                </span>
                <span className="text-[var(--muted)]">&gt;</span>
              </Link>
            )}

            {(user.role === "admin" || user.role === "kepala") && (
              <Link href="/debts" className={linkClass("/debts")} onClick={closeMenu}>
                <span className="flex items-center gap-2">
                  <DollarSign size={16} />
                  <span><strong>Hutang Barang</strong><br /><small className="text-[var(--muted)]">Rekap</small></span>
                </span>
                <span className="text-[var(--muted)]">&gt;</span>
              </Link>
            )}

            <Link href="/history" className={linkClass("/history")} onClick={closeMenu}>
              <span className="flex items-center gap-2">
                <History size={16} />
                <span><strong>Histori</strong><br /><small className="text-[var(--muted)]">Audit</small></span>
              </span>
              <span className="text-[var(--muted)]">&gt;</span>
            </Link>

            {user.role === "dealer" && (
              <Link href="/dealer" className={linkClass("/dealer")} onClick={closeMenu}>
                <span className="flex items-center gap-2">
                  <Store size={16} />
                  <span><strong>Barang Masuk</strong><br /><small className="text-[var(--muted)]">Konfirmasi</small></span>
                </span>
                <span className="text-[var(--muted)]">&gt;</span>
              </Link>
            )}
          </nav>
        </aside>
      </div>

      <div className="grid grid-cols-[260px_1fr] gap-5 px-6 pb-8 pt-5 max-lg:grid-cols-1">
        <div className="max-lg:hidden">
          <Sidebar />
        </div>
        <main className="min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
