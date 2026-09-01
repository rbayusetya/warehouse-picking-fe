"use client";

import { useState, useMemo, useEffect } from "react";
import { fetchPickingLists } from "@/lib/api";
import { listTotals } from "@/lib/utils";
import type { PickingList } from "@/lib/types";
import FilterBar from "@/components/FilterBar";
import StatCard from "@/components/StatCard";

export default function DashboardPage() {
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

  const filtered = useMemo(() => {
    return lists.filter((row) => {
      if (filters.date && row.date !== filters.date) return false;
      if (filters.driver && row.driver !== filters.driver) return false;
      if (filters.expedition && row.expedition !== filters.expedition) return false;
      return true;
    });
  }, [lists, filters]);

  const draftCount = useMemo(() => filtered.filter((l) => l.status === "draft").length, [filtered]);
  const pickedCount = useMemo(() => filtered.filter((l) => l.status === "picked").length, [filtered]);
  const handoverCount = useMemo(() => filtered.filter((l) => l.handover).length, [filtered]);
  const totalItems = useMemo(() => filtered.reduce((s, l) => s + l.items.reduce((si, i) => si + i.plannedQty, 0), 0), [filtered]);
  const totalDebt = useMemo(() => filtered.reduce((s, l) => s + listTotals(l).debt, 0), [filtered]);

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
    <div className="flex min-h-[calc(100vh-80px)] flex-col max-lg:min-h-[calc(100vh-64px)]">
      <div className="mb-4">
        <h2 className="m-0 mb-1 text-[23px] font-bold">Dashboard</h2>
        <p className="m-0 text-[var(--muted)]">Ringkasan aktifitas picking.</p>
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

      <div className="mb-4 grid flex-1 grid-cols-3 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
        <StatCard label="Total Picking" value={filtered.length} subtext="Semua No Picking List" />
        <StatCard label="Aktif" value={draftCount} subtext="Belum diproses" />
        <StatCard label="Sudah Pick" value={pickedCount} subtext="Siap serah terima" />
        <StatCard label="Sudah Serah Terima" value={handoverCount} subtext="Selesai" />
        <StatCard label="Total Item" value={totalItems} subtext="Seluruh qty direncanakan" />
        <StatCard label="Outstanding Hutang" value={totalDebt} subtext="Qty belum dibayar" />
      </div>
    </div>
  );
}
