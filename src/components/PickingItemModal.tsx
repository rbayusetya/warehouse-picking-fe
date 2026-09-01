"use client";

import { useEffect, useRef } from "react";
import type { PickingItem, PickingList } from "@/lib/types";
import { debtForItem } from "@/lib/utils";

interface PickingItemModalProps {
  item: PickingItem;
  list: PickingList;
  canEdit: boolean;
  onItemChange: (itemId: string, field: string, value: string | number | boolean) => void;
  onClose: () => void;
}

export default function PickingItemModal({ item, list, canEdit, onItemChange, onClose }: PickingItemModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  const mismatch = item.actualQty !== item.plannedQty;
  const notesRequired = mismatch && !item.note.trim();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleBackdrop = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onClose();
  };

  const handleQtyChange = (delta: number) => {
    const next = Math.max(0, item.actualQty + delta);
    onItemChange(item.id, "actualQty", String(next));
  };

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdrop}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 md:items-center"
    >
      <div
        ref={sheetRef}
        className="flex max-h-[85vh] w-full flex-col rounded-t-2xl bg-[var(--surface)] px-5 pb-8 pt-4 shadow-xl md:max-h-[80vh] md:w-[480px] md:rounded-2xl"
      >
        {/* Handle */}
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-[var(--line)]" />

        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="m-0 text-[17px] font-bold text-[var(--text-primary)]">{item.name}</h3>
            <p className="m-0 mt-[2px] text-[13px] text-[var(--muted)]">{item.code}</p>
          </div>
          <button
            onClick={onClose}
            className="-mr-1 -mt-1 flex h-8 w-8 items-center justify-center rounded-full text-[var(--muted)] hover:bg-[var(--surface-soft)]"
          >
            ✕
          </button>
        </div>

        {/* Category badge */}
        <div className="mb-4">
          <span className="inline-flex min-h-[26px] items-center rounded-full bg-[var(--surface-soft)] px-[9px] py-[4px] text-xs font-bold text-[var(--text-secondary)]">
            {item.category}
          </span>
        </div>

        {/* Quantity row */}
        <div className="mb-4 grid grid-cols-3 gap-3 rounded-lg border border-[var(--line)] p-3">
          <div>
            <label className="text-[11px] font-bold uppercase text-[var(--muted)]">Plan</label>
            <p className="m-0 mt-1 text-lg font-bold">{item.plannedQty}</p>
          </div>
          <div>
            <label className="text-[11px] font-bold uppercase text-[var(--muted)]">Aktual</label>
            <div className="mt-1 flex items-center gap-2">
              {canEdit ? (
                <>
                  <button
                    type="button"
                    onClick={() => handleQtyChange(-1)}
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-[var(--line)] text-lg font-bold text-[var(--text-secondary)] hover:bg-[var(--surface-soft)] disabled:opacity-30"
                    disabled={item.actualQty <= 0}
                  >
                    −
                  </button>
                  <span className="min-w-[32px] text-center text-lg font-bold">{item.actualQty}</span>
                  <button
                    type="button"
                    onClick={() => handleQtyChange(1)}
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-[var(--line)] text-lg font-bold text-[var(--text-secondary)] hover:bg-[var(--surface-soft)]"
                  >
                    +
                  </button>
                </>
              ) : (
                <span className="text-lg font-bold">{item.actualQty}</span>
              )}
            </div>
          </div>
          <div>
            <label className="text-[11px] font-bold uppercase text-[var(--muted)]">Hutang</label>
            <p className="m-0 mt-1 text-lg font-bold text-amber-700">{debtForItem(list, item)}</p>
          </div>
        </div>

        {/* OK checkbox */}
        <div className="mb-4 flex items-center gap-3 rounded-lg border border-[var(--line)] p-3">
          <input
            type="checkbox"
            checked={item.confirmed}
            onChange={(e) => onItemChange(item.id, "confirmed", e.target.checked)}
            disabled={!canEdit || (mismatch && !item.note.trim())}
            className="h-5 w-5 accent-teal-700"
          />
          <label className="text-sm font-bold text-[var(--text-secondary)]">
            OK / Sesuai
            {mismatch && !item.note.trim() && (
              <span className="ml-1 text-xs font-normal text-red-500">(isi notes dahulu)</span>
            )}
          </label>
        </div>

        {/* Notes */}
        <div className="mb-4">
          <label className="mb-1 block text-[11px] font-bold uppercase text-[var(--muted)]">
            Notes
            {notesRequired && <span className="ml-1 text-red-500">* Wajib</span>}
          </label>
          <textarea
            value={item.note}
            onChange={(e) => onItemChange(item.id, "note", e.target.value)}
            disabled={!canEdit}
            placeholder={notesRequired ? "Wajib diisi jika aktual tidak sesuai plan..." : ""}
            className={`min-h-[60px] w-full rounded-md border px-[9px] py-[7px] text-sm disabled:opacity-55 ${notesRequired ? "border-red-400 bg-red-50" : "border-[var(--line)]"}`}
          />
        </div>

        {/* Dealers */}
        <div>
          <label className="mb-1 block text-[11px] font-bold uppercase text-[var(--muted)]">Dealer</label>
          <div className="rounded-lg border border-[var(--line)] p-3">
            {item.dealers.map((d, i) => (
              <div key={d.code + i} className="flex items-center justify-between py-1 text-sm">
                <span className="font-bold text-[var(--text-secondary)]">{d.code}</span>
                <span className="text-[var(--muted)]">{d.dealer}</span>
                <span className="font-bold">{d.qty}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
