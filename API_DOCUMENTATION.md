# Backend API Documentation

> All endpoints are relative to `NEXT_PUBLIC_API_URL`.
> All requests (except login) require `Authorization: Bearer <token>` header.
> All request/response bodies are JSON unless stated otherwise.
> Error responses follow `{ "detail": "error message" }` shape with appropriate HTTP status.

---

## Authentication

### `POST /api/auth/login`

**Used by:** Login page (`src/app/login/login-form.tsx`)

Authenticate a user and return a JWT token.

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
  "access_token": "string (JWT)",
  "username": "string",
  "name": "string",
  "role": "admin | kepala | ekspedisi | dealer",
  "role_label": "string",
  "dealer_code": "string | null",
  "expedition": "string | null"
}
```

**Notes:**
- `dealer_code` is only present when `role = "dealer"`
- `expedition` is only present when `role = "ekspedisi"`
- Frontend stores `access_token` in both `localStorage` and an `auth_token` cookie

---

### `GET /api/auth/me`

**Used by:** Auth context on app load (`src/lib/providers/auth-context.tsx`)

Get the currently authenticated user's profile.

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

**Response (401):** Returns error, frontend clears auth state.

---

## Picking Lists

### `GET /api/picking/dashboard`

**Used by:** Dashboard page (defined in api.ts but dashboard currently calls `fetchPickingLists` instead)

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

**Used by:** Dashboard, Picking list, Handover list, History pages

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
- If called by an `ekspedisi` user, backend should filter by their `expedition`
- If called by a `dealer` user, backend should filter by their `dealer_code`

---

### `GET /api/picking/{id}`

**Used by:** Picking detail page, Handover detail page

Get a single picking list with full detail (all items, settlements, dealer info, handover, history).

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

---

### `PUT /api/picking/{id}/items`

**Used by:** Picking detail page (updating items)

Update one or more items in a picking list (mark as confirmed, set actual qty, add notes).

**Request:**
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

**Notes:**
- The body is an **array**, not an object
- All fields except `id` are optional (partial update)

**Response (200):** Returns the full updated `PickingList` (same shape as `GET /api/picking/{id}`)

---

### `POST /api/picking/{id}/complete`

**Used by:** Picking detail page (marking picking as done)

Complete a picking list, transitioning its status from `draft` → `picked`.

**Request:** Empty body `{}`

**Response (200):**
```json
{
  "status": "picked",
  "debt": 12
}
```

**Notes:**
- `debt` is the total shortage (planned - actual - paid) across all items

---

### `POST /api/picking/upload`

**Used by:** Upload page (`src/app/(auth)/upload/page.tsx`)

Upload an Excel file (.xlsx/.xls) to import picking lists.

**Request:** `multipart/form-data` (NOT JSON)

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
      "items": [ ... ]
    }
  ]
}
```

**Notes:**
- This is the only endpoint that uses `multipart/form-data` instead of JSON
- Auth token is still sent via `Authorization` header

---

## Handover (Serah Terima)

### `POST /api/picking/{id}/handover`

**Used by:** Handover detail page

Create a handover record for a picking list (admin signs off to driver).

**Request:**
```json
{
  "admin_name": "Admin Gudang",
  "driver_name": "TATANG",
  "signature_admin": "data:image/png;base64,...",
  "signature_driver": "data:image/png;base64,..."
}
```

**Notes:**
- `signature_admin` and `signature_driver` are base64-encoded PNG data URLs
- Both are optional (`string | null`)

**Response (200):** Returns the created handover object (shape varies — frontend treats it as `any`)

---

### `GET /api/picking/{id}/handover`

**Used by:** Handover detail page (fetching existing handover)

Get the handover record for a picking list.

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

---

## Debts (Hutang Barang)

### `GET /api/debts/`

**Used by:** Debts page (`src/app/(auth)/debts/page.tsx`)

List all outstanding debts (items with shortages across all picking lists).

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

**Notes:**
- `paid` = total quantity returned/settled so far
- `debt` = `planned_qty - actual_qty - paid` (minimum 0)

---

### `POST /api/debts/pay`

**Used by:** Debt pay page (`src/app/(auth)/debts/pay/page.tsx`)

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

**Response (200):** Returns the created settlement record (shape varies — frontend treats it as `any`)

---

## Settlement Handovers

### `GET /api/settlement-handovers/`

**Used by:** Handover list page (`src/app/(auth)/handover/page.tsx`)

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

---

### `POST /api/settlement-handovers/`

**Used by:** Debt pay page (creating sign-off after payment)

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

**Response (200):** Returns the created handover object (shape varies — frontend treats it as `any`)

---

## Dealer

### `GET /api/dealer/items`

**Used by:** Dealer page, Sidebar (unconfirmed count)

List all items assigned to the current dealer across all picking lists.

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

**Notes:**
- Backend should filter by the authenticated user's `dealer_code`
- `confirmation_status` is `null` or `"pending"` when the dealer hasn't confirmed yet

---

### `GET /api/dealer/items/{picking_list_id}`

**Used by:** Dealer detail page

List dealer items for a specific picking list.

**Response:** Same shape as `GET /api/dealer/items` but filtered to one picking list.

---

### `POST /api/dealer/confirm`

**Used by:** Dealer detail page (confirming item receipt)

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
- `return_info` is only present when `status = "shortage"` or `status = "excess"` (items being returned)

**Response (200):** Returns the confirmation record (shape varies — frontend treats it as `any`)

---

## Summary: Endpoint Count by Domain

| Domain | Endpoints | Methods |
|--------|-----------|---------|
| Auth | 2 | `POST login`, `GET me` |
| Picking | 5 | `GET list`, `GET detail`, `PUT items`, `POST complete`, `POST upload` |
| Handover | 2 | `POST create`, `GET fetch` |
| Debts | 2 | `GET list`, `POST pay` |
| Settlement Handovers | 2 | `GET list`, `POST create` |
| Dealer | 3 | `GET items`, `GET items/{id}`, `POST confirm` |
| **Total** | **16** | |

---

## Key Observations for Backend Refactor

1. **Auth is simple JWT** — just `login` + `me`. No refresh tokens, no OAuth. Easy to replicate in any framework.

2. **Signatures are base64 data URLs** — stored as strings in the DB. No file upload/storage service needed.

3. **Only one multipart endpoint** — `POST /api/picking/upload` for Excel import. Everything else is JSON.

4. **Role-based filtering happens server-side** — `ekspedisi` sees only their expedition's picking lists, `dealer` sees only their items. The backend enforces this, not the frontend.

5. **Error shape is `{ "detail": "message" }`** — this is FastAPI/Pydantic convention. If migrating, keep this contract for frontend compatibility.

6. **Some responses are loosely typed** — `confirmDealerItem`, `createHandover`, `payDebt`, `createSettlementHandover` all return `any` from the frontend. You have flexibility in shaping these.

7. **No WebSocket/SSE** — purely request/response. No real-time updates.

8. **16 total endpoints** — this is a small API surface. Straightforward to replicate in Quarkus, Go, Node, or any framework.
