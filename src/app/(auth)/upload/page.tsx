"use client";

import { useState, useRef } from "react";
import { useAuth } from "@/lib/providers/auth-context";
import { uploadExcel } from "@/lib/api";
import { Upload, Loader, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function UploadPage() {
  const { user } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [imported, setImported] = useState<{ picking_id: string; driver: string; items: number }[] | null>(null);

  if (!user || (user.role !== "admin" && user.role !== "kepala")) {
    return (
        <div className="rounded-lg border border-[#fecdca] bg-[#fff1f0] px-4 py-3 text-sm text-[#7a271a]">
          Akses hanya untuk admin/kepala gudang.
        </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Pilih file Excel terlebih dahulu.");
      return;
    }
    setLoading(true);
    setMessage("");
    setError("");
    setImported(null);
    try {
      const result = await uploadExcel(selectedFile);
      setMessage(`Berhasil mengimpor ${result.imported_count} picking list.`);
      setImported(result.lists.map((l: any) => ({
        picking_id: l.id,
        driver: l.driver,
        items: l.items?.length || 0,
      })));
      setSelectedFile(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div>
        <div className="mb-4">
          <Link href="/dashboard" className="mb-1.5 inline-flex items-center gap-1 text-[13px] text-[var(--muted)] no-underline hover:text-[var(--text-primary)]">
            <ArrowLeft size={15} />
            Kembali
          </Link>
          <h2 className="m-0 mb-1 text-[23px] font-bold">Upload Excel</h2>
          <p className="m-0 text-[var(--muted)]">
            Upload file picking harian. Data baru akan ditambahkan ke database.
          </p>
        </div>

        <div className="mx-auto max-w-2xl rounded-lg border border-[var(--line)] bg-[var(--surface)] p-4 shadow-sm">
          {error && (
              <div className="mb-4 rounded-lg border border-[#fecdca] bg-[#fff1f0] px-4 py-3 text-sm text-[#7a271a]">
                {error}
              </div>
          )}

          {message && (
              <div className="mb-4 rounded-lg border border-[#d1fae5] bg-[#ecfdf5] px-4 py-3 text-sm text-[#065f46]">
                {message}
              </div>
          )}

          <form onSubmit={handleUpload}>
            <label className="group relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[var(--line)] bg-[var(--surface-soft)] p-8 text-center transition hover:border-teal-600 hover:bg-[var(--surface-hover)]">
              <Upload size={40} className="mb-3 text-[var(--muted)] transition-colors group-hover:text-teal-600" />
              <p className="mb-2 text-sm font-bold text-[var(--text-secondary)]">
                Upload file Excel
              </p>
              <p className="mb-4 text-xs text-[var(--muted)]">
                Format .xlsx atau .xls
              </p>

              <input
                  ref={fileRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                  className="hidden"
              />

              <span className="inline-flex items-center rounded-md bg-teal-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-teal-800">
              Choose File
            </span>

              <p className="mt-2 text-xs text-[var(--muted)]">
                {selectedFile ? selectedFile.name : "No file chosen"}
              </p>
            </label>

            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                  type="submit"
                  disabled={loading || !selectedFile}
                  className="inline-flex h-10 items-center gap-2 rounded-md bg-teal-700 px-[15px] text-sm font-bold text-white hover:bg-teal-800 disabled:opacity-55"
              >
                {loading && <Loader size={16} className="animate-spin" />}
                {loading ? "Mengupload..." : "Upload & Proses"}
              </button>
            </div>
          </form>

          {imported && imported.length > 0 && (
              <div className="mt-4 rounded-lg border border-[var(--line)] bg-[var(--surface-soft)] p-4">
                <h3 className="mb-2 text-sm font-bold">Hasil Import:</h3>
                <div className="grid gap-2">
                  {imported.map((l) => (
                      <div key={l.picking_id} className="flex items-center justify-between rounded-md bg-[var(--surface)] px-3 py-2 text-sm shadow-sm">
                        <span className="font-bold">{l.picking_id}</span>
                        <span className="text-[var(--muted)]">{l.driver}</span>
                        <span className="text-[var(--muted)]">{l.items} item</span>
                      </div>
                  ))}
                </div>
              </div>
          )}
        </div>
      </div>
  );
}