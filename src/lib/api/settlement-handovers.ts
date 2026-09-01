import { request } from "./request";

export async function fetchSettlementHandovers(): Promise<any> {
  return request("GET", "/api/settlement-handovers/");
}

export async function createSettlementHandover(body: {
  settlement_id: string;
  admin_name: string;
  driver_name: string;
  signature_admin?: string | null;
  signature_driver?: string | null;
}): Promise<any> {
  return request("POST", "/api/settlement-handovers/", body);
}
