# 📦 CMS Monorepo

A production-ready **Content Management System** built as a monorepo with:

| Layer | Stack |
|---|---|
| **Frontend** | Next.js 14 (App Router) · TypeScript · Redux Toolkit · Tailwind CSS · Axios |
| **Backend** | Node.js · Express · TypeScript · Mongoose (MongoDB) · JWT · bcryptjs |
| **Infrastructure** | Docker · Docker Compose · MongoDB 7 |

---

## 📁 Project Structure

```
cms-monorepo/
├── frontend/                     # Next.js App Router frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── (public)/         # Public-facing pages (home, articles…)
│   │   │   ├── (admin)/          # Admin dashboard route group
│   │   │   ├── layout.tsx        # Root layout (Redux Provider, fonts)
│   │   │   └── globals.css       # Tailwind base + component classes
│   │   ├── components/           # Reusable UI components
│   │   ├── services/             # Axios API client
│   │   ├── store/                # Redux Toolkit store + slices
│   │   │   ├── slices/
│   │   │   │   ├── authSlice.ts
│   │   │   │   └── contentSlice.ts
│   │   │   ├── store.ts
│   │   │   ├── hooks.ts          # Typed useAppDispatch / useAppSelector
│   │   │   └── provider.tsx      # Client-side StoreProvider
│   │   └── types/                # Global TypeScript definitions
│   ├── Dockerfile
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── .env.local.example
│
├── backend/                      # Node.js / Express API
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.ts             # Mongoose connection (with retry)
│   │   │   └── env.ts            # Typed environment loader
│   │   ├── controllers/          # Route handler stubs
│   │   ├── middlewares/
│   │   │   ├── auth.ts           # JWT authenticate + authorize RBAC
│   │   │   └── errorHandler.ts   # Centralised error handler
│   │   ├── models/
│   │   │   ├── User.model.ts     # Mongoose User schema
│   │   │   └── Content.model.ts  # Mongoose Content schema
│   │   ├── routes/               # Express routers
│   │   ├── utils/                # JWT helpers, slugify, etc.
│   │   ├── app.ts                # Express app setup
│   │   └── server.ts             # Entry point + graceful shutdown
│   ├── Dockerfile
│   ├── tsconfig.json
│   └── .env.example
│
└── docker-compose.yml            # Local development orchestration
```

---

## 🚀 Quick Start (Local Development)

### Option A — Docker (Recommended)

> **Prerequisites**: [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

```bash
# 1. Clone the repository
git clone <repo-url> && cd cms-monorepo

# 2. Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local

# 3. Start all services
docker-compose up --build
```

| Service | URL |
|---|---|
| **Frontend** | http://localhost:3000 |
| **Backend API** | http://localhost:5000/api |
| **Health Check** | http://localhost:5000/api/health |
| **MongoDB** | mongodb://localhost:27017/cms_db |

---

### Option B — Native (Without Docker)

> **Prerequisites**: Node.js ≥ 20, MongoDB running locally.

```bash
# Install all workspace dependencies from the root
npm install

# ─── Backend ──────────────────────────────────────────────────
cd backend
cp .env.example .env          # Edit MONGO_URI, JWT_SECRET etc.
npm run dev                   # Starts on http://localhost:5000

# ─── Frontend (in a new terminal) ────────────────────────────
cd frontend
cp .env.local.example .env.local
npm run dev                   # Starts on http://localhost:3000
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Default |
|---|---|---|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `MONGO_URI` | MongoDB connection string | `mongodb://mongo:27017/cms_db` |
| `JWT_SECRET` | Secret for signing JWTs | *(required)* |
| `JWT_EXPIRES_IN` | JWT expiry | `7d` |
| `CLIENT_URL` | Allowed CORS origin | `http://localhost:3000` |

### Frontend (`frontend/.env.local`)

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API base URL | `http://localhost:5000/api` |

---

## 🔑 API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/health` | None | Health check |
| `POST` | `/api/auth/register` | None | Register user |
| `POST` | `/api/auth/login` | None | Login |
| `GET` | `/api/auth/me` | Bearer | Current user |
| `POST` | `/api/auth/logout` | Bearer | Logout |
| `GET` | `/api/content` | None | List content |
| `GET` | `/api/content/:id` | None | Get content item |
| `POST` | `/api/content` | Admin/Editor | Create content |
| `PUT` | `/api/content/:id` | Admin/Editor | Update content |
| `DELETE` | `/api/content/:id` | Admin only | Delete content |

---

## 🧱 Architecture Decisions

- **Monorepo** — Shared tooling, single `npm install` at the root, independent deployments.
- **App Router groups** — `(public)` and `(admin)` route groups share separate layouts without affecting the URL path.
- **Redux Toolkit** — All async API calls are structured as `createAsyncThunk`; typed `useAppDispatch` / `useAppSelector` hooks prevent `any` leakage.
- **Mongoose retry logic** — `db.ts` implements exponential-ready retry with configurable max attempts; graceful shutdown closes the connection cleanly.
- **Multi-stage Dockerfiles** — `development` stage uses hot-reload; `production` stage uses a minimal Alpine image with a non-root user.
- **RBAC** — `authorize(...roles)` middleware factory guards routes by user role (`admin`, `editor`, `viewer`).

---

## 📜 Available Scripts

### Root
```bash
npm run dev:backend        # Start backend dev server
npm run dev:frontend       # Start frontend dev server
npm run docker:up          # docker-compose up --build
npm run docker:down        # docker-compose down
```

### Backend
```bash
npm run dev                # ts-node-dev hot-reload
npm run build              # tsc compile to /dist
npm run typecheck          # tsc --noEmit
```

### Frontend
```bash
npm run dev                # next dev
npm run build              # next build
npm run lint               # next lint
npm run typecheck          # tsc --noEmit
```

---

## 🛡️ Security Highlights

- `helmet` sets secure HTTP headers on every response
- Passwords hashed with `bcryptjs` (12 salt rounds) via Mongoose pre-save hook
- JWT-based stateless auth; tokens never stored server-side
- CORS restricted to `CLIENT_URL`
- Admin pages carry `robots: noindex, nofollow` metadata
- Production Docker containers run as non-root users

---

## 🗺️ Next Steps

- [ ] Implement `auth.controller.ts` — register/login/logout business logic
- [ ] Implement `content.controller.ts` — full CRUD with pagination
- [ ] Build admin content editor UI (rich text, slug auto-generation)
- [ ] Add `react-hook-form` + `zod` for form validation
- [ ] Integrate file/media uploads (S3 or local Multer)
- [ ] Add `jest` + `supertest` unit/integration tests for the backend
- [ ] Add `Playwright` E2E tests for the frontend
- [ ] Configure CI/CD pipeline (GitHub Actions)
