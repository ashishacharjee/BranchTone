# TOOLS.md — Development Environment and Commands

## 1. Prerequisites

- Git.
- Node.js 20 LTS or newer supported LTS and npm (use a compatible current Vite release; commit the generated lockfile).
- Python 3.11 or newer.
- A virtual environment tool (`venv` is sufficient).
- VS Code or Antigravity.
- Optional: Playwright browser dependencies for end-to-end tests.

Do not pin obsolete versions from this document. Let dependency manifests and lockfiles record the actually installed compatible versions. Check package/library release notes before major upgrades.

## 2. Target repository layout

```text
branchtone/
  frontend/
  backend/
  content/
  schemas/
  references/
  docs/                 # only if project team chooses to move these docs
  .env.example
  .gitignore
  README.md
```

Keep this development pack at the repository root initially so agent rules are loaded automatically.

## 3. Frontend commands (target)

```bash
cd frontend
npm install
npm run dev
npm run lint
npm run typecheck
npm run test
npm run build
```

Suggested scripts: `dev`, `build`, `preview`, `lint`, `typecheck`, `test`, `test:watch`, and optionally `test:e2e`. If a script is not configured, do not claim it ran.

## 4. Backend commands (target)

Windows PowerShell:

```powershell
cd backend
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -e ".[dev]"
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
pytest
ruff check .
mypy app
```

macOS/Linux:

```bash
cd backend
python3.11 -m venv .venv
source .venv/bin/activate
python -m pip install -e ".[dev]"
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
pytest
ruff check .
mypy app
```

Configure these commands in `pyproject.toml`. Do not claim mypy/ruff ran unless configured and invoked.

## 5. Local URLs

- Frontend: Vite's printed local URL (typically `http://localhost:5173`).
- Backend: `http://127.0.0.1:8000`.
- API docs during development: `http://127.0.0.1:8000/docs`.
- Health: `GET http://127.0.0.1:8000/api/v1/health`.

Do not expose the backend publicly without authentication/CORS/security review.

## 6. Environment

Copy `.env.example` to `.env` locally. Never commit `.env`.

- `DATABASE_URL=sqlite:///./branchtone.db`
- `STORAGE_ROOT=./storage`
- `MAX_UPLOAD_MB=50`
- `CORS_ORIGINS=http://localhost:5173`
- `GEMINI_API_KEY=` (unused until approved/live provider stage)

Vite variables are public; never put server secrets in `VITE_*` values.

## 7. Recommended dependencies

Frontend baseline: `react`, `react-dom`, `typescript`, `vite`, `react-router-dom`, `@xyflow/react`, `zustand`, `@tanstack/react-query`, `zod`, `lucide-react`. Audio: Web Audio API first; `wavesurfer.js` only if it fits actual decoded audio and cleanup requirements. Styling: CSS Modules or Tailwind; choose one and avoid mixing systems. Tests: `vitest`, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`; optionally `@playwright/test`.

Backend baseline: `fastapi`, `uvicorn[standard]`, `pydantic`, `pydantic-settings`, `sqlalchemy`, `python-multipart`. Optional: `networkx`, `numpy`, `scipy`, `alembic` only when needed. Dev: `pytest`, `httpx`, `ruff`, `mypy`.

Do not add libraries that duplicate functionality without a documented reason. Do not add AI provider SDK before compliance clearance.

## 8. Build verification checklist

- Clean install using lockfiles.
- Frontend lint, typecheck, unit tests and production build.
- Backend lint/typecheck and tests.
- API health check.
- Manual Route B acceptance run.
- No audio asset: disabled playback, explicit missing status, no waveform fabrication.
- Upload invalid MIME/extension/size/corrupt media tests.
- Keyboard-only navigation and reduced-motion check.
