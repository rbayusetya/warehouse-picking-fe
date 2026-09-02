"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { payDebt, createSettlementHandover } from "@/lib/api";
import SignaturePad from "@/components/SignaturePad";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function DebtPayPage() {
  const router = useRouter();
  const params = useSearchParams();

  const itemId = params.get("itemId") ?? "";
  const itemName = params.get("itemName") ?? "";
  const plannedQty = params.get("plannedQty") ?? "0";
  const actualQty = params.get("actualQty") ?? "0";
  const debt = params.get("debt") ?? "0";

  const [qty, setQty] = useState<number>(parseFloat(debt) || 0);
  const [date, setDate] = useState("");
  const [driver, setDriver] = useState("");
  const [note, setNote] = useState("");
  const [adminName, setAdminName] = useState("");
  const [driverName, setDriverName] = useState("");
  const [signatureAdmin, setSignatureAdmin] = useState("");
  const [signatureDriver, setSignatureDriver] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!qty || qty <= 0) { setError("Qty pembayaran harus diisi."); return; }
    if (!date) { setError("Tanggal harus diisi."); return; }
    if (!driver.trim()) { setError("Driver pembawa harus diisi."); return; }
    if (!adminName.trim()) { setError("Nama admin harus diisi."); return; }
    if (!driverName.trim()) { setError("Nama driver harus diisi."); return; }
    if (!signatureAdmin) { setError("Tanda tangan admin wajib."); return; }
    if (!signatureDriver) { setError("Tanda tangan driver wajib."); return; }

    setLoading(true);
    try {
      const settlement = await payDebt({
        picking_item_id: itemId,
        qty,
        date,
        driver: driver.trim(),
        note: note.trim(),
      });
      const settlementId = settlement.settlement?.id || settlement.id;
      if (!settlementId) throw new Error("Gagal mendapatkan ID settlement");

      await createSettlementHandover({
        settlement_id: settlementId,
        admin_name: adminName.trim(),
        driver_name: driverName.trim(),
        signature_admin: signatureAdmin || null,
        signature_driver: signatureDriver || null,
      });

      router.push("/debts");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <Link href="/debts" className="mb-1.5 inline-flex items-center gap-1 text-[13px] text-[var(--muted)] no-underline hover:text-[var(--text-primary)]">
          <ArrowLeft size={15} />
          Kembali
        </Link>
        <h2 className="m-0 mb-1 text-[23px] font-bold">Bayar Hutang & Serah Terima</h2>
        <p className="m-0 text-[var(--muted)]">{itemName} — Plan: {plannedQty}, Aktual: {actualQty}, Sisa: {debt}</p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-[#fecdca] bg-[#fff1f0] px-4 py-3 text-sm text-[#7a271a]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-4 shadow-sm">
          <h3 className="m-0 mb-3 text-sm font-bold">Data Pembayaran</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-[7px]">
              <label className="text-[13px] font-bold text-[var(--text-secondary)]">Qty bayar</label>
              <input
                type="number"
                min={1}
                max={parseFloat(debt)}
                value={qty}
                onChange={(e) => setQty(parseFloat(e.target.value) || 0)}
                className="w-full rounded-md border border-[var(--line)] px-[11px] py-[10px] text-sm text-[var(--text-primary)]"
              />
            </div>
            <div className="grid gap-[7px]">
              <label className="text-[13px] font-bold text-[var(--text-secondary)]">Tanggal</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-md border border-[var(--line)] px-[11px] py-[10px] text-sm text-[var(--text-primary)]"
              />
            </div>
            <div className="grid gap-[7px]">
              <label className="text-[13px] font-bold text-[var(--text-secondary)]">Driver pembawa</label>
              <input
                value={driver}
                onChange={(e) => setDriver(e.target.value)}
                className="w-full rounded-md border border-[var(--line)] px-[11px] py-[10px] text-sm text-[var(--text-primary)]"
              />
            </div>
            <div className="grid gap-[7px]">
              <label className="text-[13px] font-bold text-[var(--text-secondary)]">Catatan</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="min-h-[34px] w-full rounded-md border border-[var(--line)] px-[11px] py-[10px] text-sm text-[var(--text-primary)]"
              />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-4 shadow-sm">
          <h3 className="m-0 mb-3 text-sm font-bold">Serah Terima Pembayaran</h3>
          <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SignaturePad label="Tanda Tangan Admin" onSign={setSignatureAdmin} />
            <SignaturePad label="Tanda Tangan Driver" onSign={setSignatureDriver} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-[7px]">
              <label className="text-[13px] font-bold text-[var(--text-secondary)]">Nama admin</label>
              <input
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                className="w-full rounded-md border border-[var(--line)] px-[11px] py-[10px] text-sm text-[var(--text-primary)]"
              />
            </div>
            <div className="grid gap-[7px]">
              <label className="text-[13px] font-bold text-[var(--text-secondary)]">Nama driver</label>
              <input
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                className="w-full rounded-md border border-[var(--line)] px-[11px] py-[10px] text-sm text-[var(--text-primary)]"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="self-start rounded-md bg-teal-700 px-[13px] py-[9px] font-bold text-white hover:bg-teal-800 disabled:opacity-50 max-sm:self-center max-sm:w-full max-sm:text-center"
        >
          {loading ? "Memproses..." : "Simpan Pembayaran & Serah Terima"}
        </button>
      </form>
    </div>
  );
}
