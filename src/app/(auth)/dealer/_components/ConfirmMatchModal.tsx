"use client";

import { useState } from "react";
import SignaturePad from "@/components/SignaturePad";
import { X } from "lucide-react";

interface ConfirmMatchModalProps {
  itemName: string;
  onConfirm: (signatureDealer: string, signatureDriver: string) => void;
  onClose: () => void;
}

export default function ConfirmMatchModal({ itemName, onConfirm, onClose }: ConfirmMatchModalProps) {
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
          <h3 className="m-0 text-lg font-bold">Konfirmasi Barang Sesuai</h3>
          <button type="button" onClick={onClose} className="rounded-md p-1 hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>
        <p className="mb-4 text-sm text-[var(--muted)]">
          Barang <strong>{itemName}</strong> telah diterima sesuai. Silakan tanda tangan untuk konfirmasi.
        </p>
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
          <button type="submit" className="rounded-md bg-green-600 px-[13px] py-[9px] font-bold text-white hover:bg-green-700">
            Konfirmasi Sesuai
          </button>
        </form>
      </div>
    </div>
  );
}
