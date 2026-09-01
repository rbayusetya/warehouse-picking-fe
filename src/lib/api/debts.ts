import { request } from "./request";

// ---- Types ----

export interface DebtRow {
  list: {
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
    plannedQty: number;
    actualQty: number;
    note: string;
  };
  paid: number;
  debt: number;
}

// ---- Endpoints ----

export async function fetchDebts(): Promise<DebtRow[]> {
  const data: any = await request("GET", "/api/debts/");
  return (data.rows ?? []).map((r: any) => ({
    list: r.picking_list
      ? {
          id: r.picking_list.id,
          picking_id: r.picking_list.picking_id,
          date: r.picking_list.date,
          driver: r.picking_list.driver,
          expedition: r.picking_list.expedition,
        }
      : { id: "", picking_id: "", date: "", driver: "", expedition: "" },
    item: r.item
      ? {
          id: r.item.id,
          code: r.item.code,
          name: r.item.name,
          plannedQty: r.item.planned_qty,
          actualQty: r.item.actual_qty,
          note: r.item.note ?? "",
        }
      : { id: "", code: "", name: "", plannedQty: 0, actualQty: 0, note: "" },
    paid: r.paid ?? 0,
    debt: r.debt ?? 0,
  }));
}

export async function payDebt(body: {
  picking_item_id: string;
  qty: number;
  date: string;
  driver: string;
  note?: string;
}): Promise<any> {
  return request("POST", "/api/debts/pay", body);
}
