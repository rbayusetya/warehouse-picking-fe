"use client";

interface StatCardProps {
  label: string;
  value: string | number;
  subtext: string;
}

export default function StatCard({ label, value, subtext }: StatCardProps) {
  return (
    <div className="min-h-[100px] rounded-lg border border-[var(--line)] bg-[var(--surface)] p-3 shadow-sm max-lg:min-h-[88px] max-lg:p-2.5">
      <span className="text-[13px] font-bold text-[var(--muted)] max-lg:text-[12px]">{label}</span>
      <strong className="mt-2 block text-[30px] font-bold text-[var(--text-primary)] max-lg:mt-1 max-lg:text-[24px]">{value}</strong>
      <small className="text-[var(--muted)] max-lg:text-[11px]">{subtext}</small>
    </div>
  );
}
