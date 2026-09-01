"use client";

import type { PickingList, PickingItem, DealerConfirmAction } from "@/lib/types";

interface DealerItemRowProps {
  list: PickingList;
  item: PickingItem;
  dealerCode: string;
  onConfirm: (itemId: string, action: DealerConfirmAction) => void;
}

export default function DealerItemRow({ list, item, dealerCode, onConfirm }: DealerItemRowProps) {
  const dealerInfo = item.dealers.find((d) => d.code === dealerCode);
  const status = item.dealerConfirmed?.[dealerCode] || "pending";

  const statusBadge = () => {
    switch (status) {
      case "match":
        return <span className="inline-flex min-h-[26px] items-center rounded-full bg-green-100 px-[9px] py-[4px] text-xs font-bold text-green-800">Sesuai</span>;
      case "shortage":
        return <span className="inline-flex min-h-[26px] items-center rounded-full bg-amber-100 px-[9px] py-[4px] text-xs font-bold text-amber-800">Hutang</span>;
      case "excess":
        return <span className="inline-flex min-h-[26px] items-center rounded-full bg-red-100 px-[9px] py-[4px] text-xs font-bold text-red-800">Lebih</span>;
      default:
        return <span className="inline-flex min-h-[26px] items-center rounded-full bg-gray-100 px-[9px] py-[4px] text-xs font-bold text-gray-600">Pending</span>;
    }
  };

  return (
    <div className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="m-0 text-sm font-bold">{item.name}</h4>
            {statusBadge()}
          </div>
          <p className="m-0 mt-1 text-xs text-[var(--muted)]">
            {item.code} | {item.category} | Plan: {item.plannedQty} | Aktual: {item.actualQty}
          </p>
          {dealerInfo && (
            <p className="m-0 mt-1 text-xs text-[var(--muted)]">
              SO: {dealerInfo.noSo} | Qty untuk dealer: {dealerInfo.qty}
            </p>
          )}
          {item.note && (
            <p className="m-0 mt-1 text-xs text-amber-700">Note admin: {item.note}</p>
          )}
          {item.settlements.length > 0 && (
            <div className="mt-2 border-l-2 border-amber-300 pl-2">
              <p className="text-xs font-bold text-amber-800">Riwayat pembayaran hutang:</p>
              {item.settlements.map((s, i) => (
                <p key={i} className="text-xs text-amber-700">
                  {s.date} - {s.qty} qty dibawa {s.driver} ({s.by})
                  {s.note ? `: ${s.note}` : ""}
                </p>
              ))}
            </div>
          )}
          {item.dealerReturn && (
            <div className="mt-2 border-l-2 border-red-300 pl-2">
              <p className="text-xs text-red-700">
                Return: {item.dealerReturn.returnDate} oleh driver {item.dealerReturn.driver}
                {item.dealerReturn.notes ? ` (${item.dealerReturn.notes})` : ""}
              </p>
            </div>
          )}
        </div>
        {status === "pending" && (
          <div className="flex flex-shrink-0 flex-col gap-2">
            <button
              type="button"
              onClick={() => onConfirm(item.id, "match")}
              className="rounded-md bg-green-600 px-[10px] py-[6px] text-xs font-bold text-white hover:bg-green-700"
            >
              Sesuai
            </button>
            <button
              type="button"
              onClick={() => onConfirm(item.id, "shortage")}
              className="rounded-md bg-amber-600 px-[10px] py-[6px] text-xs font-bold text-white hover:bg-amber-700"
            >
              Hutang
            </button>
            <button
              type="button"
              onClick={() => onConfirm(item.id, "excess")}
              className="rounded-md bg-red-600 px-[10px] py-[6px] text-xs font-bold text-white hover:bg-red-700"
            >
              Lebih
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
