"use client";

import type { HistoryEntry } from "@/lib/types";

interface TimelineProps {
  entries: (HistoryEntry & { pickingId: string })[];
}

export default function Timeline({ entries }: TimelineProps) {
  if (entries.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-[var(--line)] bg-[var(--surface)]/55 p-[26px] text-center text-[var(--muted)]">
        Belum ada histori.
      </div>
    );
  }

  return (
    <div className="grid gap-[10px]">
      {entries.map((entry, i) => (
        <div
          key={i}
          className="border-l-[3px] border-teal-700 bg-[var(--surface)] px-3 py-2 text-sm shadow-sm"
        >
          <strong>{entry.pickingId}</strong> - {entry.text}
          <br />
          <small className="text-[var(--muted)]">{entry.at} oleh {entry.by}</small>
        </div>
      ))}
    </div>
  );
}
