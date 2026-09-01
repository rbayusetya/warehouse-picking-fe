import type {
  AppState,
  User,
  PickingList,
  PickingItem,
  DealerConfirmAction,
} from "./types";

export const USERS: User[] = [
  { username: "admin", name: "Admin Gudang", role: "admin", roleLabel: "Admin Gudang" },
  { username: "kepala", name: "Kepala Gudang", role: "kepala", roleLabel: "Kepala Gudang" },
  { username: "tunas", name: "Pengurus Tunas Muda", role: "ekspedisi", roleLabel: "Pengurus Ekspedisi", expedition: "TUNAS MUDA" },
  { username: "jagat", name: "Pengurus Jagat", role: "ekspedisi", roleLabel: "Pengurus Ekspedisi", expedition: "JAGAT" },
  { username: "dealer-lecf", name: "Dealer TRIDJAYA", role: "dealer", roleLabel: "Dealer", dealerCode: "LECF" },
  { username: "dealer-lech", name: "Dealer DEASSY", role: "dealer", roleLabel: "Dealer", dealerCode: "LECH" },
  { username: "dealer-kcey", name: "Dealer PT MITRA UTAMA", role: "dealer", roleLabel: "Dealer", dealerCode: "KCEY" },
];

export const USER_PASSWORDS: Record<string, string> = {
  admin: "admin123",
  kepala: "kepala123",
  tunas: "tunas123",
  jagat: "jagat123",
  "dealer-lecf": "lecf123",
  "dealer-lech": "lech123",
  "dealer-kcey": "kcey123",
};

const now = "13/06/2026 10:00";

function item(
  id: string,
  code: string,
  name: string,
  category: string,
  plannedQty: number,
  dealers: { noSo: string; code: string; dealer: string; qty: number }[],
): PickingItem {
  return {
    id,
    code,
    name,
    category,
    plannedQty,
    actualQty: 0,
    confirmed: false,
    note: "",
    settlements: [],
    dealers: dealers.map((d) => ({ ...d })),
    dealerConfirmed: Object.fromEntries(
      [...new Set(dealers.map((d) => d.code))].map((c) => [c, "pending"]),
    ),
  };
}

