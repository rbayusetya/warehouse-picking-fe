"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/lib/providers/auth-context";
import { fetchPickingLists, fetchSettlementHandovers } from "@/lib/api";
import type { PickingList } from "@/lib/types";
import type { SettlementHandoverEntry } from "@/lib/api";
import Link from "next/link";
import { statusLabel, listTotals } from "@/lib/utils";
import FilterBar from "@/components/FilterBar";
import { ArrowLeft, Handshake, DollarSign } from "lucide-react";

export default function HandoverListPage() {
  const { user } = useAuth();
  const [lists, setLists] = useState<PickingList[]>([]);
  const [settlementHandovers, setSettlementHandovers] = useState<SettlementHandoverEntry[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetchPickingLists(),
      fetchSettlementHandovers(),
    ])
      .then(([l, sh]) => {
        setLists(l);
        setSettlementHandovers(sh);
      })
      .catch((e) => setError(e.message));
  }, []);

  const [filters, setFilters] = useState<Record<string, string>>({
    date: "",
    driver: "",
    expedition: "",
  });

  const allDates = useMemo(() => {
    const pl = lists.map((l) => l.date);
    const sh = settlementHandovers.map((h) => h.pickingList.date);
    return [...new Set([...pl, ...sh])].sort();
  }, [lists, settlementHandovers]);

  const allDrivers = useMemo(() => {
    const pl = lists.map((l) => l.driver);
    const sh = settlementHandovers.map((h) => h.pickingList.driver);
    return [...new Set([...pl, ...sh])].sort();
  }, [lists, settlementHandovers]);

  const allExpeditions = useMemo(() => {
    const pl = lists.map((l) => l.expedition);
    const sh = settlementHandovers.map((h) => h.pickingList.expedition);
    return [...new Set([...pl, ...sh])].sort();
  }, [lists, settlementHandovers]);

  const filteredLists = useMemo(() => {
    return lists.filter((row) => {
      if (filters.date && row.date !== filters.date) return false;
      if (filters.driver && row.driver !== filters.driver) return false;
      if (filters.expedition && row.expedition !== filters.expedition) return false;
      return true;
    });
  }, [lists, filters]);

  const filteredSettlementHandovers = useMemo(() => {
    return settlementHandovers.filter((h) => {
      if (filters.date && h.pickingList.date !== filters.date) return false;
      if (filters.driver && h.pickingList.driver !== filters.driver) return false;
      if (filters.expedition && h.pickingList.expedition !== filters.expedition) return false;
      return true;
    });
  }, [settlementHandovers, filters]);

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

  return (
    <div>
      <div className="mb-4">
        <Link href="/dashboard" className="mb-1.5 inline-flex items-center gap-1 text-[13px] text-[var(--muted)] no-underline hover:text-[var(--text-primary)]">
          <ArrowLeft size={15} />
          Kembali
        </Link>
        <h2 className="m-0 mb-1 text-[23px] font-bold">Serah Terima</h2>
        <p className="m-0 text-[var(--muted)]">Serah terima picking dan pembayaran hutang.</p>
      </div>

      <div className="sticky top-12 z-10 mb-4 bg-[var(--bg)] pb-2 pt-1">
        <FilterBar
          dates={allDates}
          drivers={allDrivers}
          expeditions={allExpeditions}
          filters={filters}
          onChange={handleFilterChange}
        />
      </div>

      {/* Picking Handovers */}
      <h3 className="mb-3 mt-0 flex items-center gap-2 text-[17px] font-bold">
        <Handshake size={20} />
        Serah Terima Picking
      </h3>
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {filteredLists.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[var(--line)] bg-[var(--surface)]/55 p-[26px] text-center text-[var(--muted)]">
            Tidak ada data.
          </div>
        ) : (
          filteredLists.map((list) => {
            const totals = listTotals(list);
            const confirmedPct = list.items.length > 0 ? Math.round((totals.confirmed / list.items.length) * 100) : 0;
            return (
              <Link
                key={list.id}
                href={`/handover/${list.id}`}
                className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-3.5 no-underline hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="m-0 mb-1 truncate text-[15px] font-bold text-[var(--text-primary)]">No Picking List {list.id}</h3>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-[var(--muted)]">
                      <span>{list.date}</span>
                      <span>{list.driver}</span>
                      <span>{list.plate}</span>
                      <span>{list.expedition}</span>
                    </div>
                  </div>
                  <span className="flex-shrink-0 text-lg text-[var(--muted)]">&gt;</span>
                </div>
                <div className="mt-2.5 flex flex-wrap items-center gap-2 border-t border-[var(--line)] pt-2.5">
                  <span className="inline-flex min-h-[24px] items-center rounded-full bg-[var(--surface-soft)] px-[8px] py-[3px] text-[11px] font-bold text-[var(--text-secondary)]">
                    {statusLabel(list)}
                  </span>
                  <span className="inline-flex min-h-[24px] items-center rounded-full bg-[var(--surface-soft)] px-[8px] py-[3px] text-[11px] font-bold text-[var(--text-secondary)]">
                    {totals.confirmed}/{list.items.length} item ({confirmedPct}%)
                  </span>
                  {list.handover ? (
                    <span className="inline-flex min-h-[24px] items-center rounded-full bg-green-100 px-[8px] py-[3px] text-[11px] font-bold text-green-800">
                      Selesai
                    </span>
                  ) : (
                    <span className="inline-flex min-h-[24px] items-center rounded-full bg-amber-100 px-[8px] py-[3px] text-[11px] font-bold text-amber-800">
                      Belum serah terima
                    </span>
                  )}
                </div>
              </Link>
            );
          })
        )}
      </div>

      {/* Settlement Handovers */}
      <h3 className="mb-3 mt-0 flex items-center gap-2 text-[17px] font-bold text-teal-700">
        <DollarSign size={20} />
        Serah Terima Pembayaran Hutang
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {filteredSettlementHandovers.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[var(--line)] bg-[var(--surface)]/55 p-[26px] text-center text-[var(--muted)]">
            Belum ada serah terima pembayaran hutang.
          </div>
        ) : (
          filteredSettlementHandovers.map((h) => (
            <div
              key={h.id}
              className="rounded-lg border border-teal-200 bg-[var(--surface)] p-3.5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <h3 className="m-0 mb-1 truncate text-[15px] font-bold text-[var(--text-primary)]">
                    {h.pickingList.pickingId || h.pickingList.id}
                  </h3>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-[var(--muted)]">
                    <span>{h.pickingList.date}</span>
                    <span>{h.pickingList.driver}</span>
                    <span>{h.pickingList.expedition}</span>
                  </div>
                </div>
              </div>
              <div className="mt-2.5 border-t border-[var(--line)] pt-2.5">
                <div className="flex flex-wrap gap-2 text-[12px] text-[var(--text-secondary)]">
                  <span className="font-bold">{h.item.name}</span>
                  <span className="text-[var(--muted)]">Qty: {h.item.qty}</span>
                  <span className="text-[var(--muted)]">Admin: {h.adminName}</span>
                  <span className="text-[var(--muted)]">Driver: {h.driverName}</span>
                </div>
              </div>
              {h.createdAt && (
                <div className="mt-1.5 text-[11px] text-[var(--muted)]">
                  {h.createdAt}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
