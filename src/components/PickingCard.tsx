"use client";

import Link from "next/link";
import type { PickingList } from "@/lib/types";
import { statusLabel, listTotals } from "@/lib/utils";

interface PickingCardProps {
  list: PickingList;
}

export default function PickingCard({ list }: PickingCardProps) {
  const totals = listTotals(list);
  const label = statusLabel(list);
  const pillColor =
    label === "Selesai" || label === "Siap serah terima"
      ? "bg-green-100 text-green-800"
      : label.includes("hutang") || label.includes("kurang")
      ? "bg-amber-100 text-amber-800"
      : label === "Belum picking"
      ? "bg-gray-100 text-gray-600"
      : "bg-blue-100 text-blue-800";

  return (
    <article className="grid grid-cols-[1fr_auto] gap-3.5 rounded-lg border border-[var(--line)] bg-[var(--surface)] p-3.5">
      <div>
        <h3 className="mb-[7px] text-[17px] font-bold">No Picking List {list.id}</h3>
        <div className="flex flex-wrap gap-2 text-[13px] text-[var(--muted)]">
          <span>{list.date}</span>
          <span>{list.driver}</span>
          <span>{list.expedition}</span>
          <span>{list.plate}</span>
          <span>No DS {list.noDs}</span>
        </div>
        <div className="mt-[10px] flex flex-wrap gap-2">
          <span className={`inline-flex min-h-[26px] items-center rounded-full px-[9px] py-[4px] text-xs font-bold ${pillColor}`}>
            {label}
          </span>
          <span className="inline-flex min-h-[26px] items-center rounded-full bg-[var(--surface-soft)] px-[9px] py-[4px] text-xs font-bold text-[var(--text-secondary)]">
            Plan {totals.planned}
          </span>
          <span className="inline-flex min-h-[26px] items-center rounded-full bg-[var(--surface-soft)] px-[9px] py-[4px] text-xs font-bold text-[var(--text-secondary)]">
            Aktual {totals.actual}
          </span>
          {totals.debt > 0 && (
            <span className="inline-flex min-h-[26px] items-center rounded-full bg-amber-100 px-[9px] py-[4px] text-xs font-bold text-amber-800">
              Hutang {totals.debt}
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-wrap items-start gap-2">
        <Link
          href={`/picking/${list.id}`}
          className="inline-flex min-h-8 items-center rounded-md border border-[var(--line)] bg-[var(--surface)] px-[10px] text-[13px] font-bold text-[var(--text-secondary)] hover:bg-[var(--surface-soft)]"
        >
          Picking
        </Link>
        <Link
          href={`/handover/${list.id}`}
          className="inline-flex min-h-8 items-center rounded-md border border-[var(--line)] bg-[var(--surface)] px-[10px] text-[13px] font-bold text-[var(--text-secondary)] hover:bg-[var(--surface-soft)]"
        >
          Serah Terima
        </Link>
      </div>
    </article>
  );
}