const PICKING_09: PickingList = {
  id: "12626315209",
  date: "2026-05-12",
  noDs: "12627301649",
  expedition: "TUNAS MUDA",
  plate: "B 9996 UVY",
  driver: "TATANG",
  status: "draft",
  handover: null,
  history: [{ at: "06/06/2026 08:31", by: "System Import", text: "Data picking diimpor dari Excel. No Picking List 12626315209." }],
  items: [
    item("acc-bundling-03512hdl000-honda-disc-lock", "03512HDL000", "HONDA DISC LOCK", "ACC BUNDLING", 7, [
      { noSo: "12607303708", code: "LECF", dealer: "TRIDJAYA ANUGERAH SUKSES, CV", qty: 5 },
      { noSo: "12607303709", code: "LECH", dealer: "PT. DEASSY SUKSES MANDIRI", qty: 2 },
    ]),
    item("acc-bundling-81110h02bla-license-plate-cover-2023", "81110H02BLA", "LICENSE PLATE COVER 2023", "ACC BUNDLING", 24, [
      { noSo: "12607303708", code: "LECF", dealer: "TRIDJAYA ANUGERAH SUKSES, CV", qty: 18 },
      { noSo: "12607303709", code: "LECH", dealer: "PT. DEASSY SUKSES MANDIRI", qty: 6 },
    ]),
    item("acc-bundling-sft01-safety-tools", "SFT01", "SAFETY TOOLS", "ACC BUNDLING", 24, [
      { noSo: "12607303708", code: "LECF", dealer: "TRIDJAYA ANUGERAH SUKSES, CV", qty: 18 },
      { noSo: "12607303709", code: "LECH", dealer: "PT. DEASSY SUKSES MANDIRI", qty: 6 },
    ]),
    item("accu-ksu-001-4v", "KSU 001", "4V", "ACCU", 6, [
      { noSo: "12607303708", code: "LECF", dealer: "TRIDJAYA ANUGERAH SUKSES, CV", qty: 4 },
      { noSo: "12607303709", code: "LECH", dealer: "PT. DEASSY SUKSES MANDIRI", qty: 2 },
    ]),
    item("accu-ksu-003-6v", "KSU 003", "6V", "ACCU", 18, [
      { noSo: "12607303708", code: "LECF", dealer: "TRIDJAYA ANUGERAH SUKSES, CV", qty: 14 },
      { noSo: "12607303709", code: "LECH", dealer: "PT. DEASSY SUKSES MANDIRI", qty: 4 },
    ]),
    item("buku-service-ksu-179-adv-160", "KSU 179", "ADV 160", "BUKU SERVICE", 1, [
      { noSo: "12607303708", code: "LECF", dealer: "TRIDJAYA ANUGERAH SUKSES, CV", qty: 1 },
    ]),
    item("buku-service-ksu-007-beat-new-low", "KSU 007", "BEAT NEW LOW", "BUKU SERVICE", 7, [
      { noSo: "12607303708", code: "LECF", dealer: "TRIDJAYA ANUGERAH SUKSES, CV", qty: 5 },
      { noSo: "12607303709", code: "LECH", dealer: "PT. DEASSY SUKSES MANDIRI", qty: 2 },
    ]),
    item("buku-service-ksu-160-pcx-160", "KSU 160", "PCX 160", "BUKU SERVICE", 6, [
      { noSo: "12607303708", code: "LECF", dealer: "TRIDJAYA ANUGERAH SUKSES, CV", qty: 6 },
    ]),
    item("buku-service-ksu-221-pcx-roadsync", "KSU 221", "PCX ROADSYNC", "BUKU SERVICE", 2, [
      { noSo: "12607303708", code: "LECF", dealer: "TRIDJAYA ANUGERAH SUKSES, CV", qty: 2 },
    ]),
    item("buku-service-ksu-109-vario-125", "KSU 109", "VARIO 125", "BUKU SERVICE", 8, [
      { noSo: "12607303708", code: "LECF", dealer: "TRIDJAYA ANUGERAH SUKSES, CV", qty: 4 },
      { noSo: "12607303709", code: "LECH", dealer: "PT. DEASSY SUKSES MANDIRI", qty: 4 },
    ]),
    item("helm-ksu-027-hmj", "KSU 027", "HMJ", "HELM", 7, [
      { noSo: "12607303708", code: "LECF", dealer: "TRIDJAYA ANUGERAH SUKSES, CV", qty: 5 },
      { noSo: "12607303709", code: "LECH", dealer: "PT. DEASSY SUKSES MANDIRI", qty: 2 },
    ]),
    item("helm-ksu-165-trx-3-new", "KSU 165", "TRX 3 - NEW", "HELM", 17, [
      { noSo: "12607303708", code: "LECF", dealer: "TRIDJAYA ANUGERAH SUKSES, CV", qty: 13 },
      { noSo: "12607303709", code: "LECH", dealer: "PT. DEASSY SUKSES MANDIRI", qty: 4 },
    ]),
    item("spion-ksu-136-k0wa", "KSU 136", "K0WA", "SPION", 1, [
      { noSo: "12607303708", code: "LECF", dealer: "TRIDJAYA ANUGERAH SUKSES, CV", qty: 1 },
    ]),
    item("spion-ksu-212-k1al", "KSU 212", "K1AL", "SPION", 2, [
      { noSo: "12607303708", code: "LECF", dealer: "TRIDJAYA ANUGERAH SUKSES, CV", qty: 1 },
      { noSo: "12607303709", code: "LECH", dealer: "PT. DEASSY SUKSES MANDIRI", qty: 1 },
    ]),
    item("spion-ksu-213-k1al-ss", "KSU 213", "K1AL SS", "SPION", 5, [
      { noSo: "12607303708", code: "LECF", dealer: "TRIDJAYA ANUGERAH SUKSES, CV", qty: 4 },
      { noSo: "12607303709", code: "LECH", dealer: "PT. DEASSY SUKSES MANDIRI", qty: 1 },
    ]),
    item("spion-ksu-180-k2vg", "KSU 180", "K2VG", "SPION", 8, [
      { noSo: "12607303708", code: "LECF", dealer: "TRIDJAYA ANUGERAH SUKSES, CV", qty: 4 },
      { noSo: "12607303709", code: "LECH", dealer: "PT. DEASSY SUKSES MANDIRI", qty: 4 },
    ]),
    item("spion-ksu-104-k97g", "KSU 104", "K97G", "SPION", 8, [
      { noSo: "12607303708", code: "LECF", dealer: "TRIDJAYA ANUGERAH SUKSES, CV", qty: 8 },
    ]),
    item("tool-kit-ksu-054-kvy", "KSU 054", "KVY", "TOOL KIT", 15, [
      { noSo: "12607303708", code: "LECF", dealer: "TRIDJAYA ANUGERAH SUKSES, CV", qty: 9 },
      { noSo: "12607303709", code: "LECH", dealer: "PT. DEASSY SUKSES MANDIRI", qty: 6 },
    ]),
    item("tool-kit-ksu-161-pcx-160", "KSU 161", "PCX 160", "TOOL KIT", 9, [
      { noSo: "12607303708", code: "LECF", dealer: "TRIDJAYA ANUGERAH SUKSES, CV", qty: 9 },
    ]),
  ],
};

