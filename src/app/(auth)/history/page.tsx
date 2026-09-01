"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/lib/auth-context";
import { fetchPickingLists } from "@/lib/api";
import Timeline from "@/components/Timeline";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function HistoryPage() {
  const { user } = useAuth();
  const [lists, setLists] = useState<any[]>([]);

  useEffect(() => {
    fetchPickingLists().then(setLists).catch(() => {});
  }, []);

  const entries = useMemo(() => {
    const all: { pickingId: string; at: string; by: string; text: string }[] = [];
    for (const list of lists) {
      for (const entry of list.history) {
        all.push({ ...entry, pickingId: list.id });
      }
    }
    return all.reverse();
  }, [lists]);

  return (
    <div>
      <div className="mb-4">
        <Link href="/dashboard" className="mb-1.5 inline-flex items-center gap-1 text-[13px] text-[var(--muted)] no-underline hover:text-[var(--text-primary)]">
          <ArrowLeft size={15} />
          Kembali
        </Link>
        <h2 className="m-0 mb-1 text-[23px] font-bold">Histori</h2>
        <p className="m-0 text-[var(--muted)]">Semua update dicatat tanpa menghapus kondisi awal.</p>
      </div>
      <Timeline entries={entries} />
    </div>
  );
}
