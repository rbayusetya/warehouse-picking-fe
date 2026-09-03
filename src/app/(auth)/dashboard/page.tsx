"use client";

import { useState, useMemo, useEffect } from "react";
import { fetchDashboardStats, fetchPickingLists, fetchDealerItems } from "@/lib/api";
import type { DashboardStats } from "@/lib/api/picking";
import type { PickingList } from "@/lib/types";
import type { DealerItemEntry } from "@/lib/api/dealer";
import FilterBar from "@/components/FilterBar";
import StatCard from "@/components/StatCard";
import { useAuth } from "@/lib/providers/auth-context";
import {
  ClipboardList,
  Package,
  Truck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

// ---- Expedition / Driver breakdown types ----

interface ExpeditionRow {
  expedition: string;
  total: number;
  draft: number;
  picked: number;
  handover: number;
}

interface DriverRow {
  driver: string;
  expedition: string;
  total: number;
  draft: number;
  picked: number;
  handover: number;
}

interface ActivityEntry {
  at: string;
  by: string;
  text: string;
  pickingId: string;
}

// ---- Sub-components ----

function BreakdownTable({
  title,
  icon: Icon,
  rows,
  getName,
  linkHref,
}: {
  title: string;
  icon: React.ElementType;
  rows: (ExpeditionRow | DriverRow)[];
  getName: (row: ExpeditionRow | DriverRow) => string;
  linkHref: string;
}) {
  if (rows.length === 0) {
    return (
      <div className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-4">
        <div className="mb-3 flex items-center gap-2">
          <Icon size={16} className="text-[var(--muted)]" />
          <h3 className="m-0 text-sm font-bold">{title}</h3>
        </div>
        <p className="m-0 text-sm text-[var(--muted)]">Tidak ada data.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon size={16} className="text-[var(--muted)]" />
          <h3 className="m-0 text-sm font-bold">{title}</h3>
        </div>
        <Link
          href={linkHref}
          className="flex items-center gap-1 text-xs font-semibold text-teal-700 dark:text-teal-400 no-underline hover:underline"
        >
          Lihat semua <ArrowRight size={12} />
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-[var(--line)]">
              <th className="px-2 py-1.5 text-left font-semibold text-[var(--muted)]">
                {rows.length > 0 && "driver" in rows[0] ? "Driver" : "Ekspedisi"}
              </th>
              <th className="px-2 py-1.5 text-center font-semibold text-[var(--muted)]">Total</th>
              <th className="px-2 py-1.5 text-center font-semibold text-amber-600">Draft</th>
              <th className="px-2 py-1.5 text-center font-semibold text-blue-600">Picked</th>
              <th className="px-2 py-1.5 text-center font-semibold text-green-600">Selesai</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const name = getName(row);
              return (
                <tr key={name} className="border-b border-[var(--line)] last:border-b-0">
                  <td className="px-2 py-1.5 font-medium">{name}</td>
                  <td className="px-2 py-1.5 text-center font-bold">{row.total}</td>
                  <td className="px-2 py-1.5 text-center">
                    {row.draft > 0 ? (
                      <span className="inline-block rounded-full bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
                        {row.draft}
                      </span>
                    ) : (
                      <span className="text-[var(--muted)]">-</span>
                    )}
                  </td>
                  <td className="px-2 py-1.5 text-center">
                    {row.picked > 0 ? (
                      <span className="inline-block rounded-full bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:text-blue-400">
                        {row.picked}
                      </span>
                    ) : (
                      <span className="text-[var(--muted)]">-</span>
                    )}
                  </td>
                  <td className="px-2 py-1.5 text-center">
                    {row.handover > 0 ? (
                      <span className="inline-block rounded-full bg-green-100 dark:bg-green-900/30 px-2 py-0.5 text-xs font-semibold text-green-700 dark:text-green-400">
                        {row.handover}
                      </span>
                    ) : (
                      <span className="text-[var(--muted)]">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ActivityFeed({ entries }: { entries: ActivityEntry[] }) {
  if (entries.length === 0) {
    return (
      <div className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-4">
        <div className="mb-3 flex items-center gap-2">
          <Clock size={16} className="text-[var(--muted)]" />
          <h3 className="m-0 text-sm font-bold">Aktivitas Terbaru</h3>
        </div>
        <p className="m-0 text-sm text-[var(--muted)]">Belum ada aktivitas.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-4">
      <div className="mb-3 flex items-center gap-2">
        <Clock size={16} className="text-[var(--muted)]" />
        <h3 className="m-0 text-sm font-bold">Aktivitas Terbaru</h3>
      </div>
      <div className="space-y-0">
        {entries.map((entry, i) => (
          <div
            key={`${entry.pickingId}-${i}`}
            className="flex gap-3 border-b border-[var(--line)] py-2.5 last:border-b-0"
          >
            <div className="flex-shrink-0 pt-0.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/40">
                <span className="text-[10px] font-bold text-teal-700 dark:text-teal-400">
                  {entry.by?.charAt(0)?.toUpperCase() || "?"}
                </span>
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="m-0 text-sm leading-tight">{entry.text}</p>
              <div className="mt-0.5 flex items-center gap-2 text-[11px] text-[var(--muted)]">
                <span>{entry.by}</span>
                <span>·</span>
                <span>{entry.at}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DealerSummary({ items }: { items: DealerItemEntry[] }) {
  const pending = items.filter((i) => !i.confirmation_status || i.confirmation_status === "pending").length;
  const match = items.filter((i) => i.confirmation_status === "match").length;
  const shortage = items.filter((i) => i.confirmation_status === "shortage").length;
  const excess = items.filter((i) => i.confirmation_status === "excess").length;
  const total = items.length;

  if (total === 0) return null;

  return (
    <div className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package size={16} className="text-[var(--muted)]" />
          <h3 className="m-0 text-sm font-bold">Status Konfirmasi Dealer</h3>
        </div>
        <Link
          href="/dealer"
          className="flex items-center gap-1 text-xs font-semibold text-teal-700 dark:text-teal-400 no-underline hover:underline"
        >
          Lihat semua <ArrowRight size={12} />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-md bg-[var(--surface-soft)] p-2.5 text-center">
          <span className="block text-[11px] font-semibold text-[var(--muted)]">Belum Dicek</span>
          <span className="mt-1 block text-xl font-bold text-amber-600">{pending}</span>
        </div>
        <div className="rounded-md bg-[var(--surface-soft)] p-2.5 text-center">
          <span className="block text-[11px] font-semibold text-[var(--muted)]">Cocok</span>
          <span className="mt-1 block text-xl font-bold text-green-600">{match}</span>
        </div>
        <div className="rounded-md bg-[var(--surface-soft)] p-2.5 text-center">
          <span className="block text-[11px] font-semibold text-[var(--muted)]">Kurang</span>
          <span className="mt-1 block text-xl font-bold text-red-600">{shortage}</span>
        </div>
        <div className="rounded-md bg-[var(--surface-soft)] p-2.5 text-center">
          <span className="block text-[11px] font-semibold text-[var(--muted)]">Lebih</span>
          <span className="mt-1 block text-xl font-bold text-blue-600">{excess}</span>
        </div>
      </div>
    </div>
  );
}

// ---- Main page ----

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [lists, setLists] = useState<PickingList[]>([]);
  const [dealerItems, setDealerItems] = useState<DealerItemEntry[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const isAdmin = user?.role === "admin" || user?.role === "kepala";

    Promise.all([
      fetchDashboardStats(),
      fetchPickingLists(),
      isAdmin ? fetchDealerItems() : Promise.resolve([]),
    ])
      .then(([s, l, d]) => {
        setStats(s);
        setLists(l);
        setDealerItems(d);
      })
      .catch((e) => setError(e.message));
  }, [user]);

  const [filters, setFilters] = useState<Record<string, string>>({
    date: "",
    driver: "",
    expedition: "",
  });

  const dates = useMemo(() => [...new Set(lists.map((l) => l.date))].sort(), [lists]);
  const drivers = useMemo(() => [...new Set(lists.map((l) => l.driver))].sort(), [lists]);
  const expeditions = useMemo(() => [...new Set(lists.map((l) => l.expedition))].sort(), [lists]);

  const filtered = useMemo(() => {
    return lists.filter((row) => {
      if (filters.date && row.date !== filters.date) return false;
      if (filters.driver && row.driver !== filters.driver) return false;
      if (filters.expedition && row.expedition !== filters.expedition) return false;
      return true;
    });
  }, [lists, filters]);

  // Expedition breakdown
  const expeditionRows = useMemo<ExpeditionRow[]>(() => {
    const map = new Map<string, ExpeditionRow>();
    for (const l of filtered) {
      let row = map.get(l.expedition);
      if (!row) {
        row = { expedition: l.expedition, total: 0, draft: 0, picked: 0, handover: 0 };
        map.set(l.expedition, row);
      }
      row.total++;
      if (l.status === "draft") row.draft++;
      else if (l.status === "picked") row.picked++;
      if (l.handover) row.handover++;
    }
    return [...map.values()].sort((a, b) => b.total - a.total);
  }, [filtered]);

  // Driver breakdown
  const driverRows = useMemo<DriverRow[]>(() => {
    const map = new Map<string, DriverRow>();
    for (const l of filtered) {
      const key = l.driver;
      let row = map.get(key);
      if (!row) {
        row = { driver: l.driver, expedition: l.expedition, total: 0, draft: 0, picked: 0, handover: 0 };
        map.set(key, row);
      }
      row.total++;
      if (l.status === "draft") row.draft++;
      else if (l.status === "picked") row.picked++;
      if (l.handover) row.handover++;
    }
    return [...map.values()].sort((a, b) => b.total - a.total);
  }, [filtered]);

  // Activity feed — collect history from all lists, sort by most recent
  const activityEntries = useMemo<ActivityEntry[]>(() => {
    const entries: ActivityEntry[] = [];
    for (const l of lists) {
      for (const h of l.history) {
        entries.push({ at: h.at, by: h.by, text: h.text, pickingId: l.id });
      }
    }
    return entries.sort((a, b) => b.at.localeCompare(a.at)).slice(0, 15);
  }, [lists]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  if (error) {
    return (
      <div className="rounded-lg border border-[#fecdca] bg-[#fff1f0] px-4 py-3 text-sm text-[#7a271a]">
        Gagal memuat data: {error}
      </div>
    );
  }

  const isAdmin = user?.role === "admin" || user?.role === "kepala";

  return (
    <div className="flex min-h-[calc(100vh-80px)] flex-col max-lg:min-h-[calc(100vh-64px)]">
      {/* Header */}
      <div className="mb-4">
        <h2 className="m-0 mb-1 text-[23px] font-bold">Dashboard</h2>
        <p className="m-0 text-[var(--muted)]">Ringkasan aktifitas picking.</p>
      </div>

      {/* Stat Cards */}
      <div className="mb-4 grid grid-cols-3 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
        <StatCard
          label="Total Picking"
          value={stats?.totalPicking ?? "…"}
          subtext="Semua No Picking List"
        />
        <StatCard
          label="Aktif"
          value={stats?.draftCount ?? "…"}
          subtext="Belum diproses"
        />
        <StatCard
          label="Sudah Pick"
          value={stats?.pickedCount ?? "…"}
          subtext="Siap serah terima"
        />
        <StatCard
          label="Sudah Serah Terima"
          value={stats?.handoverCount ?? "…"}
          subtext="Selesai"
        />
        <StatCard
          label="Total Item"
          value={stats?.totalItems ?? "…"}
          subtext="Seluruh qty direncanakan"
        />
        <StatCard
          label="Outstanding Hutang"
          value={stats?.totalDebt ?? "…"}
          subtext="Qty belum dibayar"
        />
      </div>

      {/* Filter bar */}
      {isAdmin && (
        <div className="sticky top-12 z-10 mb-4 bg-[var(--bg)] pb-2 pt-1">
          <FilterBar
            dates={dates}
            drivers={drivers}
            expeditions={expeditions}
            filters={filters}
            onChange={handleFilterChange}
          />
        </div>
      )}

      {/* Breakdowns — admin/kepala only */}
      {isAdmin && (
        <div className="mb-4 grid grid-cols-2 gap-4 max-lg:grid-cols-1">
          <BreakdownTable
            title="Per Ekspedisi"
            icon={Truck}
            rows={expeditionRows}
            getName={(r) => r.expedition}
            linkHref="/picking"
          />
          <BreakdownTable
            title="Per Driver"
            icon={ClipboardList}
            rows={driverRows}
            getName={(r) => ("driver" in r ? `${r.driver} (${r.expedition})` : r.expedition)}
            linkHref="/picking"
          />
        </div>
      )}

      {/* Dealer confirmation + Activity */}
      <div className="grid grid-cols-2 gap-4 max-lg:grid-cols-1">
        {isAdmin && <DealerSummary items={dealerItems} />}
        <ActivityFeed entries={activityEntries} />
      </div>
    </div>
  );
}
