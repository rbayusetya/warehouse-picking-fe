"use client";

import { useMemo, useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { fetchDealerItems } from "@/lib/api";
import type { DealerItemEntry } from "@/lib/api";
import Link from "next/link";
import { AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function DealerDashboardPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [items, setItems] = useState<DealerItemEntry[]>([]);
  const [error, setError] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [driverFilter, setDriverFilter] = useState("");

  useEffect(() => {
    if (user?.role === "dealer" && user.dealerCode) {
      fetchDealerItems()
        .then(setItems)
        .catch((e) => setError(e.message));
    }
  }, [user]);

  const filterParam = searchParams.get("filter");
  const showPendingOnly = filterParam === "pending";

  const drivers = useMemo(() => [...new Set(items.map((i) => i.driver))].sort(), [items]);
  const dates = useMemo(() => [...new Set(items.map((i) => i.date))].sort(), [items]);

  const filtered = useMemo(() => {
    let result = items;
    if (dateFilter) result = result.filter((i) => i.date === dateFilter);
    if (driverFilter) result = result.filter((i) => i.driver === driverFilter);
    if (showPendingOnly) result = result.filter((i) => !i.confirmation_status || i.confirmation_status === "pending");
    return result;
  }, [items, dateFilter, driverFilter, showPendingOnly]);

  const grouped = useMemo(() => {
    const map = new Map<string, DealerItemEntry[]>();
    for (const item of filtered) {
      const id = item.picking_list_id;
      if (!map.has(id)) map.set(id, []);
      map.get(id)!.push(item);
    }
    return Array.from(map.entries());
  }, [filtered]);

  if (!user || user.role !== "dealer") {
    return (
      <div className="rounded-lg border border-[#fecdca] bg-[#fff1f0] px-4 py-3 text-sm text-[#7a271a]">
        Halaman ini khusus untuk role dealer.
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-[#fecdca] bg-[#fff1f0] px-4 py-3 text-sm text-[#7a271a]">
        Gagal memuat data: {error}
      </div>
    );
  }

  const pendingCount = items.filter((i) => !i.confirmation_status || i.confirmation_status === "pending").length;
  const confirmedCount = items.length - pendingCount;

  return (
    <div>
      <div className="mb-4 flex items-start justify-between gap-[18px]">
        <div>
          <Link href="/dashboard" className="mb-1.5 inline-flex items-center gap-1 text-[13px] text-[var(--muted)] no-underline hover:text-[var(--text-primary)]">
            <ArrowLeft size={15} />
            Kembali
          </Link>
          <h2 className="m-0 mb-1 text-[23px] font-bold">Barang Masuk</h2>
          <p className="m-0 text-[var(--muted)]">
            Konfirmasi penerimaan barang dari gudang. Dealer: {user.dealerCode}
          </p>
        </div>
        {showPendingOnly && (
          <Link
            href="/dealer"
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[var(--line)] bg-[var(--surface)] px-[10px] text-[13px] font-bold text-[var(--text-secondary)] hover:bg-[var(--surface-soft)] no-underline"
          >
            Semua Item
          </Link>
        )}
      </div>

      <div className="mb-4 grid grid-cols-3 gap-4 max-lg:grid-cols-1">
        <div className="min-h-[80px] rounded-lg border border-[var(--line)] bg-[var(--surface)] p-4 shadow-sm">
          <span className="text-[13px] font-bold text-[var(--muted)]">Total Item</span>
          <strong className="mt-2 block text-[24px] font-bold">{items.length}</strong>
        </div>
        <div className="min-h-[80px] rounded-lg border border-[var(--line)] bg-[var(--surface)] p-4 shadow-sm">
          <span className="text-[13px] font-bold text-green-700">Terkonfirmasi</span>
          <strong className="mt-2 block text-[24px] font-bold text-green-700">{confirmedCount}</strong>
        </div>
        <div className="min-h-[80px] rounded-lg border border-[var(--line)] bg-[var(--surface)] p-4 shadow-sm">
          <span className="text-[13px] font-bold text-amber-700">Belum Dikonfirmasi</span>
          <strong className="mt-2 block text-[24px] font-bold text-amber-700">{pendingCount}</strong>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3">
        <div className="grid gap-[7px]">
          <label className="text-[13px] font-bold text-[var(--text-secondary)]">Tanggal</label>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full rounded-md border border-[var(--line)] bg-[var(--surface)] px-[11px] py-[10px] text-sm"
          >
            <option value="">Semua tanggal</option>
            {dates.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div className="grid gap-[7px]">
          <label className="text-[13px] font-bold text-[var(--text-secondary)]">Driver</label>
          <select
            value={driverFilter}
            onChange={(e) => setDriverFilter(e.target.value)}
            className="w-full rounded-md border border-[var(--line)] bg-[var(--surface)] px-[11px] py-[10px] text-sm"
          >
            <option value="">Semua driver</option>
            {drivers.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div className="grid gap-[7px]">
          <label className="text-[13px] font-bold text-[var(--text-secondary)]">&nbsp;</label>
          <button
            type="button"
            onClick={() => { setDateFilter(""); setDriverFilter(""); }}
            className="rounded-md border border-[var(--line)] bg-[var(--surface)] px-[13px] py-[10px] text-sm font-bold text-[var(--text-secondary)] hover:bg-[var(--surface-soft)]"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="grid gap-[10px]">
        {grouped.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[var(--line)] bg-[var(--surface)]/55 p-[26px] text-center text-[var(--muted)]">
            Tidak ada barang masuk.
          </div>
        ) : (
          grouped.map(([pickingId, itemList]) => {
            const first = itemList[0];
            const unconfirmed = itemList.filter((i) => !i.confirmation_status || i.confirmation_status === "pending");
            return (
              <Link
                key={pickingId}
                href={`/dealer/${pickingId}`}
                className="grid grid-cols-[1fr_auto] gap-3.5 rounded-lg border border-[var(--line)] bg-[var(--surface)] p-3.5 no-underline hover:shadow-sm"
              >
                <div>
                  <h3 className="m-0 mb-[7px] text-[17px] font-bold text-[var(--text-primary)]">
                    No Picking List {first.picking_id}
                  </h3>
                  <div className="flex flex-wrap gap-2 text-[13px] text-[var(--muted)]">
                    <span>{first.date}</span>
                    <span>{first.driver}</span>
                    <span>{first.expedition}</span>
                  </div>
                  <div className="mt-[10px] flex flex-wrap gap-2">
                    <span className="inline-flex min-h-[26px] items-center rounded-full bg-[var(--surface-soft)] px-[9px] py-[4px] text-xs font-bold text-[var(--text-secondary)]">
                      {itemList.length} item
                    </span>
                    {unconfirmed.length > 0 ? (
                      <span className="inline-flex min-h-[26px] items-center gap-1 rounded-full bg-amber-100 px-[9px] py-[4px] text-xs font-bold text-amber-800">
                        <AlertCircle size={12} />
                        {unconfirmed.length} belum dikonfirmasi
                      </span>
                    ) : (
                      <span className="inline-flex min-h-[26px] items-center gap-1 rounded-full bg-green-100 px-[9px] py-[4px] text-xs font-bold text-green-800">
                        <CheckCircle size={12} />
                        Selesai
                      </span>
                    )}
                  </div>
                </div>
                <span className="flex items-center text-lg text-[var(--muted)]">&gt;</span>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
