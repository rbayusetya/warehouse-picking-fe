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
import { getState, getDealerItemsForUser } from "@/lib/mock-data";
import { isDealerItemUnconfirmed } from "@/lib/mock-data";
import { useMemo } from "react";

export default function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();

  const unconfirmedCount = useMemo(() => {
    if (!user || user.role !== "dealer" || !user.dealerCode) return 0;
    const state = getState();
    const items = getDealerItemsForUser(user, state.pickingLists);
    return items.filter((i) => isDealerItemUnconfirmed(i.item, user.dealerCode!)).length;
  }, [user]);

  if (!user) return null;

  const isActive = (path: string) => pathname.startsWith(path);

  const linkClass = (path: string) =>
    `flex w-full items-center justify-between gap-[10px] rounded-md px-[11px] py-[10px] text-left text-sm text-[var(--text-secondary)] no-underline ${
      isActive(path) ? "bg-teal-50 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300 font-semibold" : "hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:text-teal-800 dark:hover:text-teal-300"
    }`;

  return (
    <aside className="sticky top-[68px] h-[calc(100vh-92px)] overflow-auto rounded-lg border border-[var(--line)] bg-[var(--surface)] p-3">
      <nav className="flex flex-col gap-0.5">
        <Link href="/dashboard" className={linkClass("/dashboard")}>
          <span className="flex items-center gap-2">
            <LayoutDashboard size={16} />
            <span><strong>Dashboard</strong><br /><small className="text-[var(--muted)]">Ringkasan</small></span>
          </span>
          <span className="text-[var(--muted)]">&gt;</span>
        </Link>

        {(user.role === "admin" || user.role === "kepala") && (
          <Link href="/upload" className={linkClass("/upload")}>
            <span className="flex items-center gap-2">
              <Upload size={16} />
              <span><strong>Upload Excel</strong><br /><small className="text-[var(--muted)]">Import</small></span>
            </span>
            <span className="text-[var(--muted)]">&gt;</span>
          </Link>
        )}

        {(user.role === "admin" || user.role === "kepala") && (
          <Link href="/picking" className={linkClass("/picking")}>
            <span className="flex items-center gap-2">
              <ClipboardList size={16} />
              <span><strong>Picking</strong><br /><small className="text-[var(--muted)]">Checklist</small></span>
            </span>
            <span className="text-[var(--muted)]">&gt;</span>
          </Link>
        )}

        {(user.role === "admin" || user.role === "kepala") && (
          <Link href="/handover" className={linkClass("/handover")}>
            <span className="flex items-center gap-2">
              <Handshake size={16} />
              <span><strong>Serah Terima</strong><br /><small className="text-[var(--muted)]">Bukti</small></span>
            </span>
            <span className="text-[var(--muted)]">&gt;</span>
          </Link>
        )}

        {(user.role === "admin" || user.role === "kepala") && (
          <Link href="/debts" className={linkClass("/debts")}>
            <span className="flex items-center gap-2">
              <DollarSign size={16} />
              <span><strong>Hutang Barang</strong><br /><small className="text-[var(--muted)]">Rekap</small></span>
            </span>
            <span className="text-[var(--muted)]">&gt;</span>
          </Link>
        )}

        <Link href="/history" className={linkClass("/history")}>
          <span className="flex items-center gap-2">
            <History size={16} />
            <span><strong>Histori</strong><br /><small className="text-[var(--muted)]">Audit</small></span>
          </span>
          <span className="text-[var(--muted)]">&gt;</span>
        </Link>

        {user.role === "dealer" && (
          <>
            <Link href="/dealer" className={linkClass("/dealer")}>
              <span className="flex items-center gap-2">
                <Store size={16} />
                <span><strong>Barang Masuk</strong><br /><small className="text-[var(--muted)]">Konfirmasi</small></span>
              </span>
              <span className="text-[var(--muted)]">&gt;</span>
            </Link>
            {unconfirmedCount > 0 && (
              <Link
                href="/dealer?filter=pending"
                className={`${linkClass("/dealer")} border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20`}
              >
                <span className="flex items-center gap-2">
                  <AlertCircle size={16} className="text-amber-600 dark:text-amber-400" />
                  <span>
                    <strong>Belum Dikonfirmasi</strong>
                    <br />
                    <small className="text-amber-600 dark:text-amber-400">{unconfirmedCount} item</small>
                  </span>
                </span>
                <span className="text-[var(--muted)]">&gt;</span>
              </Link>
            )}
          </>
        )}
      </nav>
    </aside>
  );
}
