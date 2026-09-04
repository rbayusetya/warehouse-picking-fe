<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Project Notes

## Architecture
- **Frontend:** Next.js 16 App Router (TypeScript), in `frontend/`
- **Backend:** FastAPI (Python 3.12, async, SQLAlchemy + Alembic + PostgreSQL), in `backend/`
- **Infrastructure:** Docker Compose — Caddy (reverse proxy, port 15000), PostgreSQL, MinIO/S3
- **Branches:** `main` (frontend repo), `dev_eki` (frontend), `feature/db-migration` (backend)

## Known Issues & Lessons Learned

### 1. Alembic `upgrade()` blocks the async event loop
`alembic.command.upgrade()` is synchronous. Calling it directly inside an async function (e.g. `init_db()` in a FastAPI lifespan) **blocks the event loop**, preventing seed functions and `lifespan yield` from executing. Uvicorn starts serving (health endpoint works) but the app never signals "Application startup complete", causing silent failures on subsequent requests.

**Fix:** Wrap the Alembic call in `asyncio.to_thread()`:
```python
async def init_db():
    import asyncio
    from alembic.config import Config
    from alembic.command import upgrade
    def _run_migration():
        alembic_cfg = Config("alembic.ini")
        upgrade(alembic_cfg, "head")
    await asyncio.to_thread(_run_migration)
```

### 2. `Promise.all` kills entire dashboard on one failing fetch
Frontend dashboard used `Promise.all([fetchStats, fetchLists, fetchDealerItems])`. The dealer items endpoint returns 403 for non-dealer users, which rejected the entire promise and showed a generic error.

**Fix:** Fetch dealer items separately with its own `.catch()` handler.

### 3. Node modules copied from macOS don't work on Linux
`node_modules` copied from a Mac contain macOS-specific binaries. Always `rm -rf node_modules && npm install` on a new platform.

### 4. `docker compose down -v` wipes all data
Use `-v` flag to remove volumes (database, minio). Required when schema changes invalidate existing data or when debugging startup issues.

### 5. Auth dual-storage inconsistency
The original code stored tokens in both `localStorage` and a cookie. Middleware read the cookie, SPA read localStorage. If one expired but not the other, the user hit redirect loops.

**Fix:** Unified approach: store in both on login, clear both on logout, middleware reads cookie, API calls use Bearer token.

### 6. `picking_excel.py` must live inside backend
The Excel parser was at the project root and copied into Docker via `COPY picking_excel.py .`. This broke when the Dockerfile build context changed. It now lives at `backend/app/picking_excel.py` and is imported as `from app.picking_excel import parse_picking_workbook`.
