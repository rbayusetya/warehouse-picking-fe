"use client";

import { useState } from "react";
import SignaturePad from "./SignaturePad";
import { X } from "lucide-react";

interface ConfirmShortageModalProps {
  itemName: string;
  debtNote: string;
  settlements: { qty: number; date: string; driver: string; note: string; by: string }[];
  onConfirm: (signatureDealer: string, signatureDriver: string) => void;
  onClose: () => void;
}

export default function ConfirmShortageModal({ itemName, debtNote, settlements, onConfirm, onClose }: ConfirmShortageModalProps) {
  const [sigDealer, setSigDealer] = useState("");
  const [sigDriver, setSigDriver] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sigDealer || !sigDriver) {
      setError("Tanda tangan dealer dan driver wajib diisi.");
      return;
    }
    onConfirm(sigDealer, sigDriver);
  };

  return (
    <div className="fixed inset-0 z-30 grid place-items-center bg-black/45 p-5">
      <div className="max-h-[90vh] w-full max-w-[620px] overflow-auto rounded-lg bg-[var(--surface)] p-[18px] shadow-lg">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="m-0 text-lg font-bold">Konfirmasi Hutang Barang</h3>
          <button type="button" onClick={onClose} className="rounded-md p-1 hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>
        <p className="mb-4 text-sm text-[var(--muted)]">
          Barang <strong>{itemName}</strong> diterima dengan kekurangan (hutang).
        </p>
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="mb-2 text-sm font-bold text-amber-800">Dokumen Hutang:</p>
          {debtNote && <p className="mb-2 text-sm text-amber-700">Note admin: {debtNote}</p>}
          {settlements.length > 0 ? (
            <div>
              <p className="text-xs font-bold text-amber-800">Riwayat pembayaran:</p>
              {settlements.map((s, i) => (
                <p key={i} className="text-xs text-amber-700">
                  {s.date} - {s.qty} qty dibawa {s.driver} ({s.by})
                  {s.note ? `: ${s.note}` : ""}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-xs text-amber-600">Belum ada pembayaran.</p>
          )}
        </div>
        {error && (
          <div className="mb-3 rounded-lg border border-[#fecdca] bg-[#fff1f0] px-4 py-3 text-sm text-[#7a271a]">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div>
            <label className="mb-1 block text-[13px] font-bold text-[var(--text-secondary)]">Tanda Tangan Dealer</label>
            <SignaturePad onSign={setSigDealer} />
          </div>
          <div>
            <label className="mb-1 block text-[13px] font-bold text-[var(--text-secondary)]">Tanda Tangan Driver</label>
            <SignaturePad onSign={setSigDriver} />
          </div>
          <button type="submit" className="rounded-md bg-amber-600 px-[13px] py-[9px] font-bold text-white hover:bg-amber-700">
            Konfirmasi Hutang
          </button>
        </form>
      </div>
    </div>
  );
}
