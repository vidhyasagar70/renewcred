# 🚀 Headless CMS Monorepo

> A production-ready, full-stack **Content Management System** built as a monorepo. Supports rich Markdown content with nested lists, data tables, and mathematical equations (LaTeX via KaTeX). Includes a dark-mode admin console, JWT-protected APIs, and one-command Docker orchestration.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Setup & How to Run](#setup--how-to-run)
5. [Evaluation Credentials & Seed Data](#evaluation-credentials--seed-data)
6. [API Overview](#api-overview)
7. [Architectural Decisions & Assumptions](#architectural-decisions--assumptions)
8. [Environment Variables](#environment-variables)
9. [Available Scripts](#available-scripts)
10. [Security Highlights](#security-highlights)

---

## Project Overview

This is a **headless CMS** with two integrated layers:

| Layer | Role |
|---|---|
| **Public Website** | Dynamically fetches and renders published articles from the backend API. Supports rich Markdown, nested lists, data tables, and LaTeX math equations rendered with KaTeX. |
| **Admin Console** | A JWT-protected dashboard (`/admin`) for creating, editing, publishing/unpublishing, and deleting content blocks. Features a live side-by-side Markdown + LaTeX preview editor. |

All content is stored as **raw Markdown** in MongoDB and rendered on demand on the client — no hardcoded content exists anywhere in the frontend.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14+ (App Router), TypeScript, Redux Toolkit, Tailwind CSS, Axios |
| **Backend** | Node.js, Express.js, TypeScript, Mongoose (MongoDB), JWT, bcryptjs |
| **Rich Content** | `react-markdown`, `remark-gfm`, `remark-math`, `rehype-katex`, KaTeX CSS |
| **Infrastructure** | Docker, Docker Compose v3.9, MongoDB 7 |

---

## Project Structure

```
renewcred/
├── frontend/                         # Next.js App Router (TypeScript)
│   ├── src/
│   │   ├── app/
│   │   │   ├── (public)/             # Public route group (no auth)
│   │   │   │   ├── layout.tsx        # Public layout (header + footer)
│   │   │   │   ├── page.tsx          # Homepage — featured published articles
│   │   │   │   ├── articles/         # /articles — listing with search + category filter
│   │   │   │   └── content/[slug]/   # /content/:slug — rich article detail page
│   │   │   ├── (admin)/              # Admin route group (JWT guarded)
│   │   │   │   ├── layout.tsx        # Admin shell (wraps AdminGuard + AdminLayoutClient)
│   │   │   │   └── admin/
│   │   │   │       ├── login/        # /admin/login — credential form
│   │   │   │       ├── dashboard/    # /admin/dashboard — stats, filters, content table
│   │   │   │       └── content/
│   │   │   │           ├── new/      # /admin/content/new — create article
│   │   │   │           └── [id]/     # /admin/content/:id — edit article
│   │   │   ├── layout.tsx            # Root layout (Redux StoreProvider, Inter font)
│   │   │   └── globals.css           # Tailwind base + component utilities
│   │   ├── components/
│   │   │   ├── AdminGuard.tsx        # Client-side route protection (JWT check on mount)
│   │   │   ├── AdminLayoutClient.tsx # Responsive sidebar layout (mobile burger menu)
│   │   │   ├── ContentEditorForm.tsx # Split-pane Markdown/LaTeX editor with live preview
│   │   │   └── MarkdownPreview.tsx   # ReactMarkdown + remark-gfm + KaTeX renderer
│   │   ├── services/
│   │   │   ├── apiClient.ts          # Axios instance (auto Bearer token, error normalization)
│   │   │   ├── authService.ts        # Login, register, getMe, logout
│   │   │   └── contentService.ts     # Public list/slug + Admin CRUD wrappers
│   │   ├── store/
│   │   │   ├── slices/
│   │   │   │   ├── authSlice.ts      # Auth state: user, token, isAuthenticated
│   │   │   │   └── contentSlice.ts   # Content list, selectedItem, pagination, filters, stats
│   │   │   ├── store.ts              # Redux store configuration
│   │   │   ├── hooks.ts              # Typed useAppDispatch / useAppSelector
│   │   │   └── provider.tsx          # Client StoreProvider wrapper
│   │   └── types/
│   │       └── index.ts              # All TypeScript interfaces and types
│   ├── Dockerfile                    # Multi-stage: dev (hot-reload) + production
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── .env                          # NEXT_PUBLIC_API_BASE_URL
│
├── backend/                          # Express API (TypeScript)
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.ts                 # Mongoose connect with retry + graceful shutdown
│   │   │   └── env.ts                # Typed dotenv loader (override: true)
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts    # register, login, getMe, logout
│   │   │   └── content.controller.ts # Public list/slug + Admin CRUD + live stats
│   │   ├── middlewares/
│   │   │   ├── auth.ts               # authenticate (JWT) + authorize (RBAC roles)
│   │   │   └── errorHandler.ts       # Centralised error handler
│   │   ├── models/
│   │   │   ├── User.model.ts         # Mongoose User schema (bcrypt pre-save hook)
│   │   │   └── Content.model.ts      # Mongoose Content schema (slug auto-generation)
│   │   ├── routes/
│   │   │   ├── auth.routes.ts        # /api/v1/auth/*
│   │   │   ├── public.routes.ts      # /api/v1/public/content (no auth)
│   │   │   └── content.routes.ts     # /api/v1/admin/content (admin only)
│   │   ├── utils/
│   │   │   ├── helpers.ts            # slugify utility
│   │   │   ├── jwt.utils.ts          # signToken / verifyToken
│   │   │   └── seed.ts               # Database seeder (admin + sample rich content)
│   │   ├── app.ts                    # Express app (helmet, cors, routes)
│   │   └── server.ts                 # HTTP server + graceful shutdown
│   ├── Dockerfile
│   ├── tsconfig.json
│   └── .env                          # MONGO_URI, JWT_SECRET, PORT, etc.
│
├── docker-compose.yml                # Orchestrates MongoDB + Backend + Frontend
├── .env.example                      # Root-level unified example
└── README.md
```

---

## Setup & How to Run

### Option A — Docker (Recommended, One Command)

> **Prerequisites**: [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

```bash
# 1. Clone the repository
git clone <repo-url> && cd renewcred

# 2. Start all services (MongoDB + Backend + Frontend)
docker-compose up --build
```

| Service | URL |
|---|---|
| 🌐 **Frontend** | http://localhost:3000 |
| 🔌 **Backend API** | http://localhost:5000/api/v1 |
| ❤️ **Health Check** | http://localhost:5000/api/health |
| 🍃 **MongoDB** | mongodb://localhost:27017/cms_db |

> **After starting, run the seeder** (in a separate terminal) to populate admin credentials and sample content:
> ```bash
> cd backend && npm run seed
> ```

---

### Option B — Native Local Development

> **Prerequisites**: Node.js ≥ 20, MongoDB running locally (e.g. via `mongod` or MongoDB Compass).

```bash
# ── 1. Install all workspace dependencies from root ──────────────────────────
npm install

# ── 2. Backend ───────────────────────────────────────────────────────────────
cd backend
# Environment is pre-configured for localhost in backend/.env
npm run dev                   # → http://localhost:5000

# ── 3. Frontend (new terminal) ───────────────────────────────────────────────
cd frontend
npm run dev                   # → http://localhost:3000

# ── 4. Seed the database (one-time, in another terminal) ─────────────────────
cd backend
npm run seed
```

---

## Evaluation Credentials & Seed Data

### 🔑 Default Admin Login

| Field | Value |
|---|---|
| **Email** | `admin@example.com` |
| **Password** | `Admin@123456` |

Navigate to **http://localhost:3000/admin/login** to sign in.

### 🌱 Seed Data Overview

The seeder (`npm run seed` from the `backend/` directory) creates:

| Article | Category | Status | Rich Content Featured |
|---|---|---|---|
| *Getting Started with Next.js CMS* | Documentation | ✅ Published | Nested ordered/unordered lists, GFM data table |
| *Introduction to Quantum Computing Equations* | Blog | ✅ Published | Block & inline LaTeX (Schrödinger eq., qubit states, quantum gate matrix table) |
| *Draft — Content Customisation and Styling Rules* | Page | 📝 Draft | Block LaTeX ($E=mc^2$, Einstein field equations) |

The draft article is **only visible in the Admin Dashboard**, not on the public site — demonstrating the publish-gate correctly.

---

## API Overview

### Public Endpoints (No Authentication)

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/health` | Service health check |
| `POST` | `/api/v1/auth/login` | Sign in — returns `{ user, token }` |
| `POST` | `/api/v1/auth/register` | Register a new admin account |
| `GET` | `/api/v1/public/content` | Paginated published articles (`?page=&limit=&category=&search=`) |
| `GET` | `/api/v1/public/content/:slug` | Single published article by URL slug |

### Protected Endpoints (Bearer JWT — Admin Role)

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/v1/auth/me` | Fetch current user profile |
| `POST` | `/api/v1/auth/logout` | Client-side logout acknowledgement |
| `GET` | `/api/v1/admin/content` | All articles (drafts + published) with search/filter/stats |
| `GET` | `/api/v1/admin/content/:id` | Fetch article by ID for editing |
| `POST` | `/api/v1/admin/content` | Create new content block |
| `PUT` | `/api/v1/admin/content/:id` | Update content block |
| `DELETE` | `/api/v1/admin/content/:id` | Delete content block |

---

## Architectural Decisions & Assumptions

### 1. Tech Stack Justification

| Choice | Justification |
|---|---|
| **Next.js App Router** | Route groups (`(public)` / `(admin)`) provide clean layout isolation without polluting URL namespaces. Hybrid SSR/CSR per route enables SEO on public pages and dynamic interactivity in the admin console. |
| **Express + TypeScript** | Explicit typing on controllers, middleware, and Mongoose models eliminates `any` leakage. The `ts-node-dev` hot-reload loop enables rapid iteration without a build step in development. |
| **MongoDB + Mongoose** | Flexible schema fits evolving content models. The `body` field stores raw Markdown strings — no serialisation overhead, easily queried with `$regex`. The `pre-validate` hook auto-generates the slug from the title. |
| **Redux Toolkit** | RTK's `createAsyncThunk` keeps all async API calls and their loading/error states declarative and co-located. `immer` under the hood enables mutation-style reducers with full immutability. |
| **Tailwind CSS** | Utility-first approach accelerates custom dark-mode design. HSL colour tokens (`primary-*`) in `tailwind.config.js` centralise the design palette. |

### 2. State Management Boundary

| State | Location | Rationale |
|---|---|---|
| Authenticated user (`user`, `token`, `isAuthenticated`) | **Redux** (`authSlice`) | Shared across all admin pages — sidebar profile, AdminGuard, API interceptors. |
| Content collection, pagination, filters, stats | **Redux** (`contentSlice`) | Dashboard, listing pages, and the editor all need shared access to the same content state. |
| Form field values (`title`, `body`, `slug`, etc.) | **Local `useState`** | Typing a character should NOT trigger a Redux dispatch. Local state provides zero-latency input with no unnecessary re-renders in unrelated components. |
| UI toggles (active tab `editor/preview`, modal open) | **Local `useState`** | Transient UI state that is meaningless outside the component. |

### 3. Rich Content Strategy

Content is **stored as raw Markdown** in the MongoDB `body` field (a plain `String`). On the rendering side:

| Layer | Library | Role |
|---|---|---|
| **Storage** | MongoDB `String` | Raw Markdown text, portable and human-readable |
| **Editor** | Native `<textarea>` | Zero-dependency, performant for large bodies |
| **Parsing** | `react-markdown` | Converts Markdown AST to React elements |
| **Tables** | `remark-gfm` | GitHub Flavored Markdown — enables `\|col\|` syntax |
| **Math parsing** | `remark-math` | Identifies `$...$` (inline) and `$$...$$` (block) delimiters |
| **Math rendering** | `rehype-katex` + `katex/dist/katex.min.css` | Compiles LaTeX expressions to HTML math via KaTeX |

The **content detail page** (`/content/[slug]`) and the **admin live preview** both use the same shared `<MarkdownPreview />` component, ensuring WYSIWYG consistency between editing and publishing.

### 4. Security Measures

- **Passwords** hashed with `bcryptjs` (12 salt rounds) via a Mongoose `pre-save` hook — never stored as plaintext.
- **JWT** tokens signed with `HS256` and a configurable secret; stored in `localStorage` on the client.
- **Axios interceptor** automatically attaches `Authorization: Bearer <token>` to every protected request.
- **Session expiry**: on any `401` response, `localStorage` is cleared and the AdminGuard redirects to `/admin/login`.
- **RBAC middleware** (`authorize('admin')`) wraps all admin content routes — role is embedded in the JWT payload and verified server-side on every request.
- **`helmet`** sets secure HTTP headers on every Express response.
- **CORS** is restricted to `CLIENT_URL` from environment variables.

### 5. Assumptions Made

> Since the original Figma design link was unavailable, a **custom responsive dark-mode UI** was designed from scratch using Tailwind CSS. Design decisions include:
>
> - A dark-first colour palette (`gray-950` / `gray-900` backgrounds, `primary-600` accent)
> - Glassmorphism cards with `backdrop-blur` in the admin console
> - Animated ping/spin loading states and fade-in transitions
> - A responsive sidebar for admin that collapses to a burger-menu drawer on mobile
> - Category pills, status badges (emerald for published, amber for draft), and a full-width responsive data table in the dashboard

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Default |
|---|---|---|
| `PORT` | Express server port | `5000` |
| `NODE_ENV` | Environment mode | `development` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/cms_db` |
| `JWT_SECRET` | JWT signing secret — **change in production** | `your_super_secret_jwt_key_change_in_production` |
| `JWT_EXPIRES_IN` | Token expiry duration | `7d` |
| `CLIENT_URL` | CORS allowed origin | `http://localhost:3000` |

### Frontend (`frontend/.env`)

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API base URL | `http://localhost:5000/api/v1` |

---

## Available Scripts

### Root (Monorepo)

```bash
npm run dev:backend          # Start backend dev server
npm run dev:frontend         # Start frontend dev server
npm run docker:up            # docker-compose up --build
npm run docker:down          # docker-compose down
```

### Backend (`cd backend`)

```bash
npm run dev                  # ts-node-dev hot-reload (port 5000)
npm run seed                 # Seed DB: admin user + 3 rich sample articles
npm run build                # tsc → dist/
npm run typecheck            # tsc --noEmit (CI check)
```

### Frontend (`cd frontend`)

```bash
npm run dev                  # next dev (port 3000)
npm run build                # next build (production bundle)
npm run typecheck            # tsc --noEmit (CI check)
npm run lint                 # next lint
```

---

## Security Highlights

- `helmet` — secure HTTP headers on every response
- Passwords hashed with `bcryptjs` (12 salt rounds) — never stored as plaintext
- JWT-based stateless auth — tokens never stored server-side
- CORS origin restricted to `CLIENT_URL`
- Admin pages marked with `robots: noindex, nofollow` metadata
- Production Docker containers run as non-root users
- `401` auto-logout via Axios response interceptor

---

*Built as a monorepo assignment submission demonstrating end-to-end full-stack TypeScript development with rich content support, JWT authentication, and Docker orchestration.*
