"use client";

import { useState } from "react";
import type { PickingList } from "@/lib/types";
import SignaturePad from "@/components/SignaturePad";

interface HandoverPanelProps {
  list: PickingList;
  canEdit: boolean;
  onSave: (data: { signatureAdmin: string; signatureDriver: string; adminName: string; driverName: string }) => void;
}

export default function HandoverPanel({ list, canEdit, onSave }: HandoverPanelProps) {
  const [signatureAdmin, setSignatureAdmin] = useState(list.handover?.signatureAdmin || "");
  const [signatureDriver, setSignatureDriver] = useState(list.handover?.signatureDriver || "");
  const [adminName, setAdminName] = useState(list.handover?.adminName || "");
  const [driverName, setDriverName] = useState(list.handover?.driverName || "");
  const [error, setError] = useState("");

  if (list.handover) {
    return (
      <div className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-4 shadow-sm">
        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <h3 className="mb-2 text-sm font-bold">Tanda Tangan Admin</h3>
            <div className="flex min-h-[220px] items-center justify-center overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--surface-soft)]">
              <img src={list.handover.signatureAdmin} alt="Tanda tangan admin" className="h-full w-full object-cover" />
            </div>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-bold">Tanda Tangan Driver</h3>
            <div className="flex min-h-[220px] items-center justify-center overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--surface-soft)]">
              <img src={list.handover.signatureDriver} alt="Tanda tangan driver" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-[#fcd89a] bg-[#fffbeb] px-4 py-3 text-sm text-[#713b12]">
          Serah terima diselesaikan {list.handover.at} oleh {list.handover.by}. Admin: {list.handover.adminName}. Driver: {list.handover.driverName}.
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!signatureAdmin || !signatureDriver || !adminName.trim() || !driverName.trim()) {
      setError("Tanda tangan admin, tanda tangan driver, nama admin, dan nama driver wajib diisi.");
      return;
    }
    onSave({ signatureAdmin, signatureDriver, adminName: adminName.trim(), driverName: driverName.trim() });
  };

  const isReady = list.status === "picked" && canEdit;

  return (
    <div className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-4 shadow-sm">
      {list.status !== "picked" && (
        <div className="mb-4 rounded-lg border border-[#fecdca] bg-[#fff1f0] px-4 py-3 text-sm text-[#7a271a]">
          Picking harus complete sebelum serah terima.
        </div>
      )}
      {error && (
        <div className="mb-4 rounded-lg border border-[#fecdca] bg-[#fff1f0] px-4 py-3 text-sm text-[#7a271a]">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SignaturePad label="Tanda Tangan Admin" onSign={setSignatureAdmin} disabled={!isReady} />
          <SignaturePad label="Tanda Tangan Driver" onSign={setSignatureDriver} disabled={!isReady} />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="grid gap-[7px]">
            <label className="text-[13px] font-bold text-[var(--text-secondary)]">Nama admin</label>
            <input
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              disabled={!isReady}
              className="w-full rounded-md border border-[var(--line)] px-[11px] py-[10px] text-sm text-[var(--text-primary)] disabled:opacity-55 disabled:cursor-not-allowed"
            />
          </div>
          <div className="grid gap-[7px]">
            <label className="text-[13px] font-bold text-[var(--text-secondary)]">Nama driver</label>
            <input
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              disabled={!isReady}
              className="w-full rounded-md border border-[var(--line)] px-[11px] py-[10px] text-sm text-[var(--text-primary)] disabled:opacity-55 disabled:cursor-not-allowed"
            />
          </div>
        </div>
        {isReady && (
          <button
            type="submit"
            className="self-start rounded-md bg-teal-700 px-[13px] py-[9px] font-bold text-white hover:bg-teal-800 max-sm:self-center max-sm:w-full max-sm:text-center"
          >
            Selesaikan Serah Terima
          </button>
        )}
      </form>
    </div>
  );
}
