import { request } from "./request";
import type {
  RawSettlementHandoversResponse,
  RawSettlementHandover,
} from "./response-types";

// ---- Types ----

export interface SettlementHandoverEntry {
  id: string;
  settlementId: string;
  adminName: string;
  driverName: string;
  signatureAdminUrl: string;
  signatureDriverUrl: string;
  createdAt: string;
  createdBy: string;
  pickingList: {
    id: string;
    pickingId: string;
    date: string;
    driver: string;
    expedition: string;
  };
  item: {
    id: string;
    code: string;
    name: string;
    qty: number;
  };
}

export interface CreateSettlementHandoverRequest {
  settlement_id: string;
  admin_name: string;
  driver_name: string;
  signature_admin?: string | null;
  signature_driver?: string | null;
}

// ---- Mappers ----

function mapSettlementHandover(raw: RawSettlementHandover): SettlementHandoverEntry {
  return {
    id: raw.id,
    settlementId: raw.settlement_id,
    adminName: raw.admin_name,
    driverName: raw.driver_name,
    signatureAdminUrl: raw.signature_admin_url,
    signatureDriverUrl: raw.signature_driver_url,
    createdAt: raw.created_at,
    createdBy: raw.created_by,
    pickingList: {
      id: raw.picking_list.id,
      pickingId: raw.picking_list.picking_id,
      date: raw.picking_list.date,
      driver: raw.picking_list.driver,
      expedition: raw.picking_list.expedition,
    },
    item: {
      id: raw.item.id,
      code: raw.item.code,
      name: raw.item.name,
      qty: raw.item.qty,
    },
  };
}

// ---- Endpoints ----

export async function fetchSettlementHandovers(): Promise<SettlementHandoverEntry[]> {
  const data = await request<RawSettlementHandoversResponse>("GET", "/api/settlement-handovers/");
  return (data.rows ?? []).map(mapSettlementHandover);
}

export async function createSettlementHandover(
  body: CreateSettlementHandoverRequest,
): Promise<SettlementHandoverEntry> {
  const raw = await request<RawSettlementHandover>("POST", "/api/settlement-handovers/", body);
  return mapSettlementHandover(raw);
}
