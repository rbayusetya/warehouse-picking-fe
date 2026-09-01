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
import type {
  RawUserResponse,
  RawSettlement,
  RawDealerInfo,
  RawDealerReturn,
  RawDealerConfirmation,
  RawPickingItem,
  RawHistoryEntry,
  RawHandover,
  RawPickingListDetail,
} from "./response-types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

// ---- HTTP request helper ----
// Auth is handled via httpOnly cookie set by the backend.
// The browser automatically sends the cookie with credentials: 'include'.

export async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `API ${res.status}`);
  }
  return res.json();
}

// ---- Mappers ----

export function mapUser(data: RawUserResponse): User {
  return {
    username: data.username,
    name: data.name,
    role: data.role as User["role"],
    roleLabel: data.role_label,
    dealerCode: data.dealer_code ?? undefined,
    expedition: data.expedition ?? undefined,
  };
}

export function mapSettlement(data: RawSettlement): Settlement {
  return {
    qty: data.qty,
    date: data.date,
    driver: data.driver,
    note: data.note,
    by: data.by ?? "",
    at: data.at,
  };
}

export function mapDealerInfo(data: RawDealerInfo): DealerInfo {
  return { noSo: data.no_so ?? "", code: data.code, dealer: data.dealer, qty: data.qty };
}

export function mapDealerReturn(data: RawDealerReturn): DealerReturn {
  return {
    driver: data.driver,
    returnDate: data.return_date,
    notes: data.notes ?? "",
    signatureDealer: "",
    signatureDriver: "",
  };
}

export function mapDealerConfirmations(
  items: RawDealerConfirmation[],
): Record<string, "pending" | "match" | "shortage" | "excess"> {
  const map: Record<string, "pending" | "match" | "shortage" | "excess"> = {};
  for (const dc of items) {
    map[dc.dealer_code] = dc.status as "pending" | "match" | "shortage" | "excess";
  }
  return map;
}

export function mapDealerReturnForItem(items: RawDealerConfirmation[]): DealerReturn | undefined {
  for (const dc of items) {
    if (dc.return_record) return mapDealerReturn(dc.return_record);
  }
  return undefined;
}

export function mapPickingItem(data: RawPickingItem): PickingItem {
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

export function mapHistoryEntry(data: RawHistoryEntry): HistoryEntry {
  return { at: data.at, by: data.by ?? "", text: data.text };
}

export function mapHandover(data: RawHandover | null): Handover | null {
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

export function mapPickingList(data: RawPickingListDetail): PickingList {
  return {
    id: data.picking_id || data.id,
    date: data.date,
    noDs: data.no_ds ?? "",
    expedition: data.expedition,
    plate: data.plate ?? "",
    driver: data.driver,
    status: data.status as PickingList["status"],
    handover: mapHandover(data.handover),
    history: (data.history ?? []).map(mapHistoryEntry),
    items: (data.items ?? []).map(mapPickingItem),
  };
}
