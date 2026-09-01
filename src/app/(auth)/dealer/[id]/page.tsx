"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { fetchDealerItems, confirmDealerItem } from "@/lib/api";
import type { DealerItemEntry } from "@/lib/api";
import type { DealerConfirmAction } from "@/lib/types";
import DealerItemRow from "@/components/DealerItemRow";
import ConfirmMatchModal from "@/components/ConfirmMatchModal";
import ConfirmShortageModal from "@/components/ConfirmShortageModal";
import ConfirmExcessModal from "@/components/ConfirmExcessModal";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function DealerDetailPage() {
  const { user } = useAuth();
  const params = useParams();
  const [items, setItems] = useState<DealerItemEntry[]>([]);
  const [error, setError] = useState("");
  const [modal, setModal] = useState<{
    type: DealerConfirmAction;
    itemId: string;
    itemName: string;
  } | null>(null);

  const load = useCallback(() => {
    if (!params.id || !user?.dealerCode) return;
    fetchDealerItems(params.id as string)
      .then(setItems)
      .catch((e) => setError(e.message));
  }, [params.id, user?.dealerCode]);

  useEffect(() => { load(); }, [load]);

  const dealerCode = user?.dealerCode;

  const handleConfirm = useCallback(
    (itemId: string, action: DealerConfirmAction) => {
      const entry = items.find((i) => i.item_id === itemId);
      if (!entry) return;
      setModal({ type: action, itemId, itemName: entry.item_name });
    },
    [items],
  );

  const handleMatchConfirm = useCallback(
    async (signatureDealer: string, signatureDriver: string) => {
      if (!modal || !dealerCode) return;
      try {
        await confirmDealerItem({
          picking_item_id: modal.itemId,
          status: "match",
          signature_dealer: signatureDealer || null,
          signature_driver: signatureDriver || null,
        });
        setModal(null);
        load();
      } catch (e: any) {
        alert(e.message);
      }
    },
    [modal, dealerCode, load],
  );

  const handleShortageConfirm = useCallback(
    async (signatureDealer: string, signatureDriver: string) => {
      if (!modal || !dealerCode) return;
      try {
        await confirmDealerItem({
          picking_item_id: modal.itemId,
          status: "shortage",
          signature_dealer: signatureDealer || null,
          signature_driver: signatureDriver || null,
        });
        setModal(null);
        load();
      } catch (e: any) {
        alert(e.message);
      }
    },
    [modal, dealerCode, load],
  );

  const handleExcessConfirm = useCallback(
    async (data: { driver: string; returnDate: string; notes: string; signatureDealer: string; signatureDriver: string }) => {
      if (!modal || !dealerCode) return;
      try {
        await confirmDealerItem({
          picking_item_id: modal.itemId,
          status: "excess",
          signature_dealer: data.signatureDealer || null,
          signature_driver: data.signatureDriver || null,
          return_info: {
            driver: data.driver,
            return_date: data.returnDate,
            notes: data.notes,
          },
        });
        setModal(null);
        load();
      } catch (e: any) {
        alert(e.message);
      }
    },
    [modal, dealerCode, load],
  );

  if (!user || user.role !== "dealer") {
    return (
      <div className="rounded-lg border border-[#fecdca] bg-[#fff1f0] px-4 py-3 text-sm text-[#7a271a]">
        Halaman ini khusus untuk role dealer.
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-[#fecdca] bg-[#fff1f0] px-4 py-3 text-sm text-[#7a271a]">
        {error}
      </div>
    );
  }

  const first = items[0];

  if (!first) {
    return (
      <div className="rounded-lg border border-dashed border-[var(--line)] bg-[var(--surface)]/55 p-[26px] text-center text-[var(--muted)]">
        Memuat...
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <Link href="/dealer" className="mb-1.5 inline-flex items-center gap-1 text-[13px] text-[var(--muted)] no-underline hover:text-[var(--text-primary)]">
          <ArrowLeft size={15} />
          Kembali
        </Link>
        <h2 className="m-0 mb-1 text-[23px] font-bold">Konfirmasi Barang</h2>
        <p className="m-0 text-[var(--muted)]">
          No Picking List {first.picking_id} - {first.driver} - {first.expedition}
        </p>
        <p className="m-0 mt-1 text-xs text-[var(--muted)]">
          Dealer code: {dealerCode} | Tanggal: {first.date}
        </p>
      </div>

      <div className="grid gap-3">
        {items.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[var(--line)] bg-[var(--surface)]/55 p-[26px] text-center text-[var(--muted)]">
            Tidak ada barang untuk dealer ini.
          </div>
        ) : (
          items.map((entry) => (
            <DealerItemRow
              key={entry.item_id}
              list={{ id: entry.picking_list_id, driver: entry.driver, expedition: entry.expedition, date: entry.date, status: "draft", items: [], noDs: "", plate: "", handover: null, history: [] }}
              item={{
                id: entry.item_id,
                code: entry.item_code,
                name: entry.item_name,
                category: entry.item_category,
                plannedQty: entry.planned_qty,
                actualQty: entry.actual_qty,
                confirmed: false,
                note: entry.note,
                settlements: entry.settlements,
                dealers: [{ noSo: "", code: entry.dealer_code, dealer: entry.dealer_name, qty: entry.dealer_qty }],
                dealerConfirmed: entry.confirmation_status ? { [entry.dealer_code]: entry.confirmation_status as any } : undefined,
              }}
              dealerCode={dealerCode!}
              onConfirm={handleConfirm}
            />
          ))
        )}
      </div>

      {modal?.type === "match" && (
        <ConfirmMatchModal
          itemName={modal.itemName}
          onConfirm={handleMatchConfirm}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.type === "shortage" && (
        <ConfirmShortageModal
          itemName={modal.itemName}
          debtNote=""
          settlements={[]}
          onConfirm={handleShortageConfirm}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.type === "excess" && (
        <ConfirmExcessModal
          itemName={modal.itemName}
          dealerQty={1}
          onConfirm={handleExcessConfirm}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
