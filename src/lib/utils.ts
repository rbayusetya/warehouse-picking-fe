import type { PickingList, PickingItem } from "./types";

export function nowText(): string {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${dd}/${mm}/${yyyy} ${hh}:${mi}`;
}

export function statusLabel(list: PickingList): string {
  const totals = listTotals(list);
  if (list.handover) return totals.debt > 0 ? "Serah terima dengan hutang" : "Selesai";
  if (list.status === "picked") return totals.debt > 0 ? "Picking kurang" : "Siap serah terima";
  if (totals.confirmed > 0) return "Proses picking";
  return "Belum picking";
}

export function listTotals(list: PickingList) {
  const planned = list.items.reduce((s, i) => s + i.plannedQty, 0);
  const actual = list.items.reduce((s, i) => s + i.actualQty, 0);
  const paid = list.items.reduce((s, i) => s + i.settlements.reduce((p, r) => p + r.qty, 0), 0);
  const debtActive = list.status === "picked" || !!list.handover;
  const debt = debtActive ? Math.max(planned - actual - paid, 0) : 0;
  const confirmed = list.items.filter((i) => i.confirmed).length;
  return { planned, actual, paid, debt, confirmed };
}

export function debtForItem(list: PickingList, item: PickingItem): number {
  const debtActive = list.status === "picked" || !!list.handover;
  if (!debtActive) return 0;
  const paid = item.settlements.reduce((s, r) => s + r.qty, 0);
  return Math.max(item.plannedQty - item.actualQty - paid, 0);
}

export function normalizeQty(v: number | string): number {
  const n = typeof v === "string" ? parseFloat(v) : v;
  return isNaN(n) ? 0 : n;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}