const PICKING_10: PickingList = {
  id: "12626315210",
  date: "2026-05-12",
  noDs: "12627301650",
  expedition: "JAGAT",
  plate: "B 9349 UVV",
  driver: "ACAM",
  status: "draft",
  handover: null,
  history: [{ at: "06/06/2026 08:31", by: "System Import", text: "Data picking diimpor dari Excel. No Picking List 12626315210." }],
  items: [
    item("acc-bundling-03512hdl000-honda-disc-lock", "03512HDL000", "HONDA DISC LOCK", "ACC BUNDLING", 8, [
      { noSo: "12607303708", code: "LECF", dealer: "TRIDJAYA ANUGERAH SUKSES, CV", qty: 8 },
    ]),
    item("acc-bundling-81110h02bla-license-plate-cover-2023", "81110H02BLA", "LICENSE PLATE COVER 2023", "ACC BUNDLING", 20, [
      { noSo: "12607303682", code: "LECF", dealer: "TRIDJAYA ANUGERAH SUKSES, CV", qty: 2 },
      { noSo: "12607303708", code: "LECF", dealer: "TRIDJAYA ANUGERAH SUKSES, CV", qty: 18 },
    ]),
    item("acc-bundling-sft01-safety-tools", "SFT01", "SAFETY TOOLS", "ACC BUNDLING", 20, [
      { noSo: "12607303708", code: "LECF", dealer: "TRIDJAYA ANUGERAH SUKSES, CV", qty: 18 },
      { noSo: "12607303682", code: "LECF", dealer: "TRIDJAYA ANUGERAH SUKSES, CV", qty: 2 },
    ]),
    item("accu-ksu-001-4v", "KSU 001", "4V", "ACCU", 8, [
      { noSo: "12607303708", code: "LECF", dealer: "TRIDJAYA ANUGERAH SUKSES, CV", qty: 8 },
    ]),
    item("accu-ksu-003-6v", "KSU 003", "6V", "ACCU", 12, [
      { noSo: "12607303682", code: "LECF", dealer: "TRIDJAYA ANUGERAH SUKSES, CV", qty: 2 },
      { noSo: "12607303708", code: "LECF", dealer: "TRIDJAYA ANUGERAH SUKSES, CV", qty: 10 },
    ]),
    item("buku-service-ksu-007-beat-new-low", "KSU 007", "BEAT NEW LOW", "BUKU SERVICE", 8, [
      { noSo: "12607303708", code: "LECF", dealer: "TRIDJAYA ANUGERAH SUKSES, CV", qty: 8 },
    ]),
    item("buku-service-ksu-160-pcx-160", "KSU 160", "PCX 160", "BUKU SERVICE", 3, [
      { noSo: "12607303708", code: "LECF", dealer: "TRIDJAYA ANUGERAH SUKSES, CV", qty: 3 },
    ]),
    item("buku-service-ksu-151-scoopy-baru", "KSU 151", "SCOOPY BARU", "BUKU SERVICE", 6, [
      { noSo: "12607303708", code: "LECF", dealer: "TRIDJAYA ANUGERAH SUKSES, CV", qty: 6 },
    ]),
    item("buku-service-ksu-204-stylo", "KSU 204", "STYLO", "BUKU SERVICE", 2, [
      { noSo: "12607303682", code: "LECF", dealer: "TRIDJAYA ANUGERAH SUKSES, CV", qty: 2 },
    ]),
    item("buku-service-ksu-109-vario-125", "KSU 109", "VARIO 125", "BUKU SERVICE", 1, [
      { noSo: "12607303708", code: "LECF", dealer: "TRIDJAYA ANUGERAH SUKSES, CV", qty: 1 },
    ]),
    item("helm-ksu-027-hmj", "KSU 027", "HMJ", "HELM", 8, [
      { noSo: "12607303708", code: "LECF", dealer: "TRIDJAYA ANUGERAH SUKSES, CV", qty: 8 },
    ]),
    item("helm-ksu-205-trx-s-k3va", "KSU 205", "TRX - S K3VA", "HELM", 2, [
      { noSo: "12607303682", code: "LECF", dealer: "TRIDJAYA ANUGERAH SUKSES, CV", qty: 2 },
    ]),
    item("helm-ksu-165-trx-3-new", "KSU 165", "TRX 3 - NEW", "HELM", 4, [
      { noSo: "12607303708", code: "LECF", dealer: "TRIDJAYA ANUGERAH SUKSES, CV", qty: 4 },
    ]),
    item("helm-ksu-031-trxs", "KSU 031", "TRXS", "HELM", 6, [
      { noSo: "12607303708", code: "LECF", dealer: "TRIDJAYA ANUGERAH SUKSES, CV", qty: 6 },
    ]),
    item("spion-ksu-212-k1al", "KSU 212", "K1AL", "SPION", 4, [
      { noSo: "12607303708", code: "LECF", dealer: "TRIDJAYA ANUGERAH SUKSES, CV", qty: 4 },
    ]),
    item("spion-ksu-213-k1al-ss", "KSU 213", "K1AL SS", "SPION", 4, [
      { noSo: "12607303708", code: "LECF", dealer: "TRIDJAYA ANUGERAH SUKSES, CV", qty: 4 },
    ]),
    item("spion-ksu-242-k2f-evolution-grey", "KSU 242", "K2F EVOLUTION GREY", "SPION", 3, [
      { noSo: "12607303708", code: "LECF", dealer: "TRIDJAYA ANUGERAH SUKSES, CV", qty: 3 },
    ]),
    item("spion-ksu-236-k2f-green-metallic", "KSU 236", "K2F GREEN METALLIC", "SPION", 1, [
      { noSo: "12607303708", code: "LECF", dealer: "TRIDJAYA ANUGERAH SUKSES, CV", qty: 1 },
    ]),
    item("spion-ksu-240-k2f-serenia-mint-metallic", "KSU 240", "K2F SERENIA MINT METALLIC", "SPION", 2, [
      { noSo: "12607303708", code: "LECF", dealer: "TRIDJAYA ANUGERAH SUKSES, CV", qty: 2 },
    ]),
    item("spion-ksu-180-k2vg", "KSU 180", "K2VG", "SPION", 1, [
      { noSo: "12607303708", code: "LECF", dealer: "TRIDJAYA ANUGERAH SUKSES, CV", qty: 1 },
    ]),
    item("spion-ksu-245-k3v-premier-red", "KSU 245", "K3V PREMIER RED", "SPION", 2, [
      { noSo: "12607303682", code: "LECF", dealer: "TRIDJAYA ANUGERAH SUKSES, CV", qty: 2 },
    ]),
    item("spion-ksu-104-k97g", "KSU 104", "K97G", "SPION", 3, [
      { noSo: "12607303708", code: "LECF", dealer: "TRIDJAYA ANUGERAH SUKSES, CV", qty: 3 },
    ]),
    item("tool-kit-ksu-054-kvy", "KSU 054", "KVY", "TOOL KIT", 15, [
      { noSo: "12607303708", code: "LECF", dealer: "TRIDJAYA ANUGERAH SUKSES, CV", qty: 15 },
    ]),
    item("tool-kit-ksu-161-pcx-160", "KSU 161", "PCX 160", "TOOL KIT", 3, [
      { noSo: "12607303708", code: "LECF", dealer: "TRIDJAYA ANUGERAH SUKSES, CV", qty: 3 },
    ]),
    item("tool-kit-ksu-177-vario-160", "KSU 177", "VARIO 160", "TOOL KIT", 2, [
      { noSo: "12607303682", code: "LECF", dealer: "TRIDJAYA ANUGERAH SUKSES, CV", qty: 2 },
    ]),
  ],
};

