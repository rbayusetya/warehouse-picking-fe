// Raw API response types — these match the backend's snake_case JSON shapes.
// Mappers in request.ts convert these to the camelCase frontend types in lib/types.ts.

// ---- Auth ----

export interface RawLoginResponse {
  access_token: string;
  username: string;
  name: string;
  role: string;
  role_label: string;
  dealer_code: string | null;
  expedition: string | null;
}

export interface RawUserResponse {
  username: string;
  name: string;
  role: string;
  role_label: string;
  dealer_code: string | null;
  expedition: string | null;
}

// ---- Picking ----

export interface RawPickingListSummary {
  id: string;
  date: string;
  expedition: string;
  plate: string;
  driver: string;
  status: string;
}

export interface RawPickingListDetail {
  picking_id: string;
  id: string;
  date: string;
  no_ds: string;
  expedition: string;
  plate: string;
  driver: string;
  status: string;
  handover: RawHandover | null;
  history: RawHistoryEntry[];
  items: RawPickingItem[];
}

export interface RawPickingItem {
  id: string;
  code: string;
  name: string;
  category: string;
  planned_qty: number;
  actual_qty: number;
  confirmed: boolean;
  note: string;
  settlements: RawSettlement[];
  dealers: RawDealerInfo[];
  dealer_confirmations: RawDealerConfirmation[];
}

export interface RawSettlement {
  qty: number;
  date: string;
  driver: string;
  note: string;
  by: string;
  at: string;
}

export interface RawDealerInfo {
  no_so: string;
  code: string;
  dealer: string;
  qty: number;
}

export interface RawDealerConfirmation {
  dealer_code: string;
  status: string;
  return_record: RawDealerReturn | null;
}

export interface RawDealerReturn {
  driver: string;
  return_date: string;
  notes: string;
}

export interface RawHistoryEntry {
  at: string;
  by: string;
  text: string;
}

export interface RawHandover {
  created_at: string;
  created_by: string;
  admin_name: string;
  driver_name: string;
  signature_admin_url: string;
  signature_driver_url: string;
}

// ---- Picking responses ----

export interface RawPickingListsResponse {
  lists: RawPickingListDetail[];
}

export interface RawDashboardStatsResponse {
  total_picking: number;
  draft_count: number;
  picked_count: number;
  handover_count: number;
  total_items: number;
  total_debt: number;
}

export interface RawCompletePickingResponse {
  status: string;
  debt: number;
}

export interface RawUploadResponse {
  status: string;
  imported_count: number;
  lists: RawPickingListDetail[];
}

// ---- Debts ----

export interface RawDebtRow {
  picking_list: {
    id: string;
    picking_id: string;
    date: string;
    driver: string;
    expedition: string;
  } | null;
  item: {
    id: string;
    code: string;
    name: string;
    planned_qty: number;
    actual_qty: number;
    note: string;
  } | null;
  paid: number;
  debt: number;
}

export interface RawDebtsResponse {
  rows: RawDebtRow[];
}

// ---- Dealer ----

export interface RawDealerItemEntry {
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
  settlements: RawSettlement[];
}

export interface RawDealerItemsResponse {
  items: RawDealerItemEntry[];
}

// ---- Settlement Handovers ----

export interface RawSettlementHandover {
  id: string;
  settlement_id: string;
  admin_name: string;
  driver_name: string;
  signature_admin_url: string;
  signature_driver_url: string;
  created_at: string;
  created_by: string;
  picking_list: {
    id: string;
    picking_id: string;
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

export interface RawSettlementHandoversResponse {
  rows: RawSettlementHandover[];
}
