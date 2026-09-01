"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/lib/providers/auth-context";
import { fetchDebts } from "@/lib/api";
import DebtTable from "./_components/DebtTable";
import FilterBar from "@/components/FilterBar";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function DebtsPage() {
  const { user } = useAuth();
  const [rows, setRows] = useState<any[]>([]);
  const [error, setError] = useState("");

  const load = () => {
    fetchDebts()
      .then(setRows)
      .catch((e) => setError(e.message));
  };

  useEffect(() => { load(); }, []);

  const [filters, setFilters] = useState<Record<string, string>>({
    date: "",
    driver: "",
    expedition: "",
  });

  const dates = useMemo(() => [...new Set(rows.map((r) => r.list.date))].sort(), [rows]);
  const drivers = useMemo(() => [...new Set(rows.map((r) => r.list.driver))].sort(), [rows]);
  const expeditions = useMemo(() => [...new Set(rows.map((r) => r.list.expedition))].sort(), [rows]);

  const filtered = useMemo(() => {
    return rows.filter((row) => {
      if (filters.date && row.list.date !== filters.date) return false;
      if (filters.driver && row.list.driver !== filters.driver) return false;
      if (filters.expedition && row.list.expedition !== filters.expedition) return false;
      return true;
    });
  }, [rows, filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const canEdit = user?.role === "admin" || user?.role === "kepala";

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
        <h2 className="m-0 mb-1 text-[23px] font-bold">Hutang Barang</h2>
        <p className="m-0 text-[var(--muted)]">Rekap kekurangan dan pembayaran hutang.</p>
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

      <DebtTable
        rows={filtered}
        canEdit={canEdit}
      />
    </div>
  );
}
