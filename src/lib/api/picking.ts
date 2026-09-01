import { request, getToken, mapPickingList } from "./request";

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

export async function fetchPickingLists(): Promise<any[]> {
  const data: any = await request("GET", "/api/picking/");
  return data.lists.map(mapPickingList);
}

export async function fetchPickingListDetail(id: string): Promise<any> {
  const data: any = await request("GET", `/api/picking/${id}`);
  return mapPickingList(data);
}

export async function updatePickingItems(listId: string, items: ItemUpdate[]): Promise<any> {
  const data: any = await request("PUT", `/api/picking/${listId}/items`, items);
  return mapPickingList(data);
}

export async function completePicking(
  listId: string,
): Promise<{ status: string; debt: number }> {
  return request("POST", `/api/picking/${listId}/complete`);
}

export async function uploadExcel(file: File): Promise<{
  status: string;
  imported_count: number;
  lists: any[];
}> {
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

// ---- Handover (sub-resource of picking) ----

export async function createHandover(
  listId: string,
  body: {
    admin_name: string;
    driver_name: string;
    signature_admin?: string | null;
    signature_driver?: string | null;
  },
): Promise<any> {
  return request("POST", `/api/picking/${listId}/handover`, body);
}

export async function fetchHandover(listId: string): Promise<any> {
  return request("GET", `/api/picking/${listId}/handover`);
}
