# Backend API Documentation

> All endpoints are relative to `NEXT_PUBLIC_API_URL`.
> **Auth is via httpOnly cookie** — the backend sets `Set-Cookie` on login, the browser sends it automatically.
> Frontend sends `credentials: 'include'` on all fetch calls. No `Authorization` header is used.
> All request/response bodies are JSON unless stated otherwise.
> Error responses follow `{ "detail": "error message" }` shape with appropriate HTTP status.

---

## Backend Requirements

The backend **must** implement these cookie behaviors:

### `POST /api/auth/login`
On success, set cookie:
```
Set-Cookie: auth_token=<JWT>; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=86400
```

### `POST /api/auth/logout`
Clear the cookie:
```
Set-Cookie: auth_token=; Path=/; Max-Age=0
```

### All other endpoints
Read `auth_token` from the cookie. Return 401 if invalid/missing.

---

## Authentication

### `POST /api/auth/login`

**Used by:** `src/lib/api/auth.ts` → Login form

Authenticate a user. Backend sets httpOnly cookie on success.

**Request:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "username": "string",
  "name": "string",
  "role": "admin | kepala | ekspedisi | dealer",
  "role_label": "string",
  "dealer_code": "string | null",
  "expedition": "string | null"
}
```

**Backend must also:** Set `Set-Cookie` header with httpOnly JWT cookie.

**Notes:**
- `dealer_code` is only present when `role = "dealer"`
- `expedition` is only present when `role = "ekspedisi"`
- Frontend does NOT store the token — cookie is managed entirely by the backend

---

### `GET /api/auth/me`

**Used by:** `src/lib/providers/auth-context.tsx` on app load

Get the currently authenticated user. Reads JWT from cookie.

**Response (200):**
```json
{
  "username": "string",
  "name": "string",
  "role": "admin | kepala | ekspedisi | dealer",
  "role_label": "string",
  "dealer_code": "string | null",
  "expedition": "string | null"
}
```

**Response (401):** Frontend clears user state, redirects to login.

---

### `POST /api/auth/logout`

**Used by:** `src/lib/api/auth.ts` → Logout

Clear the auth cookie.

**Request:** Empty body `{}`

**Response (200):** `{ "status": "ok" }`

**Backend must also:** Clear `auth_token` cookie via `Set-Cookie` header.

---

## Picking Lists

### `GET /api/picking/dashboard`

**Used by:** `src/lib/api/picking.ts` → `fetchDashboardStats()`

Get aggregated dashboard statistics.

**Response (200):**
```json
{
  "total_picking": 15,
  "draft_count": 5,
  "picked_count": 7,
  "handover_count": 3,
  "total_items": 240,
  "total_debt": 12
}
```

---

### `GET /api/picking/`

**Used by:** `src/lib/api/picking.ts` → `fetchPickingLists()`
**Pages:** Dashboard, Picking list, Handover list, History

List all picking lists (summary — no items).

**Response (200):**
```json
{
  "lists": [
    {
      "id": "12626315209",
      "date": "2026-05-12",
      "expedition": "TUNAS MUDA",
      "plate": "B 9996 UVY",
      "driver": "TATANG",
      "status": "draft | picked | handover_completed | closed"
    }
  ]
}
```

**Notes:**
- Backend should filter by role: `ekspedisi` → their expedition, `dealer` → their dealer_code

---

### `GET /api/picking/{id}`

**Used by:** `src/lib/api/picking.ts` → `fetchPickingListDetail(id)`
**Pages:** Picking detail, Handover detail

Get a single picking list with full detail.

**Response (200):**
```json
{
  "picking_id": "12626315209",
  "date": "2026-05-12",
  "no_ds": "12627301649",
  "expedition": "TUNAS MUDA",
  "plate": "B 9996 UVY",
  "driver": "TATANG",
  "status": "draft",
  "handover": {
    "created_at": "06/06/2026 10:30",
    "created_by": "admin",
    "admin_name": "Admin Gudang",
    "driver_name": "TATANG",
    "signature_admin_url": "data:image/png;base64,...",
    "signature_driver_url": "data:image/png;base64,..."
  },
  "history": [
    {
      "at": "06/06/2026 08:31",
      "by": "System Import",
      "text": "Data picking diimpor dari Excel."
    }
  ],
  "items": [
    {
      "id": "acc-bundling-03512hdl000-honda-disc-lock",
      "code": "03512HDL000",
      "name": "HONDA DISC LOCK",
      "category": "ACC BUNDLING",
      "planned_qty": 7,
      "actual_qty": 5,
      "confirmed": true,
      "note": "string",
      "settlements": [
        {
          "qty": 2,
          "date": "2026-06-10",
          "driver": "TATANG",
          "note": "sudah dikembalikan",
          "by": "admin",
          "at": "2026-06-10 14:00"
        }
      ],
      "dealers": [
        {
          "no_so": "12607303708",
          "code": "LECF",
          "dealer": "TRIDJAYA ANUGERAH SUKSES, CV",
          "qty": 5
        }
      ],
      "dealer_confirmations": [
        {
          "dealer_code": "LECF",
          "status": "match | pending | shortage | excess",
          "return_record": {
            "driver": "string",
            "return_date": "string",
            "notes": "string"
          }
        }
      ]
    }
  ]
}
```

**Frontend type:** `RawPickingListDetail` in `src/lib/api/response-types.ts`
**Mapped to:** `PickingList` in `src/lib/types.ts`

---

### `PUT /api/picking/{id}/items`

**Used by:** `src/lib/api/picking.ts` → `updatePickingItems(listId, items)`
**Pages:** Picking detail

Update one or more items in a picking list.

**Request:** (array, not object)
```json
[
  {
    "id": "acc-bundling-03512hdl000-honda-disc-lock",
    "confirmed": true,
    "actual_qty": 5,
    "note": "string"
  }
]
```

**Notes:** All fields except `id` are optional (partial update).

**Response (200):** Returns the full updated `PickingList` (same shape as `GET /api/picking/{id}`)

---

### `POST /api/picking/{id}/complete`

**Used by:** `src/lib/api/picking.ts` → `completePicking(listId)`
**Pages:** Picking detail

Complete a picking list (`draft` → `picked`).

**Request:** Empty body `{}`

**Response (200):**
```json
{
  "status": "picked",
  "debt": 12
}
```

**Frontend type:** `RawCompletePickingResponse`

---

### `POST /api/picking/upload`

**Used by:** `src/lib/api/picking.ts` → `uploadExcel(file)`
**Pages:** Upload

Upload an Excel file (.xlsx/.xls) to import picking lists.

**Request:** `multipart/form-data`

| Field | Type | Description |
|-------|------|-------------|
| `file` | File | The Excel file to upload |

**Response (200):**
```json
{
  "status": "ok",
  "imported_count": 3,
  "lists": [
    {
      "id": "12626315209",
      "driver": "TATANG",
      "items": [ "..." ]
    }
  ]
}
```

**Frontend type:** `RawUploadResponse`

**Notes:** This is the only endpoint using `multipart/form-data`. Cookie is sent automatically via `credentials: 'include'`.

---

## Handover (Serah Terima)

### `POST /api/picking/{id}/handover`

**Used by:** `src/lib/api/picking.ts` → `createHandover(listId, body)`
**Pages:** Handover detail

Create a handover record (admin signs off to driver).

**Request:**
```json
{
  "admin_name": "Admin Gudang",
  "driver_name": "TATANG",
  "signature_admin": "data:image/png;base64,...",
  "signature_driver": "data:image/png;base64,..."
}
```

**Notes:** Signatures are base64-encoded PNG data URLs. Both optional.

**Response (200):**
```json
{
  "created_at": "06/06/2026 10:30",
  "created_by": "admin",
  "admin_name": "Admin Gudang",
  "driver_name": "TATANG",
  "signature_admin_url": "data:image/png;base64,...",
  "signature_driver_url": "data:image/png;base64,..."
}
```

**Frontend type:** `HandoverResponse` in `src/lib/api/picking.ts`

---

### `GET /api/picking/{id}/handover`

**Used by:** `src/lib/api/picking.ts` → `fetchHandover(listId)`
**Pages:** Handover detail

Get the handover record for a picking list.

**Response (200):** Same shape as `HandoverResponse` above, or `null` if no handover exists.

---

## Debts (Hutang Barang)

### `GET /api/debts/`

**Used by:** `src/lib/api/debts.ts` → `fetchDebts()`
**Pages:** Debts page

List all outstanding debts.

**Response (200):**
```json
{
  "rows": [
    {
      "picking_list": {
        "id": "uuid",
        "picking_id": "12626315209",
        "date": "2026-05-12",
        "driver": "TATANG",
        "expedition": "TUNAS MUDA"
      },
      "item": {
        "id": "uuid",
        "code": "03512HDL000",
        "name": "HONDA DISC LOCK",
        "planned_qty": 7,
        "actual_qty": 5,
        "note": "string"
      },
      "paid": 1,
      "debt": 1
    }
  ]
}
```

**Frontend type:** `RawDebtsResponse` → mapped to `DebtRow[]`

---

### `POST /api/debts/pay`

**Used by:** `src/lib/api/debts.ts` → `payDebt(body)`
**Pages:** Debt pay page

Record a debt payment (settlement of returned items).

**Request:**
```json
{
  "picking_item_id": "uuid",
  "qty": 2,
  "date": "2026-06-15",
  "driver": "TATANG",
  "note": "sudah dikembalikan"
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "picking_item_id": "uuid",
  "qty": 2,
  "date": "2026-06-15",
  "driver": "TATANG",
  "note": "sudah dikembalikan",
  "settlement": { "id": "uuid" }
}
```

**Frontend type:** `PayDebtResponse` in `src/lib/api/debts.ts`

---

## Settlement Handovers

### `GET /api/settlement-handovers/`

**Used by:** `src/lib/api/settlement-handovers.ts` → `fetchSettlementHandovers()`
**Pages:** Handover list

List all settlement handovers (admin↔driver sign-offs for debt settlements).

**Response (200):**
```json
{
  "handovers": [
    {
      "id": "uuid",
      "settlement_id": "uuid",
      "admin_name": "Admin Gudang",
      "driver_name": "TATANG",
      "signature_admin_url": "data:image/png;base64,...",
      "signature_driver_url": "data:image/png;base64,...",
      "created_at": "2026-06-15T10:30:00",
      "created_by": "admin",
      "picking_list": {
        "id": "uuid",
        "picking_id": "12626315209",
        "date": "2026-05-12",
        "driver": "TATANG",
        "expedition": "TUNAS MUDA"
      },
      "item": {
        "id": "uuid",
        "code": "03512HDL000",
        "name": "HONDA DISC LOCK",
        "qty": 2
      }
    }
  ]
}
```

**Frontend type:** `RawSettlementHandoversResponse` → mapped to `SettlementHandoverEntry[]`

---

### `POST /api/settlement-handovers/`

**Used by:** `src/lib/api/settlement-handovers.ts` → `createSettlementHandover(body)`
**Pages:** Debt pay page

Create a settlement handover record (admin signs off on a debt payment).

**Request:**
```json
{
  "settlement_id": "uuid",
  "admin_name": "Admin Gudang",
  "driver_name": "TATANG",
  "signature_admin": "data:image/png;base64,...",
  "signature_driver": "data:image/png;base64,..."
}
```

**Response (200):** Returns `SettlementHandoverEntry` (same shape as items in GET response).

---

## Dealer

### `GET /api/dealer/items`

**Used by:** `src/lib/api/dealer.ts` → `fetchDealerItems()`
**Pages:** Dealer page, Sidebar (unconfirmed count)

List all items assigned to the current dealer.

**Response (200):**
```json
{
  "items": [
    {
      "picking_list_id": "uuid",
      "picking_id": "12626315209",
      "date": "2026-05-12",
      "driver": "TATANG",
      "expedition": "TUNAS MUDA",
      "item_id": "uuid",
      "item_name": "HONDA DISC LOCK",
      "item_code": "03512HDL000",
      "item_category": "ACC BUNDLING",
      "planned_qty": 7,
      "actual_qty": 5,
      "note": "string",
      "dealer_code": "LECF",
      "dealer_name": "TRIDJAYA ANUGERAH SUKSES, CV",
      "dealer_qty": 5,
      "confirmation_status": "match | pending | shortage | excess | null",
      "settlements": [
        {
          "qty": 2,
          "date": "2026-06-10",
          "driver": "TATANG",
          "note": "string",
          "by": "admin",
          "at": "2026-06-10 14:00"
        }
      ]
    }
  ]
}
```

**Frontend type:** `RawDealerItemsResponse` → mapped to `DealerItemEntry[]`

**Notes:**
- Backend filters by the authenticated user's `dealer_code`
- `confirmation_status` is `null` or `"pending"` when unconfirmed

---

### `GET /api/dealer/items/{picking_list_id}`

**Used by:** `src/lib/api/dealer.ts` → `fetchDealerItems(pickingListId)`
**Pages:** Dealer detail

List dealer items for a specific picking list.

**Response:** Same shape as `GET /api/dealer/items` but filtered to one picking list.

---

### `POST /api/dealer/confirm`

**Used by:** `src/lib/api/dealer.ts` → `confirmDealerItem(body)`
**Pages:** Dealer detail

Dealer confirms whether received items match, are short, or are in excess.

**Request:**
```json
{
  "picking_item_id": "uuid",
  "status": "match | shortage | excess",
  "signature_dealer": "data:image/png;base64,...",
  "signature_driver": "data:image/png;base64,...",
  "return_info": {
    "driver": "TATANG",
    "return_date": "2026-06-15",
    "notes": "string"
  }
}
```

**Notes:**
- `signature_dealer` and `signature_driver` are optional base64 data URLs
- `return_info` only present when `status = "shortage"` or `"excess"`

**Response (200):**
```json
{
  "id": "uuid",
  "picking_item_id": "uuid",
  "dealer_code": "LECF",
  "status": "match"
}
```

**Frontend type:** `ConfirmDealerItemResponse` in `src/lib/api/dealer.ts`

---

## Frontend Source Map

All API calls live in `src/lib/api/`:

| File | Domain | Functions |
|------|--------|-----------|
| `request.ts` | Shared | `request()`, mappers (`mapUser`, `mapPickingList`, etc.) |
| `response-types.ts` | Shared | Raw backend response types (snake_case) |
| `auth.ts` | Auth | `apiLogin()`, `apiFetchMe()`, `apiLogout()` |
| `picking.ts` | Picking | `fetchPickingLists()`, `fetchPickingListDetail()`, `updatePickingItems()`, `completePicking()`, `uploadExcel()`, `createHandover()`, `fetchHandover()` |
| `debts.ts` | Debts | `fetchDebts()`, `payDebt()` |
| `settlement-handovers.ts` | Settlements | `fetchSettlementHandovers()`, `createSettlementHandover()` |
| `dealer.ts` | Dealer | `fetchDealerItems()`, `confirmDealerItem()` |
| `index.ts` | Barrel | Re-exports all of the above |

---

## Summary

| Domain | Endpoints | Methods |
|--------|-----------|---------|
| Auth | 3 | `POST login`, `GET me`, `POST logout` |
| Picking | 5 | `GET list`, `GET detail`, `PUT items`, `POST complete`, `POST upload` |
| Handover | 2 | `POST create`, `GET fetch` |
| Debts | 2 | `GET list`, `POST pay` |
| Settlement Handovers | 2 | `GET list`, `POST create` |
| Dealer | 3 | `GET items`, `GET items/{id}`, `POST confirm` |
| **Total** | **17** | |

---

## Key Notes for Backend Refactor

1. **Auth is httpOnly cookie** — Backend sets `Set-Cookie` on login/logout. Frontend never touches the token.
2. **Signatures are base64 data URLs** — Stored as strings in the DB. No file upload needed.
3. **One multipart endpoint** — `POST /api/picking/upload` for Excel import. Everything else is JSON.
4. **Role-based filtering is server-side** — `ekspedisi` sees only their expedition, `dealer` sees only their items.
5. **Error shape:** `{ "detail": "message" }` — keep this for frontend compatibility.
6. **No WebSocket/SSE** — Purely request/response.
7. **17 total endpoints** — Small API surface, straightforward to replicate in Quarkus, Go, Node, etc.
