import { request, mapSettlement } from "./request";
import type { DealerConfirmAction, Settlement } from "../types";

// ---- Types ----

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

// ---- Endpoints ----

export async function fetchDealerItems(pickingListId?: string): Promise<DealerItemEntry[]> {
  const path = pickingListId
    ? `/api/dealer/items/${pickingListId}`
    : "/api/dealer/items";
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

export async function confirmDealerItem(body: {
  picking_item_id: string;
  status: DealerConfirmAction;
  signature_dealer?: string | null;
  signature_driver?: string | null;
  return_info?: { driver: string; return_date: string; notes?: string } | null;
}): Promise<any> {
  return request("POST", "/api/dealer/confirm", body);
}
