import type { User, PickingList, PickingItem, Handover, HistoryEntry, Settlement, DealerInfo, DealerReturn, DealerConfirmAction } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

function setAuthCookie(token: string): void {
  document.cookie = `auth_token=${token};path=/;max-age=86400;samesite=lax`;
}

function clearAuthCookie(): void {
  document.cookie = "auth_token=;path=/;max-age=0";
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `API ${res.status}`);
  }
  return res.json();
}

// ---- Mappers ----

function mapUser(data: any): User {
  return {
    username: data.username,
    name: data.name,
    role: data.role,
    roleLabel: data.role_label,
    dealerCode: data.dealer_code ?? undefined,
    expedition: data.expedition ?? undefined,
  };
}

function mapSettlement(data: any): Settlement {
  return { qty: data.qty, date: data.date, driver: data.driver, note: data.note, by: data.by ?? "", at: data.at };
}

function mapDealerInfo(data: any): DealerInfo {
  return { noSo: data.no_so ?? "", code: data.code, dealer: data.dealer, qty: data.qty };
}

function mapDealerReturn(data: any): DealerReturn | undefined {
  if (!data) return undefined;
  return { driver: data.driver, returnDate: data.return_date, notes: data.notes ?? "", signatureDealer: "", signatureDriver: "" };
}

function mapDealerConfirmations(items: any[]): Record<string, "pending" | "match" | "shortage" | "excess"> {
  const map: Record<string, "pending" | "match" | "shortage" | "excess"> = {};
  for (const dc of items) {
    map[dc.dealer_code] = dc.status as any;
  }
  return map;
}

function mapDealerReturnForItem(items: any[]): DealerReturn | undefined {
  for (const dc of items) {
    if (dc.return_record) return mapDealerReturn(dc.return_record);
  }
  return undefined;
}

function mapPickingItem(data: any): PickingItem {
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
    dealerConfirmed: (data.dealer_confirmations ?? []).length > 0 ? mapDealerConfirmations(data.dealer_confirmations) : undefined,
    dealerReturn: (data.dealer_confirmations ?? []).length > 0 ? mapDealerReturnForItem(data.dealer_confirmations) : undefined,
  };
}

function mapHistoryEntry(data: any): HistoryEntry {
  return { at: data.at, by: data.by ?? "", text: data.text };
}

function mapHandover(data: any): Handover | null {
  if (!data) return null;
  return { at: data.created_at ?? "", by: data.created_by ?? "", adminName: data.admin_name, driverName: data.driver_name, signatureAdmin: data.signature_admin_url ?? "", signatureDriver: data.signature_driver_url ?? "" };
}