const PICKING_11: PickingList = {
  id: "12626315211",
  date: "2026-05-12",
  noDs: "12627301651",
  expedition: "TUNAS MUDA",
  plate: "B 9083 UVZ",
  driver: "RUSLANI",
  status: "draft",
  handover: null,
  history: [{ at: "06/06/2026 08:31", by: "System Import", text: "Data picking diimpor dari Excel. No Picking List 12626315211." }],
  items: [
    item("acc-bundling-03512hdl000-honda-disc-lock", "03512HDL000", "HONDA DISC LOCK", "ACC BUNDLING", 5, [
      { noSo: "12607303700", code: "KCEY", dealer: "PT MITRA UTAMA MOTORA", qty: 5 },
    ]),
    item("acc-bundling-81110h02bla-license-plate-cover-2023", "81110H02BLA", "LICENSE PLATE COVER 2023", "ACC BUNDLING", 22, [
      { noSo: "12607303677", code: "KCEY", dealer: "PT MITRA UTAMA MOTORA", qty: 1 },
      { noSo: "12607303700", code: "KCEY", dealer: "PT MITRA UTAMA MOTORA", qty: 21 },
    ]),
    item("acc-bundling-sft01-safety-tools", "SFT01", "SAFETY TOOLS", "ACC BUNDLING", 22, [
      { noSo: "12607303700", code: "KCEY", dealer: "PT MITRA UTAMA MOTORA", qty: 21 },
      { noSo: "12607303677", code: "KCEY", dealer: "PT MITRA UTAMA MOTORA", qty: 1 },
    ]),
    item("accu-ksu-001-4v", "KSU 001", "4V", "ACCU", 4, [
      { noSo: "12607303700", code: "KCEY", dealer: "PT MITRA UTAMA MOTORA", qty: 4 },
    ]),
    item("accu-ksu-003-6v", "KSU 003", "6V", "ACCU", 18, [
      { noSo: "12607303677", code: "KCEY", dealer: "PT MITRA UTAMA MOTORA", qty: 1 },
      { noSo: "12607303700", code: "KCEY", dealer: "PT MITRA UTAMA MOTORA", qty: 17 },
    ]),
    item("buku-service-ksu-007-beat-new-low", "KSU 007", "BEAT NEW LOW", "BUKU SERVICE", 4, [
      { noSo: "12607303700", code: "KCEY", dealer: "PT MITRA UTAMA MOTORA", qty: 4 },
    ]),
    item("buku-service-ksu-137-genio", "KSU 137", "GENIO", "BUKU SERVICE", 1, [
      { noSo: "12607303700", code: "KCEY", dealer: "PT MITRA UTAMA MOTORA", qty: 1 },
    ]),
    item("buku-service-ksu-160-pcx-160", "KSU 160", "PCX 160", "BUKU SERVICE", 4, [
      { noSo: "12607303700", code: "KCEY", dealer: "PT MITRA UTAMA MOTORA", qty: 4 },
    ]),
    item("buku-service-ksu-221-pcx-roadsync", "KSU 221", "PCX ROADSYNC", "BUKU SERVICE", 2, [
      { noSo: "12607303700", code: "KCEY", dealer: "PT MITRA UTAMA MOTORA", qty: 2 },
    ]),
    item("buku-service-ksu-151-scoopy-baru", "KSU 151", "SCOOPY BARU", "BUKU SERVICE", 4, [
      { noSo: "12607303700", code: "KCEY", dealer: "PT MITRA UTAMA MOTORA", qty: 4 },
    ]),
    item("buku-service-ksu-204-stylo", "KSU 204", "STYLO", "BUKU SERVICE", 1, [
      { noSo: "12607303677", code: "KCEY", dealer: "PT MITRA UTAMA MOTORA", qty: 1 },
    ]),
    item("buku-service-ksu-109-vario-125", "KSU 109", "VARIO 125", "BUKU SERVICE", 6, [
      { noSo: "12607303700", code: "KCEY", dealer: "PT MITRA UTAMA MOTORA", qty: 6 },
    ]),
    item("helm-ksu-027-hmj", "KSU 027", "HMJ", "HELM", 4, [
      { noSo: "12607303700", code: "KCEY", dealer: "PT MITRA UTAMA MOTORA", qty: 4 },
    ]),
    item("helm-ksu-205-trx-s-k3va", "KSU 205", "TRX - S K3VA", "HELM", 1, [
      { noSo: "12607303677", code: "KCEY", dealer: "PT MITRA UTAMA MOTORA", qty: 1 },
    ]),
    item("helm-ksu-165-trx-3-new", "KSU 165", "TRX 3 - NEW", "HELM", 12, [
      { noSo: "12607303700", code: "KCEY", dealer: "PT MITRA UTAMA MOTORA", qty: 12 },
    ]),
    item("helm-ksu-031-trxs", "KSU 031", "TRXS", "HELM", 5, [
      { noSo: "12607303700", code: "KCEY", dealer: "PT MITRA UTAMA MOTORA", qty: 5 },
    ]),
    item("spion-ksu-139-k0ja", "KSU 139", "K0JA", "SPION", 1, [
      { noSo: "12607303700", code: "KCEY", dealer: "PT MITRA UTAMA MOTORA", qty: 1 },
    ]),
    item("spion-ksu-212-k1al", "KSU 212", "K1AL", "SPION", 2, [
      { noSo: "12607303700", code: "KCEY", dealer: "PT MITRA UTAMA MOTORA", qty: 2 },
    ]),
    item("spion-ksu-213-k1al-ss", "KSU 213", "K1AL SS", "SPION", 2, [
      { noSo: "12607303700", code: "KCEY", dealer: "PT MITRA UTAMA MOTORA", qty: 2 },
    ]),
    item("spion-ksu-242-k2f-evolution-grey", "KSU 242", "K2F EVOLUTION GREY", "SPION", 4, [
      { noSo: "12607303700", code: "KCEY", dealer: "PT MITRA UTAMA MOTORA", qty: 4 },
    ]),
    item("spion-ksu-180-k2vg", "KSU 180", "K2VG", "SPION", 6, [
      { noSo: "12607303700", code: "KCEY", dealer: "PT MITRA UTAMA MOTORA", qty: 6 },
    ]),
    item("spion-ksu-245-k3v-premier-red", "KSU 245", "K3V PREMIER RED", "SPION", 1, [
      { noSo: "12607303677", code: "KCEY", dealer: "PT MITRA UTAMA MOTORA", qty: 1 },
    ]),
    item("spion-ksu-104-k97g", "KSU 104", "K97G", "SPION", 6, [
      { noSo: "12607303700", code: "KCEY", dealer: "PT MITRA UTAMA MOTORA", qty: 6 },
    ]),
    item("tool-kit-ksu-054-kvy", "KSU 054", "KVY", "TOOL KIT", 15, [
      { noSo: "12607303700", code: "KCEY", dealer: "PT MITRA UTAMA MOTORA", qty: 15 },
    ]),
    item("tool-kit-ksu-161-pcx-160", "KSU 161", "PCX 160", "TOOL KIT", 6, [
      { noSo: "12607303700", code: "KCEY", dealer: "PT MITRA UTAMA MOTORA", qty: 6 },
    ]),
    item("tool-kit-ksu-177-vario-160", "KSU 177", "VARIO 160", "TOOL KIT", 1, [
      { noSo: "12607303677", code: "KCEY", dealer: "PT MITRA UTAMA MOTORA", qty: 1 },
    ]),
  ],
};

