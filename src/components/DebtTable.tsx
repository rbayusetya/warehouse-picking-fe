"use client";

import type { PickingList, PickingItem } from "@/lib/types";
import Link from "next/link";

interface DebtTableProps {
  rows: { list: PickingList & { picking_id?: string }; item: PickingItem; paid: number; debt: number }[];
  canEdit: boolean;
}

export default function DebtTable({ rows, canEdit }: DebtTableProps) {
  if (rows.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-[var(--line)] bg-[var(--surface)]/55 p-[26px] text-center text-[var(--muted)]">
        Belum ada hutang barang.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--line)] bg-[var(--surface)] shadow-sm">
      <table className="w-full min-w-[760px] border-collapse">
        <thead>
          <tr>
            <th className="border-b border-[var(--line)] bg-[var(--surface-soft)] px-[10px] py-[11px] text-left text-xs font-bold uppercase text-[var(--muted)]">Tanggal</th>
            <th className="border-b border-[var(--line)] bg-[var(--surface-soft)] px-[10px] py-[11px] text-left text-xs font-bold uppercase text-[var(--muted)]">No Picking</th>
            <th className="border-b border-[var(--line)] bg-[var(--surface-soft)] px-[10px] py-[11px] text-left text-xs font-bold uppercase text-[var(--muted)]">Driver</th>
            <th className="border-b border-[var(--line)] bg-[var(--surface-soft)] px-[10px] py-[11px] text-left text-xs font-bold uppercase text-[var(--muted)]">Barang</th>
            <th className="border-b border-[var(--line)] bg-[var(--surface-soft)] px-[10px] py-[11px] text-left text-xs font-bold uppercase text-[var(--muted)]">Plan</th>
            <th className="border-b border-[var(--line)] bg-[var(--surface-soft)] px-[10px] py-[11px] text-left text-xs font-bold uppercase text-[var(--muted)]">Aktual</th>
            <th className="border-b border-[var(--line)] bg-[var(--surface-soft)] px-[10px] py-[11px] text-left text-xs font-bold uppercase text-[var(--muted)]">Terbayar</th>
            <th className="border-b border-[var(--line)] bg-[var(--surface-soft)] px-[10px] py-[11px] text-left text-xs font-bold uppercase text-[var(--muted)]">Sisa</th>
            <th className="border-b border-[var(--line)] bg-[var(--surface-soft)] px-[10px] py-[11px] text-left text-xs font-bold uppercase text-[var(--muted)]">Proses</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={`${row.list.id}-${row.item.id}`}>
              <td className="border-b border-[var(--line)] px-[10px] py-[11px] align-top text-sm">{row.list.date}</td>
              <td className="border-b border-[var(--line)] px-[10px] py-[11px] align-top text-sm">{row.list.picking_id || row.list.id}</td>
              <td className="border-b border-[var(--line)] px-[10px] py-[11px] align-top text-sm">{row.list.driver}</td>
              <td className="border-b border-[var(--line)] px-[10px] py-[11px] align-top text-sm">
                <strong>{row.item.name}</strong>
                <br />
                <small className="text-[var(--muted)]">{row.item.note || "-"}</small>
              </td>
              <td className="border-b border-[var(--line)] px-[10px] py-[11px] align-top text-sm">{row.item.plannedQty}</td>
              <td className="border-b border-[var(--line)] px-[10px] py-[11px] align-top text-sm">{row.item.actualQty}</td>
              <td className="border-b border-[var(--line)] px-[10px] py-[11px] align-top text-sm">{row.paid}</td>
              <td className="border-b border-[var(--line)] px-[10px] py-[11px] align-top">
                <span className="inline-flex min-h-[26px] items-center rounded-full bg-amber-100 px-[9px] py-[4px] text-xs font-bold text-amber-800">{row.debt}</span>
              </td>
              <td className="border-b border-[var(--line)] px-[10px] py-[11px] align-top">
                {canEdit && row.debt > 0 && (
                  <Link
                    href={`/debts/pay?itemId=${row.item.id}&itemName=${encodeURIComponent(row.item.name)}&plannedQty=${row.item.plannedQty}&actualQty=${row.item.actualQty}&debt=${row.debt}&pickingListId=${row.list.id}`}
                    className="inline-block rounded-md bg-teal-700 px-[13px] py-[6px] text-[13px] font-bold text-white hover:bg-teal-800"
                  >
                    Bayar
                  </Link>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
