import { request, mapPickingList } from "./request";
import type {
  RawPickingListsResponse,
  RawPickingListDetail,
  RawDashboardStatsResponse,
  RawCompletePickingResponse,
  RawUploadResponse,
} from "./response-types";
import type { PickingList } from "../types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

// ---- Types ----

export interface DashboardStats {
  totalPicking: number;
  draftCount: number;
  pickedCount: number;
  handoverCount: number;
  totalItems: number;
  totalDebt: number;
}

export interface ItemUpdate {
  id: string;
  confirmed?: boolean;
  actual_qty?: number;
  note?: string;
}

// ---- Endpoints ----

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const data = await request<RawDashboardStatsResponse>("GET", "/api/picking/dashboard");
  return {
    totalPicking: data.total_picking,
    draftCount: data.draft_count,
    pickedCount: data.picked_count,
    handoverCount: data.handover_count,
    totalItems: data.total_items,
    totalDebt: data.total_debt,
  };
}

export async function fetchPickingLists(): Promise<PickingList[]> {
  const data = await request<RawPickingListsResponse>("GET", "/api/picking/");
  return data.lists.map(mapPickingList);
}

export async function fetchPickingListDetail(id: string): Promise<PickingList> {
  const data = await request<RawPickingListDetail>("GET", `/api/picking/${id}`);
  return mapPickingList(data);
}

export async function updatePickingItems(
  listId: string,
  items: ItemUpdate[],
): Promise<PickingList> {
  const data = await request<RawPickingListDetail>(
    "PUT",
    `/api/picking/${listId}/items`,
    items,
  );
  return mapPickingList(data);
}

export async function completePicking(
  listId: string,
): Promise<RawCompletePickingResponse> {
  return request("POST", `/api/picking/${listId}/complete`);
}

export async function uploadExcel(file: File): Promise<RawUploadResponse> {
  const formData = new FormData();
  formData.append("file", file);
  const url = `${API_BASE}/api/picking/upload`;
  const res = await fetch(url, { method: "POST", credentials: "include", body: formData });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `Upload failed: ${res.status}`);
  }
  return res.json();
}

// ---- Handover (sub-resource of picking) ----

export interface HandoverCreateRequest {
  admin_name: string;
  driver_name: string;
  signature_admin?: string | null;
  signature_driver?: string | null;
}

export interface HandoverResponse {
  created_at: string;
  created_by: string;
  admin_name: string;
  driver_name: string;
  signature_admin_url: string;
  signature_driver_url: string;
}

export async function createHandover(
  listId: string,
  body: HandoverCreateRequest,
): Promise<HandoverResponse> {
  return request("POST", `/api/picking/${listId}/handover`, body);
}

export async function fetchHandover(listId: string): Promise<HandoverResponse | null> {
  return request("GET", `/api/picking/${listId}/handover`);
}
