"use client";

import { useState } from "react";
import SignaturePad from "@/components/SignaturePad";
import { X } from "lucide-react";

interface ConfirmExcessModalProps {
  itemName: string;
  dealerQty: number;
  onConfirm: (data: { driver: string; returnDate: string; notes: string; signatureDealer: string; signatureDriver: string }) => void;
  onClose: () => void;
}

export default function ConfirmExcessModal({ itemName, dealerQty, onConfirm, onClose }: ConfirmExcessModalProps) {
  const [driver, setDriver] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [notes, setNotes] = useState("");
  const [sigDealer, setSigDealer] = useState("");
  const [sigDriver, setSigDriver] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sigDealer || !sigDriver || !driver.trim() || !returnDate) {
      setError("Semua field wajib diisi.");
      return;
    }
    onConfirm({
      driver: driver.trim(),
      returnDate,
      notes,
      signatureDealer: sigDealer,
      signatureDriver: sigDriver,
    });
  };

  return (
    <div className="fixed inset-0 z-30 grid place-items-center bg-black/45 p-5">
      <div className="max-h-[90vh] w-full max-w-[620px] overflow-auto rounded-lg bg-[var(--surface)] p-[18px] shadow-lg">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="m-0 text-lg font-bold">Konfirmasi Barang Lebih (Retur)</h3>
          <button type="button" onClick={onClose} className="rounded-md p-1 hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>
        <p className="mb-4 text-sm text-[var(--muted)]">
          Barang <strong>{itemName}</strong> diterima dengan kelebihan. Harap isi informasi pengembalian.
        </p>
        {error && (
          <div className="mb-3 rounded-lg border border-[#fecdca] bg-[#fff1f0] px-4 py-3 text-sm text-[#7a271a]">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-[7px]">
              <label className="text-[13px] font-bold text-[var(--text-secondary)]">Driver pembawa kembali</label>
              <input
                value={driver}
                onChange={(e) => setDriver(e.target.value)}
                className="rounded-md border border-[var(--line)] px-[11px] py-[10px] text-sm"
              />
            </div>
            <div className="grid gap-[7px]">
              <label className="text-[13px] font-bold text-[var(--text-secondary)]">Tanggal dikembalikan</label>
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="rounded-md border border-[var(--line)] px-[11px] py-[10px] text-sm"
              />
            </div>
          </div>
          <div className="grid gap-[7px]">
            <label className="text-[13px] font-bold text-[var(--text-secondary)]">Catatan</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[60px] rounded-md border border-[var(--line)] px-[11px] py-[10px] text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-[13px] font-bold text-[var(--text-secondary)]">Tanda Tangan Dealer</label>
            <SignaturePad onSign={setSigDealer} />
          </div>
          <div>
            <label className="mb-1 block text-[13px] font-bold text-[var(--text-secondary)]">Tanda Tangan Driver</label>
            <SignaturePad onSign={setSigDriver} />
          </div>
          <button type="submit" className="rounded-md bg-red-600 px-[13px] py-[9px] font-bold text-white hover:bg-red-700">
            Konfirmasi Retur
          </button>
        </form>
      </div>
    </div>
  );
}
