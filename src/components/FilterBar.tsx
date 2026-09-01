"use client";

interface FilterBarProps {
  dates: string[];
  drivers: string[];
  expeditions: string[];
  filters: Record<string, string>;
  onChange: (key: string, value: string) => void;
  showExpedition?: boolean;
}

export default function FilterBar({
  dates,
  drivers,
  expeditions,
  filters,
  onChange,
  showExpedition = true,
}: FilterBarProps) {
  return (
    <div className="mb-4 grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3">
      <div className="grid gap-[7px]">
        <label className="text-[13px] font-bold text-[var(--text-secondary)]">Tanggal</label>
        <input
          list="date-list"
          value={filters.date || ""}
          onChange={(e) => onChange("date", e.target.value)}
          placeholder="Cari atau pilih tanggal..."
          className="w-full rounded-md border border-[var(--line)] bg-[var(--surface)] px-[11px] py-[10px] text-sm text-[var(--text-primary)]"
        />
        <datalist id="date-list">
          {dates.map((d) => (
            <option key={d} value={d} />
          ))}
        </datalist>
      </div>
      <div className="grid gap-[7px]">
        <label className="text-[13px] font-bold text-[var(--text-secondary)]">Driver</label>
        <input
          list="driver-list"
          value={filters.driver || ""}
          onChange={(e) => onChange("driver", e.target.value)}
          placeholder="Cari atau pilih driver..."
          className="w-full rounded-md border border-[var(--line)] bg-[var(--surface)] px-[11px] py-[10px] text-sm text-[var(--text-primary)]"
        />
        <datalist id="driver-list">
          {drivers.map((d) => (
            <option key={d} value={d} />
          ))}
        </datalist>
      </div>
      {showExpedition && (
        <div className="grid gap-[7px]">
          <label className="text-[13px] font-bold text-[var(--text-secondary)]">Ekspedisi</label>
          <input
            list="expedition-list"
            value={filters.expedition || ""}
            onChange={(e) => onChange("expedition", e.target.value)}
            placeholder="Cari atau pilih ekspedisi..."
            className="w-full rounded-md border border-[var(--line)] bg-[var(--surface)] px-[11px] py-[10px] text-sm text-[var(--text-primary)]"
          />
          <datalist id="expedition-list">
            {expeditions.map((e) => (
              <option key={e} value={e} />
            ))}
          </datalist>
        </div>
      )}
      <div className="grid gap-[7px]">
        <label className="text-[13px] font-bold text-[var(--text-secondary)]">&nbsp;</label>
        <button
          type="button"
          onClick={() => { onChange("date", ""); onChange("driver", ""); onChange("expedition", ""); }}
          className="rounded-md border border-[var(--line)] bg-[var(--surface)] px-[13px] py-[10px] text-sm font-bold text-[var(--text-secondary)] hover:bg-[var(--surface-soft)]"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
