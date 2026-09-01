"use client";

import { useState } from "react";
import type { PickingList, PickingItem } from "@/lib/types";
import { debtForItem } from "@/lib/utils";
import PickingItemModal from "./PickingItemModal";

interface PickingTableProps {
  list: PickingList;
  canEdit: boolean;
  onItemChange: (itemId: string, field: string, value: string | number | boolean) => void;
  onComplete: () => void;
}

export default function PickingTable({ list, canEdit, onItemChange, onComplete }: PickingTableProps) {
  const [modalItem, setModalItem] = useState<PickingItem | null>(null);
  const confirmedCount = list.items.filter((i) => i.confirmed).length;

  return (
    <div className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-4 shadow-sm">
      <form onSubmit={(e) => { e.preventDefault(); onComplete(); }}>
        {/* ─── Mobile: card list ─── */}
        <div className="block md:hidden">
          <div className="grid gap-[10px]">
            {list.items.map((item) => {
              const mismatch = item.actualQty !== item.plannedQty;
              const notesRequired = mismatch && !item.note.trim();
              return (
                <div
                  key={item.id}
                  onClick={() => setModalItem(item)}
                  className={`cursor-pointer rounded-lg border p-3 ${notesRequired ? "border-red-300 bg-red-50/40" : "border-[var(--line)] bg-[var(--surface)]"}`}
                >
                  <div className="mb-2 flex items-start gap-2">
                    <div className="mt-0.5">
                      <input
                        type="checkbox"
                        checked={item.confirmed}
                        onChange={(e) => { e.stopPropagation(); onItemChange(item.id, "confirmed", e.target.checked); }}
                        disabled={!canEdit || (mismatch && !item.note.trim())}
                        className="h-[18px] w-[18px] accent-teal-700"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <strong className="text-sm text-[var(--text-primary)]">{item.name}</strong>
                      <span className="ml-1.5 text-xs text-[var(--muted)]">{item.code}</span>
                    </div>
                    <span className="inline-flex min-h-[22px] items-center rounded-full bg-amber-100 px-[7px] text-xs font-bold text-amber-800">
                      {debtForItem(list, item)}
                    </span>
                  </div>
                  <div className="mb-1.5 flex flex-wrap gap-1.5">
                    <span className="inline-flex min-h-[22px] items-center rounded-full bg-[var(--surface-soft)] px-[7px] text-xs text-[var(--text-secondary)]">{item.category}</span>
                    <span className="inline-flex min-h-[22px] items-center rounded-full bg-[var(--surface-soft)] px-[7px] text-xs text-[var(--text-secondary)]">Plan: {item.plannedQty}</span>
                    <span className="inline-flex min-h-[22px] items-center rounded-full bg-[var(--surface-soft)] px-[7px] text-xs text-[var(--text-secondary)]">Aktual: {item.actualQty}</span>
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-[var(--muted)]">
                    {item.dealers.map((d, i) => (
                      <span key={d.code + i}>{d.code}: {d.qty}</span>
                    ))}
                  </div>
                  {item.note.trim() && (
                    <div className="mt-1.5 text-xs italic text-[var(--muted)]">Note: {item.note}</div>
                  )}
                </div>
              );
            })}
          </div>

          {canEdit && (
            <button
              type="submit"
              className="sticky bottom-0 mt-4 w-full rounded-md bg-amber-600 px-[13px] py-[11px] font-bold text-white shadow-lg hover:bg-amber-700"
            >
              Complete Picking ({confirmedCount}/{list.items.length})
            </button>
          )}
        </div>

        {/* ─── Desktop: table ─── */}
        <div className="hidden md:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse">
              <thead>
                <tr>
                  <th className="border-b border-[var(--line)] bg-[var(--surface-soft)] px-[10px] py-[11px] text-left text-xs font-bold uppercase text-[var(--muted)]">OK</th>
                  <th className="border-b border-[var(--line)] bg-[var(--surface-soft)] px-[10px] py-[11px] text-left text-xs font-bold uppercase text-[var(--muted)]">Barang</th>
                  <th className="border-b border-[var(--line)] bg-[var(--surface-soft)] px-[10px] py-[11px] text-left text-xs font-bold uppercase text-[var(--muted)]">Kategori</th>
                  <th className="border-b border-[var(--line)] bg-[var(--surface-soft)] px-[10px] py-[11px] text-left text-xs font-bold uppercase text-[var(--muted)]">Plan</th>
                  <th className="border-b border-[var(--line)] bg-[var(--surface-soft)] px-[10px] py-[11px] text-left text-xs font-bold uppercase text-[var(--muted)]">Aktual</th>
                  <th className="border-b border-[var(--line)] bg-[var(--surface-soft)] px-[10px] py-[11px] text-left text-xs font-bold uppercase text-[var(--muted)]">Hutang</th>
                  <th className="border-b border-[var(--line)] bg-[var(--surface-soft)] px-[10px] py-[11px] text-left text-xs font-bold uppercase text-[var(--muted)]">Notes</th>
                  <th className="border-b border-[var(--line)] bg-[var(--surface-soft)] px-[10px] py-[11px] text-left text-xs font-bold uppercase text-[var(--muted)]">Dealer</th>
                </tr>
              </thead>
              <tbody>
                {list.items.map((item: PickingItem) => {
                  const mismatch = item.actualQty !== item.plannedQty;
                  const notesRequired = mismatch && !item.note.trim();
                  return (
                    <tr key={item.id}>
                      <td className="border-b border-[var(--line)] px-[10px] py-[11px] align-top">
                        <div className="grid place-items-center">
                          <input
                            type="checkbox"
                            checked={item.confirmed}
                            onChange={(e) => onItemChange(item.id, "confirmed", e.target.checked)}
                            disabled={!canEdit || (mismatch && !item.note.trim())}
                            className="h-[22px] w-[22px] accent-teal-700"
                          />
                        </div>
                      </td>
                      <td className="border-b border-[var(--line)] px-[10px] py-[11px] align-top">
                        <strong className="text-sm">{item.name}</strong>
                        <br />
                        <small className="text-[var(--muted)]">{item.code}</small>
                      </td>
                      <td className="border-b border-[var(--line)] px-[10px] py-[11px] align-top text-sm">{item.category}</td>
                      <td className="border-b border-[var(--line)] px-[10px] py-[11px] align-top text-sm">{item.plannedQty}</td>
                      <td className="border-b border-[var(--line)] px-[10px] py-[11px] align-top">
                        <input
                          type="number"
                          min={0}
                          value={item.actualQty}
                          onChange={(e) => onItemChange(item.id, "actualQty", e.target.value)}
                          disabled={!canEdit}
                          className="w-[82px] rounded-md border border-[var(--line)] px-[9px] py-[7px] text-sm disabled:opacity-55 disabled:cursor-not-allowed"
                        />
                      </td>
                      <td className="border-b border-[var(--line)] px-[10px] py-[11px] align-top">
                        <span className="inline-flex min-h-[26px] items-center rounded-full bg-amber-100 px-[9px] py-[4px] text-xs font-bold text-amber-800">
                          {debtForItem(list, item)}
                        </span>
                      </td>
                      <td className="border-b border-[var(--line)] px-[10px] py-[11px] align-top">
                        <textarea
                          value={item.note}
                          onChange={(e) => onItemChange(item.id, "note", e.target.value)}
                          disabled={!canEdit}
                          className={`min-h-[46px] w-[240px] rounded-md border px-[9px] py-[7px] text-sm disabled:opacity-55 disabled:cursor-not-allowed ${notesRequired ? "border-red-400 bg-red-50" : "border-[var(--line)]"}`}
                          placeholder={notesRequired ? "Wajib diisi..." : ""}
                        />
                      </td>
                      <td className="border-b border-[var(--line)] px-[10px] py-[11px] align-top">
                        <div className="mt-[10px] border-l-[3px] border-[var(--line)] pl-[10px] text-[13px] text-[var(--muted)]">
                          {item.dealers.map((d, i) => (
                            <div key={d.code + i}>{d.code} - {d.dealer}: {d.qty}</div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex gap-3">
            {canEdit && (
              <button
                type="submit"
                className="rounded-md bg-amber-600 px-[13px] py-[9px] font-bold text-white hover:bg-amber-700"
              >
                Complete Picking
              </button>
            )}
          </div>
        </div>
      </form>

      {modalItem && (
        <PickingItemModal
          item={modalItem}
          list={list}
          canEdit={canEdit}
          onItemChange={onItemChange}
          onClose={() => setModalItem(null)}
        />
      )}
    </div>
  );
}