function makeInitialState(): AppState {
  const lists: PickingList[] = [
    JSON.parse(JSON.stringify(PICKING_09)),
    JSON.parse(JSON.stringify(PICKING_10)),
    JSON.parse(JSON.stringify(PICKING_11)),
  ];
  return {
    sourceFile: "dummypicking.xlsx",
    excelImportStatus: "3 picking list berhasil diimpor dari dummypicking.xlsx.",
    pickingLists: lists,
  };
}

let mockState: AppState = makeInitialState();

export function getState(): AppState {
  return JSON.parse(JSON.stringify(mockState));
}

export function replaceState(state: AppState): void {
  mockState = JSON.parse(JSON.stringify(state));
}

export function saveState(list: PickingList): void {
  const idx = mockState.pickingLists.findIndex((l) => l.id === list.id);
  if (idx >= 0) mockState.pickingLists[idx] = JSON.parse(JSON.stringify(list));
}

export function resetMockData(): void {
  mockState = makeInitialState();
}

export function findUser(username: string): User | undefined {
  return USERS.find((u) => u.username === username);
}

export function verifyPassword(username: string, password: string): boolean {
  return USER_PASSWORDS[username] === password;
}

export function getDealerCodeFromUser(user: User): string | null {
  if (user.role === "dealer" && user.dealerCode) return user.dealerCode;
  return null;
}

