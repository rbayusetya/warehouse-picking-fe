export type UserRole = "admin" | "kepala" | "ekspedisi" | "dealer";

export interface User {
  username: string;
  name: string;
  role: UserRole;
  roleLabel: string;
  dealerCode?: string;
  expedition?: string;
}

export interface DealerInfo {
  noSo: string;
  code: string;
  dealer: string;
  qty: number;
}

export interface Settlement {
  qty: number;
  date: string;
  driver: string;
  note: string;
  by: string;
  at: string;
}

export interface DealerReturn {
  driver: string;
  returnDate: string;
  notes: string;
  signatureDealer: string;
  signatureDriver: string;
}

export interface PickingItem {
  id: string;
  code: string;
  name: string;
  category: string;
  plannedQty: number;
  actualQty: number;
  confirmed: boolean;
  note: string;
  settlements: Settlement[];
  dealers: DealerInfo[];
  dealerConfirmed?: Record<string, "pending" | "match" | "shortage" | "excess">;
  dealerReturn?: DealerReturn;
}

export interface Handover {
  at: string;
  by: string;
  adminName: string;
  driverName: string;
  signatureAdmin: string;
  signatureDriver: string;
}

export interface SettlementHandover {
  id: string;
  settlementId: string;
  adminName: string;
  driverName: string;
  signatureAdminUrl: string;
  signatureDriverUrl: string;
  createdAt: string;
  createdBy: string;
  pickingList: { id: string; pickingId: string; date: string; driver: string; expedition: string };
  item: { id: string; code: string; name: string; qty: number };
}

export interface HistoryEntry {
  at: string;
  by: string;
  text: string;
}

export type PickingStatus = "draft" | "picked" | "handover_completed" | "closed";

export interface PickingList {
  id: string;
  date: string;
  noDs: string;
  expedition: string;
  plate: string;
  driver: string;
  status: PickingStatus;
  handover: Handover | null;
  history: HistoryEntry[];
  items: PickingItem[];
}

export interface AppState {
  sourceFile: string;
  excelImportStatus: string;
  pickingLists: PickingList[];
}

export interface VisibleDealerItem {
  pickingList: PickingList;
  item: PickingItem;
  dealerInfo: DealerInfo;
}

export type DealerConfirmAction = "match" | "shortage" | "excess";
