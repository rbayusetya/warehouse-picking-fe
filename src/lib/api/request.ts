import type {
  User,
  PickingList,
  PickingItem,
  Handover,
  HistoryEntry,
  Settlement,
  DealerInfo,
  DealerReturn,
} from "../types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

// ---- Token / Cookie helpers ----

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

export function setAuthCookie(token: string): void {
  document.cookie = `auth_token=${token};path=/;max-age=86400;samesite=lax`;
}

export function clearAuthCookie(): void {
  document.cookie = "auth_token=;path=/;max-age=0";
}

// ---- HTTP request helper ----

export async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `API ${res.status}`);
  }
  return res.json();
}

// ---- Mappers ----

export function mapUser(data: any): User {
  return {
    username: data.username,
    name: data.name,
    role: data.role,
    roleLabel: data.role_label,
    dealerCode: data.dealer_code ?? undefined,
    expedition: data.expedition ?? undefined,
  };
}

export function mapSettlement(data: any): Settlement {
  return {
    qty: data.qty,
    date: data.date,
    driver: data.driver,
    note: data.note,
    by: data.by ?? "",
    at: data.at,
  };
}

export function mapDealerInfo(data: any): DealerInfo {
  return { noSo: data.no_so ?? "", code: data.code, dealer: data.dealer, qty: data.qty };
}

export function mapDealerReturn(data: any): DealerReturn | undefined {
  if (!data) return undefined;
  return {
    driver: data.driver,
    returnDate: data.return_date,
    notes: data.notes ?? "",
    signatureDealer: "",
    signatureDriver: "",
  };
}

export function mapDealerConfirmations(
  items: any[],
): Record<string, "pending" | "match" | "shortage" | "excess"> {
  const map: Record<string, "pending" | "match" | "shortage" | "excess"> = {};
  for (const dc of items) {
    map[dc.dealer_code] = dc.status as any;
  }
  return map;
}

export function mapDealerReturnForItem(items: any[]): DealerReturn | undefined {
  for (const dc of items) {
    if (dc.return_record) return mapDealerReturn(dc.return_record);
  }
  return undefined;
}

export function mapPickingItem(data: any): PickingItem {
  return {
    id: data.id,
    code: data.code,
    name: data.name,
    category: data.category,
    plannedQty: data.planned_qty,
    actualQty: data.actual_qty ?? 0,
    confirmed: data.confirmed ?? false,
    note: data.note ?? "",
    settlements: (data.settlements ?? []).map(mapSettlement),
    dealers: (data.dealers ?? []).map(mapDealerInfo),
    dealerConfirmed:
      (data.dealer_confirmations ?? []).length > 0
        ? mapDealerConfirmations(data.dealer_confirmations)
        : undefined,
    dealerReturn:
      (data.dealer_confirmations ?? []).length > 0
        ? mapDealerReturnForItem(data.dealer_confirmations)
        : undefined,
  };
}

export function mapHistoryEntry(data: any): HistoryEntry {
  return { at: data.at, by: data.by ?? "", text: data.text };
}

export function mapHandover(data: any): Handover | null {
  if (!data) return null;
  return {
    at: data.created_at ?? "",
    by: data.created_by ?? "",
    adminName: data.admin_name,
    driverName: data.driver_name,
    signatureAdmin: data.signature_admin_url ?? "",
    signatureDriver: data.signature_driver_url ?? "",
  };
}

export function mapPickingList(data: any): PickingList {
  return {
    id: data.picking_id || data.id,
    date: data.date,
    noDs: data.no_ds ?? "",
    expedition: data.expedition,
    plate: data.plate ?? "",
    driver: data.driver,
    status: data.status ?? "draft",
    handover: mapHandover(data.handover),
    history: (data.history ?? []).map(mapHistoryEntry),
    items: (data.items ?? []).map(mapPickingItem),
  };
}