export function getVisibleListsForUser(user: User, lists: PickingList[]): PickingList[] {
  if (user.role === "ekspedisi") {
    return lists.filter((l) => l.expedition === user.expedition);
  }
  if (user.role === "dealer") {
    const code = user.dealerCode;
    if (!code) return [];
    return lists.filter((l) =>
      l.items.some((item) => item.dealers.some((d) => d.code === code)),
    );
  }
  return lists;
}

export function getDealerItemsForUser(
  user: User,
  lists: PickingList[],
): { pickingList: PickingList; item: PickingItem; dealerInfo: { noSo: string; code: string; dealer: string; qty: number } }[] {
  const code = user.dealerCode;
  if (!code) return [];
  const result: {
    pickingList: PickingList;
    item: PickingItem;
    dealerInfo: { noSo: string; code: string; dealer: string; qty: number };
  }[] = [];
  for (const list of lists) {
    for (const item of list.items) {
      const dealerInfo = item.dealers.find((d) => d.code === code);
      if (dealerInfo) {
        result.push({ pickingList: list, item, dealerInfo });
      }
    }
  }
  return result;
}

export function isDealerItemUnconfirmed(item: PickingItem, dealerCode: string): boolean {
  const status = item.dealerConfirmed?.[dealerCode];
  return !status || status === "pending";
}
