"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { fetchPickingListDetail, createHandover } from "@/lib/api";
import { statusLabel } from "@/lib/utils";
import type { PickingList } from "@/lib/types";
import HandoverPanel from "@/components/HandoverPanel";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function HandoverDetailPage() {
  const { user } = useAuth();
  const params = useParams();
  const [list, setList] = useState<PickingList | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    if (!params.id) return;
    fetchPickingListDetail(params.id as string)
      .then(setList)
      .catch((e) => setError(e.message));
  }, [params.id]);

  useEffect(() => { load(); }, [load]);

  if (error) {
    return (
      <div className="rounded-lg border border-[#fecdca] bg-[#fff1f0] px-4 py-3 text-sm text-[#7a271a]">
        {error}
      </div>
    );
  }

  if (!list) {
    return (
      <div className="rounded-lg border border-dashed border-[var(--line)] bg-[var(--surface)]/55 p-[26px] text-center text-[var(--muted)]">
        Memuat...
      </div>
    );
  }

  const canEdit = user?.role === "admin" || user?.role === "kepala";

  const handleSave = async (data: { signatureAdmin: string; signatureDriver: string; adminName: string; driverName: string }) => {
    try {
      await createHandover(list.id, {
        admin_name: data.adminName,
        driver_name: data.driverName,
        signature_admin: data.signatureAdmin || null,
        signature_driver: data.signatureDriver || null,
      });
      load();
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <Link href="/handover" className="mb-1.5 inline-flex items-center gap-1 text-[13px] text-[var(--muted)] no-underline hover:text-[var(--text-primary)]">
          <ArrowLeft size={15} />
          Kembali
        </Link>
        <h2 className="m-0 mb-1 text-[23px] font-bold">Serah Terima</h2>
        <p className="m-0 text-[var(--muted)]">
          No Picking List {list.id} - {list.driver} - {list.expedition}
        </p>
      </div>

      <HandoverPanel list={list} canEdit={canEdit} onSave={handleSave} />
    </div>
  );
}
