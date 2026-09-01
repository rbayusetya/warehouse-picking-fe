"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/lib/auth-context";
import { fetchPickingLists } from "@/lib/api";
import Link from "next/link";
import { listTotals, statusLabel } from "@/lib/utils";
import type { PickingList } from "@/lib/types";
import { ArrowLeft } from "lucide-react";
import FilterBar from "@/components/FilterBar";

export default function PickingListPage() {
  const { user } = useAuth();
  const [lists, setLists] = useState<PickingList[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPickingLists()
      .then(setLists)
      .catch((e) => setError(e.message));
  }, []);

  const [filters, setFilters] = useState<Record<string, string>>({
    date: "",
    driver: "",
    expedition: "",
  });

  const dates = useMemo(() => [...new Set(lists.map((l) => l.date))].sort(), [lists]);
  const drivers = useMemo(() => [...new Set(lists.map((l) => l.driver))].sort(), [lists]);
  const expeditions = useMemo(() => [...new Set(lists.map((l) => l.expedition))].sort(), [lists]);

  const activeLists = useMemo(
    () => lists.filter((l) => l.status === "draft"),
    [lists]
  );

  const filtered = useMemo(() => {
    return activeLists.filter((row) => {
      if (filters.date && row.date !== filters.date) return false;
      if (filters.driver && row.driver !== filters.driver) return false;
      if (filters.expedition && row.expedition !== filters.expedition) return false;
      return true;
    });
  }, [activeLists, filters]);

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
        <h2 className="m-0 mb-1 text-[23px] font-bold">Picking Checklist</h2>
        <p className="m-0 text-[var(--muted)]">Pilih No Picking List untuk melakukan picking barang.</p>
      </div>

      <div className="sticky top-12 z-10 mb-4 bg-[var(--bg)] pb-2 pt-1">
        <FilterBar
          dates={dates}
          drivers={drivers}
          expeditions={expeditions}
          filters={filters}
          onChange={handleFilterChange}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {filtered.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[var(--line)] bg-[var(--surface)]/55 p-[26px] text-center text-[var(--muted)]">
            {activeLists.length === 0
              ? "Semua picking sudah selesai. Tidak ada daftar aktif."
              : "Tidak ada picking sesuai filter."}
          </div>
        ) : (
          filtered.map((list) => {
            const totals = listTotals(list);
            return (
              <Link
                key={list.id}
                href={`/picking/${list.id}`}
                className="grid grid-cols-[1fr_auto] gap-3.5 rounded-lg border border-[var(--line)] bg-[var(--surface)] p-3.5 no-underline hover:shadow-sm"
              >
                <div>
                  <h3 className="m-0 mb-[7px] text-[17px] font-bold text-[var(--text-primary)]">No Picking List {list.id}</h3>
                  <div className="flex flex-wrap gap-2 text-[13px] text-[var(--muted)]">
                    <span>{list.date}</span>
                    <span>{list.driver}</span>
                    <span>{list.expedition}</span>
                  </div>
                  <div className="mt-[10px] flex flex-wrap gap-2">
                    <span className="inline-flex min-h-[26px] items-center rounded-full bg-[var(--surface-soft)] px-[9px] py-[4px] text-xs font-bold text-[var(--text-secondary)]">
                      {statusLabel(list)}
                    </span>
                    <span className="inline-flex min-h-[26px] items-center rounded-full bg-[var(--surface-soft)] px-[9px] py-[4px] text-xs font-bold text-[var(--text-secondary)]">
                      {totals.confirmed}/{list.items.length} item
                    </span>
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
