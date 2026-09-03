"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/providers/auth-context";
import {
  LayoutDashboard,
  Upload,
  ClipboardList,
  Handshake,
  DollarSign,
  History,
  Store,
  AlertCircle,
} from "lucide-react";

interface NavLinksProps {
  onNavigate?: () => void;
  unconfirmedCount?: number;
}

function NavSection({ label }: { label: string }) {
  return (
    <span className="mt-3 mb-1 block px-[11px] text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
      {label}
    </span>
  );
}

export default function NavLinks({ onNavigate, unconfirmedCount = 0 }: NavLinksProps) {
  const { user } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const isActive = (path: string) => pathname.startsWith(path);

  const linkClass = (path: string, exact = false) =>
    `flex w-full items-center justify-between gap-[10px] rounded-md px-[11px] py-[10px] text-left text-sm text-[var(--text-secondary)] no-underline ${
      (exact ? pathname === path : isActive(path))
        ? "bg-teal-50 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300 font-semibold"
        : "hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:text-teal-800 dark:hover:text-teal-300"
    }`;

  const chevron = <span className="text-[var(--muted)]">&gt;</span>;

  const isAdmin = user.role === "admin" || user.role === "kepala";

  return (
    <nav className="flex flex-col gap-0.5">
      {/* ── Overview ── */}
      <Link href="/dashboard" className={linkClass("/dashboard", true)} onClick={onNavigate}>
        <span className="flex items-center gap-2">
          <LayoutDashboard size={16} />
          <span>
            <strong>Dashboard</strong>
            <br />
            <small className="text-[var(--muted)]">Ringkasan</small>
          </span>
        </span>
        {chevron}
      </Link>

      {/* ── Picking Flow ── */}
      {isAdmin && (
        <>
          <NavSection label="Picking" />
          <Link href="/picking" className={linkClass("/picking", true)} onClick={onNavigate}>
            <span className="flex items-center gap-2">
              <ClipboardList size={16} />
              <span>
                <strong>Picking</strong>
                <br />
                <small className="text-[var(--muted)]">Checklist</small>
              </span>
            </span>
            {chevron}
          </Link>

          <Link href="/upload" className={linkClass("/upload", true)} onClick={onNavigate}>
            <span className="flex items-center gap-2">
              <Upload size={16} />
              <span>
                <strong>Upload Excel</strong>
                <br />
                <small className="text-[var(--muted)]">Import Data</small>
              </span>
            </span>
            {chevron}
          </Link>
        </>
      )}

      {/* ── Operations ── */}
      {isAdmin && (
        <>
          <NavSection label="Operasional" />
          <Link href="/handover" className={linkClass("/handover", true)} onClick={onNavigate}>
            <span className="flex items-center gap-2">
              <Handshake size={16} />
              <span>
                <strong>Serah Terima</strong>
                <br />
                <small className="text-[var(--muted)]">Bukti</small>
              </span>
            </span>
            {chevron}
          </Link>

          <Link href="/debts" className={linkClass("/debts", true)} onClick={onNavigate}>
            <span className="flex items-center gap-2">
              <DollarSign size={16} />
              <span>
                <strong>Hutang Barang</strong>
                <br />
                <small className="text-[var(--muted)]">Rekap</small>
              </span>
            </span>
            {chevron}
          </Link>
        </>
      )}

      {/* ── Audit ── */}
      <Link href="/history" className={linkClass("/history", true)} onClick={onNavigate}>
        <span className="flex items-center gap-2">
          <History size={16} />
          <span>
            <strong>Histori</strong>
            <br />
            <small className="text-[var(--muted)]">Audit</small>
          </span>
        </span>
        {chevron}
      </Link>

      {/* ── Dealer ── */}
      {user.role === "dealer" && (
        <>
          <NavSection label="Dealer" />
          <Link href="/dealer" className={linkClass("/dealer", true)} onClick={onNavigate}>
            <span className="flex items-center gap-2">
              <Store size={16} />
              <span>
                <strong>Barang Masuk</strong>
                <br />
                <small className="text-[var(--muted)]">Konfirmasi</small>
              </span>
            </span>
            {chevron}
          </Link>
          {unconfirmedCount > 0 && (
            <Link
              href="/dealer?filter=pending"
              className={`${linkClass("/dealer")} border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20`}
              onClick={onNavigate}
            >
              <span className="flex items-center gap-2">
                <AlertCircle size={16} className="text-amber-600 dark:text-amber-400" />
                <span>
                  <strong>Belum Dikonfirmasi</strong>
                  <br />
                  <small className="text-amber-600 dark:text-amber-400">
                    {unconfirmedCount} item
                  </small>
                </span>
              </span>
              {chevron}
            </Link>
          )}
        </>
      )}
    </nav>
  );
}
