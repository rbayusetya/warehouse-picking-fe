"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/providers/auth-context";
import { fetchPickingListDetail, updatePickingItems, completePicking } from "@/lib/api";
import { statusLabel } from "@/lib/utils";
import type { PickingList } from "@/lib/types";
import PickingTable from "../_components/PickingTable";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PickingDetailPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [list, setList] = useState<PickingList | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    if (!params.id) return;
    fetchPickingListDetail(params.id as string)
      .then(setList)
      .catch((e) => setError(e.message));
  }, [params.id]);

  useEffect(() => { load(); }, [load]);

  const dealerSummary = useMemo(() => {
    if (!list) return [];
    type CatEntry = { planned: number; actual: number };
    const map = new Map<string, { dealer: string; categories: Record<string, CatEntry> }>();
    for (const item of list.items) {
      for (const d of item.dealers) {
        const key = d.code;
        let entry = map.get(key);
        if (!entry) {
          entry = { dealer: d.dealer, categories: {} };
          map.set(key, entry);
        }
        const cat = item.category;
        if (!entry.categories[cat]) entry.categories[cat] = { planned: 0, actual: 0 };
        entry.categories[cat].planned += d.qty;
        entry.categories[cat].actual += Math.min(d.qty, item.actualQty / item.dealers.length);
      }
    }
    return [...map.entries()].map(([code, v]) => ({
      code,
      dealer: v.dealer,
      categories: v.categories,
      totalPlanned: Object.values(v.categories).reduce((s, c) => s + c.planned, 0),
      totalActual: Object.values(v.categories).reduce((s, c) => s + c.actual, 0),
    }));
  }, [list]);

  const canEdit = user?.role === "admin" || user?.role === "kepala";

  const handleItemChange = async (itemId: string, field: string, value: string | number | boolean) => {
    const item = list?.items.find(i => i.id === itemId);
    if (!item) return;

    const update: any = { id: itemId };

    if (field === "actualQty") {
      const actualQty = parseFloat(value as string) || 0;
      update.actual_qty = actualQty;
      if (actualQty === item.plannedQty) {
        update.confirmed = true;
      }
    } else if (field === "confirmed") {
      if (value === true && item.actualQty !== item.plannedQty && !item.note.trim()) {
        alert("Notes wajib diisi jika jumlah aktual tidak sesuai plan.");
        return;
      }
      update.confirmed = value as boolean;
    } else if (field === "note") {
      update.note = value as string;
      if ((value as string).trim() && item.actualQty !== item.plannedQty && !item.confirmed) {
        update.confirmed = true;
      }
    }

    try {
      const updated = await updatePickingItems(list!.id, [update]);
      setList(updated);
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleComplete = async () => {
    try {
      await completePicking(list!.id);
      load();
      router.push(`/handover/${list!.id}`);
    } catch (e: any) {
      alert(e.message);
    }
  };

  if (error) {
    return (
      <div className="rounded-lg border border-[#fecdca] bg-[#fff1f0] px-4 py-3 text-sm text-[#7a271a]">
        {error}
      </div>
    );
  }

  if (!list) {
    return (
      <div className="rounded-lg border border-dashed border-[var(--line)] bg-[var(--surface)]/55 p-[26px] text-center text-[var(--muted)]">
        Memuat...
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-start justify-between gap-[18px]">
        <div>
          <Link href="/picking" className="mb-1.5 inline-flex items-center gap-1 text-[13px] text-[var(--muted)] no-underline hover:text-[var(--text-primary)]">
            <ArrowLeft size={15} />
            Kembali
          </Link>
          <h2 className="m-0 mb-1 text-[23px] font-bold">Picking</h2>
          <p className="m-0 text-[var(--muted)]">
            No Picking List {list.id} - {list.driver} - {list.expedition}
          </p>
        </div>
        <span className="inline-flex min-h-[26px] items-center rounded-full bg-[var(--surface-soft)] px-[9px] py-[4px] text-xs font-bold text-[var(--text-secondary)]">
          {statusLabel(list)}
        </span>
      </div>

      <PickingTable
        list={list}
        canEdit={canEdit}
        onItemChange={handleItemChange}
        onComplete={handleComplete}
      />

      <div className="mt-4 rounded-lg border border-[var(--line)] bg-[var(--surface)] p-4 shadow-sm">
        <h3 className="m-0 mb-3 text-[17px] font-bold">Ringkasan per Dealer</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border-b border-[var(--line)] bg-[var(--surface-soft)] px-[10px] py-[11px] text-left text-xs font-bold uppercase text-[var(--muted)]">Kode Dealer</th>
                <th className="border-b border-[var(--line)] bg-[var(--surface-soft)] px-[10px] py-[11px] text-left text-xs font-bold uppercase text-[var(--muted)]">Nama Dealer</th>
                <th className="border-b border-[var(--line)] bg-[var(--surface-soft)] px-[10px] py-[11px] text-left text-xs font-bold uppercase text-[var(--muted)]">Kategori</th>
                <th className="border-b border-[var(--line)] bg-[var(--surface-soft)] px-[10px] py-[11px] text-right text-xs font-bold uppercase text-[var(--muted)]">Plan</th>
                <th className="border-b border-[var(--line)] bg-[var(--surface-soft)] px-[10px] py-[11px] text-right text-xs font-bold uppercase text-[var(--muted)]">Aktual</th>
                <th className="border-b border-[var(--line)] bg-[var(--surface-soft)] px-[10px] py-[11px] text-right text-xs font-bold uppercase text-[var(--muted)]">Kurang</th>
                <th className="border-b border-[var(--line)] bg-[var(--surface-soft)] px-[10px] py-[11px] text-right text-xs font-bold uppercase text-[var(--muted)]">%</th>
              </tr>
            </thead>
            <tbody>
              {dealerSummary.map((d) => {
                const catKeys = Object.keys(d.categories);
                const rows: React.ReactNode[] = [];
                catKeys.forEach((cat, ci) => {
                  const c = d.categories[cat];
                  const kurang = c.planned - Math.round(c.actual);
                  rows.push(
                    <tr key={d.code + cat}>
                      {ci === 0 && (
                        <>
                          <td className="border-b border-[var(--line)] px-[10px] py-[11px] text-sm font-bold" rowSpan={catKeys.length + 1}>{d.code}</td>
                          <td className="border-b border-[var(--line)] px-[10px] py-[11px] text-sm text-[var(--muted)]" rowSpan={catKeys.length + 1}>{d.dealer}</td>
                        </>
                      )}
                      <td className="border-b border-[var(--line)] px-[10px] py-[11px] text-sm text-[var(--text-secondary)]">{cat}</td>
                      <td className="border-b border-[var(--line)] px-[10px] py-[11px] text-right text-sm">{c.planned}</td>
                      <td className="border-b border-[var(--line)] px-[10px] py-[11px] text-right text-sm">{Math.round(c.actual)}</td>
                      <td className="border-b border-[var(--line)] px-[10px] py-[11px] text-right text-sm">{kurang}</td>
                      <td className="border-b border-[var(--line)] px-[10px] py-[11px] text-right text-sm" />
                    </tr>
                  );
                });
                const totalKurang = d.totalPlanned - Math.round(d.totalActual);
                const totalPct = d.totalPlanned > 0 ? Math.round(d.totalActual / d.totalPlanned * 100) : 0;
                rows.push(
                  <tr key={d.code + '-total'} className="bg-[var(--surface-soft)]">
                    <td className="border-b border-[var(--line)] px-[10px] py-[11px] text-sm font-bold text-[var(--text-primary)]">Total</td>
                    <td className="border-b border-[var(--line)] px-[10px] py-[11px] text-right text-sm font-bold">{d.totalPlanned}</td>
                    <td className="border-b border-[var(--line)] px-[10px] py-[11px] text-right text-sm font-bold">{Math.round(d.totalActual)}</td>
                    <td className="border-b border-[var(--line)] px-[10px] py-[11px] text-right text-sm font-bold text-amber-700">{totalKurang}</td>
                    <td className="border-b border-[var(--line)] px-[10px] py-[11px] text-right text-sm font-bold text-teal-700">{totalPct}%</td>
                  </tr>
                );
                return rows;
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