function mapPickingList(data: any): PickingList {
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

function mapPickingListSummary(data: any): PickingList {
  return {
    id: data.id,
    date: data.date,
    noDs: "",
    expedition: data.expedition,
    plate: data.plate ?? "",
    driver: data.driver,
    status: data.status ?? "draft",
    handover: null,
    history: [],
    items: [],
  };
}

// ---- Auth ----

export async function apiLogin(username: string, password: string): Promise<User> {
  const data: any = await request("POST", "/api/auth/login", { username, password });
  localStorage.setItem("auth_token", data.access_token);
  setAuthCookie(data.access_token);
  const user = mapUser(data);
  localStorage.setItem("auth_user", JSON.stringify(user));
  return user;
}

export async function apiFetchMe(): Promise<User | null> {
  try {
    const data: any = await request("GET", "/api/auth/me");
    return mapUser(data);
  } catch {
    return null;
  }
}

export function apiLogout(): void {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("auth_user");
  clearAuthCookie();
}

// ---- Picking ----

export interface DashboardStats {
  totalPicking: number;
  draftCount: number;
  pickedCount: number;
  handoverCount: number;
  totalItems: number;
  totalDebt: number;
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const data: any = await request("GET", "/api/picking/dashboard");
  return {
    totalPicking: data.total_picking,
    draftCount: data.draft_count,
    pickedCount: data.picked_count,
    handoverCount: data.handover_count,
    totalItems: data.total_items,
    totalDebt: data.total_debt,
  };
}

export async function fetchPickingListDetail(id: string): Promise<PickingList> {
  const data: any = await request("GET", `/api/picking/${id}`);
  return mapPickingList(data);
}

export async function fetchPickingLists(): Promise<PickingList[]> {
  const data: any = await request("GET", "/api/picking/");
  return data.lists.map(mapPickingList);
}

export interface ItemUpdate {
  id: string;
  confirmed?: boolean;
  actual_qty?: number;
  note?: string;
}

export async function updatePickingItems(listId: string, items: ItemUpdate[]): Promise<PickingList> {
  const data: any = await request("PUT", `/api/picking/${listId}/items`, items);
  return mapPickingList(data);
}

export async function completePicking(listId: string): Promise<{ status: string; debt: number }> {
  return request("POST", `/api/picking/${listId}/complete`);
}

export async function createHandover(listId: string, body: { admin_name: string; driver_name: string; signature_admin?: string | null; signature_driver?: string | null }): Promise<any> {
  return request("POST", `/api/picking/${listId}/handover`, body);
}

export async function fetchHandover(listId: string): Promise<any> {
  return request("GET", `/api/picking/${listId}/handover`);
}

// ---- Debts ----

export interface DebtRow {
  list: { id: string; picking_id: string; date: string; driver: string; expedition: string };
  item: { id: string; code: string; name: string; plannedQty: number; actualQty: number; note: string };
  paid: number;
  debt: number;
}

export async function fetchDebts(): Promise<DebtRow[]> {
  const data: any = await request("GET", "/api/debts/");
  return (data.rows ?? []).map((r: any) => ({
    list: r.picking_list
      ? { id: r.picking_list.id, picking_id: r.picking_list.picking_id, date: r.picking_list.date, driver: r.picking_list.driver, expedition: r.picking_list.expedition }
      : { id: "", picking_id: "", date: "", driver: "", expedition: "" },
    item: r.item
      ? { id: r.item.id, code: r.item.code, name: r.item.name, plannedQty: r.item.planned_qty, actualQty: r.item.actual_qty, note: r.item.note ?? "" }
      : { id: "", code: "", name: "", plannedQty: 0, actualQty: 0, note: "" },
    paid: r.paid ?? 0,
    debt: r.debt ?? 0,
  }));
}

export async function payDebt(body: { picking_item_id: string; qty: number; date: string; driver: string; note?: string }): Promise<any> {
  return request("POST", "/api/debts/pay", body);
}

// ---- Settlement Handover ----

export async function fetchSettlementHandovers(): Promise<any> {
  return request("GET", "/api/settlement-handovers/");
}

export async function createSettlementHandover(body: { settlement_id: string; admin_name: string; driver_name: string; signature_admin?: string | null; signature_driver?: string | null }): Promise<any> {
  return request("POST", "/api/settlement-handovers/", body);
}

// ---- Dealer ----

export interface DealerItemEntry {
  picking_list_id: string;
  picking_id: string;
  date: string;
  driver: string;
  expedition: string;
  item_id: string;
  item_name: string;
  item_code: string;
  item_category: string;
  planned_qty: number;
  actual_qty: number;
  note: string;
  dealer_code: string;
  dealer_name: string;
  dealer_qty: number;
  confirmation_status: string | null;
  settlements: Settlement[];
}

export async function fetchDealerItems(pickingListId?: string): Promise<DealerItemEntry[]> {
  const path = pickingListId ? `/api/dealer/items/${pickingListId}` : "/api/dealer/items";
  const data: any = await request("GET", path);
  return (data.items ?? []).map((i: any) => ({
    picking_list_id: i.picking_list_id,
    picking_id: i.picking_id,
    date: i.date,
    driver: i.driver,
    expedition: i.expedition,
    item_id: i.item_id,
    item_name: i.item_name,
    item_code: i.item_code,
    item_category: i.item_category,
    planned_qty: i.planned_qty,
    actual_qty: i.actual_qty,
    note: i.note ?? "",
    dealer_code: i.dealer_code,
    dealer_name: i.dealer_name,
    dealer_qty: i.dealer_qty,
    confirmation_status: i.confirmation_status,
    settlements: (i.settlements ?? []).map(mapSettlement),
  }));
}

// ---- Upload ----

export async function uploadExcel(file: File): Promise<{ status: string; imported_count: number; lists: any[] }> {
  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const formData = new FormData();
  formData.append("file", file);
  const url = `${API_BASE}/api/picking/upload`;
  const res = await fetch(url, { method: "POST", headers, body: formData });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `Upload failed: ${res.status}`);
  }
  return res.json();
}

export async function confirmDealerItem(body: {
  picking_item_id: string;
  status: DealerConfirmAction;
  signature_dealer?: string | null;
  signature_driver?: string | null;
  return_info?: { driver: string; return_date: string; notes?: string } | null;
}): Promise<any> {
  return request("POST", "/api/dealer/confirm", body);
}
