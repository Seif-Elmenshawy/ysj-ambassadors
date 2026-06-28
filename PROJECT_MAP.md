# YSJ Ambassadors — Project Map

> **Date:** June 2026
> **Stack:** MERN (MongoDB, Express, React, Node.js)
> **Design Inheritance:** MainBranch — same theme (colors, fonts, spacing, component patterns)

---

## [TECH_STACK]

### Frontend (mirrors MainBranch exactly)

| Package | Version | Purpose |
|---------|---------|---------|
| React | 19.2.7 | UI library |
| TypeScript | ~6.0.2 | Type safety |
| Vite | 8.1.0 | Build tool / dev server |
| Tailwind CSS | 3.4.14 | Utility CSS (same config as MainBranch) |
| React Router DOM | 7.2.0 | Client-side routing |
| Framer Motion | 11.15.0 | Animations & transitions |
| Axios | 1.7.7 | HTTP client |
| TanStack React Query | 5.64.0 | Server state / caching |
| Lucide React | 0.469.0 | Icons (same set) |

### Backend

| Package | Version | Purpose |
|---------|---------|---------|
| Node.js | 22 LTS | Runtime |
| Express | 4.22.2 | HTTP server / routing |
| Mongoose | 9.7.3 | MongoDB ODM |
| jsonwebtoken | 9.0.3 | JWT auth tokens |
| bcryptjs | 3.0.3 | Password hashing |
| cors | 2.8.6 | Cross-origin requests |
| dotenv | 17.4.2 | Environment variables |
| cookie-parser | 1.4.7 | Cookie parsing for refresh tokens |
| nodemon | 3.1.14 | Dev auto-restart |

### Database

| Technology | Purpose |
|------------|---------|
| MongoDB 7+ (Atlas) | Primary data store |
| Mongoose 9.7.3 | Schema modeling & validation |

---

## [SYSTEM_FLOW]

### 1. User Journey (Ambassador)

```
Sign Up ──> Email Verification ──> Dashboard ──> Get Referral Link
                                                    │
                                                    v
                              Share Link ──> Referral Signs Up
                                                    │
                                                    v
                              Reward Credited ──> Track in Dashboard
```

### 2. Data Flow

```
[Browser] ──HTTP──> [Express API] ──> [Mongoose] ──> [MongoDB Atlas]
                        │
                   [JWT Middleware]
                   [Role Guard: ambassador / admin]
```

### 3. Verifiable Goals (in order)

1. **Auth System** — Register, login, logout, JWT access + refresh tokens
2. **Profile Management** — View / edit ambassador profile, upload avatar
3. **Referral Code Generation** — Auto-generate unique code on sign-up
4. **Referral Tracking** — Track referrals (who joined, when, status)
5. **Referral Dashboard** — Stats: total referrals, pending, approved, rewards
6. **Admin Panel** — View all ambassadors, approve/reject referrals, manage rewards
7. **Theme Match** — UI identical in look & feel to MainBranch (colors, fonts, spacing)

---

## [ARCHITECTURE]

### Folder Structure

```
Ambassadors/
├── server/                      # Express backend
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── middleware/
│   │   ├── auth.js             # JWT verification
│   │   ├── adminGuard.js       # Admin role check
│   │   └── errorHandler.js     # Global error handler
│   ├── models/
│   │   ├── Ambassador.js       # Ambassador schema
│   │   ├── Referral.js         # Referral record schema
│   │   ├── Admin.js            # Admin schema
│   │   ├── Task.js             # Challenge/task schema
│   │   └── AmbassadorTask.js   # Per-ambassador task progress
│   ├── routes/
│   │   ├── authRoutes.js       # /api/auth/*
│   │   ├── ambassadorRoutes.js # /api/ambassadors/*
│   │   ├── referralRoutes.js   # /api/referrals/*
│   │   └── adminRoutes.js      # /api/admin/*
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── ambassadorController.js
│   │   ├── referralController.js
│   │   └── adminController.js
│   ├── utils/
│   │   ├── generateToken.js    # JWT helpers
│   │   └── generateCode.js     # Referral code generator
│   ├── .env
│   ├── server.js               # Entry point
│   └── package.json
│
├── client/                      # React frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.ts       # Axios instance with interceptors
│   │   ├── components/
│   │   │   ├── Common/         # Header, Footer, Loading, 404 (mirror MainBranch)
│   │   │   ├── Auth/           # LoginForm, RegisterForm
│   │   │   ├── Dashboard/      # StatsCards, ReferralList, RewardSummary
│   │   │   └── Admin/          # AmbassadorTable, ApprovalPanel
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   └── AdminPage.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx # Auth state provider
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   └── useReferrals.js
│   │   ├── App.tsx             # Routes (mirror MainBranch pattern)
│   │   ├── main.tsx            # Entry point
│   │   ├── index.css           # Same global styles as MainBranch
│   │   └── App.css
│   ├── tailwind.config.js      # Same config as MainBranch
│   ├── vite.config.ts          # Same config as MainBranch
│   ├── tsconfig.app.json       # Same config as MainBranch
│   └── package.json
│
├── package.json                # Root (scripts for both)
└── PROJECT_MAP.md              # This file
```

### Database Schemas

**Ambassador**
```
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (hashed, required),
  phone: String,
  avatar: String (URL),
  referralCode: String (unique, auto-generated),
  totalReferrals: Number (default 0),
  rewards: Number (default 0),
  score: Number (default 0),
  isVerified: Boolean (default false),
  createdAt: Date,
  updatedAt: Date
}
```
Tiers (derived from `totalReferrals`): Bronze (0-4), Silver (5-14), Gold (15-29), Platinum (30+)

**Referral**
```
{
  _id: ObjectId,
  ambassadorId: ObjectId (ref: Ambassador),
  referredName: String (required),
  referredEmail: String (required),
  status: String (enum: pending, approved, rejected, default: pending),
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Admin**
```
{
  _id: ObjectId,
  email: String (required, unique),
  password: String (hashed, required),
  role: String (default: 'admin'),
  createdAt: Date
}
```

**Task**
```
{
  _id: ObjectId,
  title: String (required),
  description: String,
  targetReferrals: Number (required, min: 1),
  daysToComplete: Number (required, min: 1),
  score: Number (required, min: 1),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

**AmbassadorTask**
```
{
  _id: ObjectId,
  ambassadorId: ObjectId (ref: Ambassador),
  taskId: ObjectId (ref: Task),
  progress: Number (default 0),
  completed: Boolean (default false),
  scoreEarned: Number (default 0),
  startedAt: Date,
  expiresAt: Date (required),
  completedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```
Unique index on `{ ambassadorId, taskId }`

### API Endpoints

**Auth**
- `POST /api/auth/register` — Create ambassador account (auto-assigns active tasks)
- `POST /api/auth/login` — Login, returns JWT
- `POST /api/auth/admin-login` — Admin login, returns JWT
- `GET /api/auth/me` — Get current user profile

**Ambassadors**
- `GET /api/ambassadors/leaderboard` — Public leaderboard (top 20 by referrals)
- `GET /api/ambassadors/:id` — Get ambassador details
- `PATCH /api/ambassadors/:id` — Update profile

**Referrals**
- `GET /api/referrals` — List ambassador's referrals
- `POST /api/referrals` — Create new referral (also updates task progress)
- `GET /api/referrals/stats` — Referral statistics (now includes score)
- `GET /api/referrals/tasks` — Ambassador's task progress

**Admin** *(all require auth + adminGuard)*
- `GET /api/admin/dashboard` — Aggregate stats + top ambassadors
- `GET /api/admin/ambassadors` — List all ambassadors
- `GET /api/admin/referrals` — List all referrals
- `PATCH /api/admin/referrals/:id/approve` — Approve referral
- `PATCH /api/admin/referrals/:id/reject` — Reject referral
- `DELETE /api/admin/ambassadors/:id` — Remove ambassador
- `GET /api/admin/tasks` — List all tasks
- `POST /api/admin/tasks` — Create task (auto-assigns to all ambassadors)
- `PATCH /api/admin/tasks/:id` — Update task
- `DELETE /api/admin/tasks/:id` — Delete task (also removes AmbassadorTask entries)
- `GET /api/admin/leaderboard` — Full ambassador leaderboard by score

### Design Inheritance from MainBranch

| Element | MainBranch Value | Ambassadors Uses |
|---------|-----------------|------------------|
| Primary color | `#1F2937` | Same |
| Secondary color | `#059669` | Same |
| Accent color | `#F59E0B` | Same |
| Red accent | `#d13c3c` / `#fa3347` | Same |
| Body font | `Poppins` | Same |
| Heading font | `Baloo Paaji 2` | Same |
| Decorative font | `Lobster` | Same |
| Max width | `1200px` / `1600px` | Same |
| Border radius | `8px`, `16px`, `20px`, `30px` | Same |
| Animations | `fadeIn`, `slideIn` | Same |
| Header/Footer | Fixed header, dark footer | Same patterns |
| Page transitions | Framer Motion `AnimatePresence` | Same |
| Icons | Lucide React | Same |

---

## [MAINBRANCH_IMAGES]

To fully replicate the MainBranch look, copy these images from `MainBranch/src/images/` to `Ambassadors/client/public/`:

| Source | Destination | Used In |
|--------|-------------|---------|
| `MainBranch/src/images/YSJ-Logo.png` | `public/logo.png` | Header logo |
| `MainBranch/src/images/Logo-rev.png` | `public/logo-rev.png` | Footer logo |
| `MainBranch/src/images/half-circle.png` | `public/half-circle.png` | Home hero decoration |
| `MainBranch/src/images/favicon/*` | `public/` | Browser tab icon |

Run this from the `Ambassadors` directory:
```powershell
Copy-Item "..\MainBranch\src\images\YSJ-Logo.png" "client\public\logo.png"
Copy-Item "..\MainBranch\src\images\Logo-rev.png" "client\public\logo-rev.png"
Copy-Item "..\MainBranch\src\images\half-circle.png" "client\public\half-circle.png"
Copy-Item "..\MainBranch\src\images\favicon\*" "client\public\"
```

Then update `Header.tsx` and `Footer.tsx` to import the PNG instead of inline SVG.

---

## [ORPHANS & PENDING]

| Item | Status | Notes |
|------|--------|-------|
| Welcome email on sign-up | Pending | Can use nodemailer or Resend |
| Forgot password flow | Pending | Add reset token + email |
| Reward tiers (bronze/silver/gold) | ✅ Done | Tier system derived from totalReferrals |
| Ambassador leaderboard | ✅ Done | Public & admin leaderboard endpoints |
| Admin task/challenge management | ✅ Done | CRUD tasks, auto-assign on create, progress tracking |
| File upload (avatars) | Pending | Cloudinary or local upload |
| Rate limiting | Pending | Add express-rate-limit in v1.1 |
| Pagination on referral lists | Pending | Add query params when volume grows |
| Unit tests | Pending | Jest or Vitest |
| Deployment config | Pending | Vercel (client) + Render/Railway (server) |
| Admin seed script | ✅ Done | `server/seed.js` — creates admin + 7 sample ambassadors + referrals |
| Avatar upload endpoint | Pending | Backend route + multer config needed |
| Task expiration notifications | Pending | Could notify ambassadors when tasks are about to expire |
| MainBranch image files | Pending | Copy `YSJ-Logo.png`, `Logo-rev.png`, `half-circle.png`, favicons from MainBranch `src/images/` |
| Font Awesome CDN | ✅ Done | Added to `index.html` via CDN |

### ✅ Completed

| Milestone | Status |
|-----------|--------|
| Monorepo structure (root + server + client) | ✅ |
| Express server with MongoDB connection | ✅ |
| Ambassador model (name, email, password, referralCode, totalReferrals, rewards) | ✅ |
| Admin model (email, password, role) | ✅ |
| Referral model (ambassadorId, referredName, referredEmail, status, notes) | ✅ |
| JWT auth (register, login, admin-login, get-me) | ✅ |
| Ambassador CRUD (get, update profile) | ✅ |
| Referral CRUD (create, list, stats) | ✅ |
| Admin endpoints (list ambassadors/referrals, approve/reject, delete) | ✅ |
| Auth middleware (protect, adminGuard) + error handler | ✅ |
| Vite + React + TypeScript client with MainBranch theme | ✅ |
| Tailwind config matching MainBranch (colors, fonts, animations) | ✅ |
| CSS — header/footer/nav/loading styles from MainBranch | ✅ |
| Header component (nav, mobile menu, auth-aware) | ✅ |
| Footer component (dark theme, YSJ branding) | ✅ |
| PageTransition component (Framer Motion) | ✅ |
| AuthContext (login, register, logout, localStorage persistence) | ✅ |
| Axios API client (base URL, JWT interceptor, 401 redirect) | ✅ |
| HomePage (hero, how-it-works cards) | ✅ |
| LoginPage (email/password form, error handling) | ✅ |
| RegisterPage (name/email/password/phone form) | ✅ |
| DashboardPage (referral code, stats cards, referrals table) | ✅ |
| ProfilePage (view/edit name/phone, copy referral code) | ✅ |
| AdminPage (admin login, referrals tab, ambassadors tab, approve/reject/delete) | ✅ |
| Task + AmbassadorTask models | ✅ |
| Task CRUD (admin) + auto-assign on create | ✅ |
| Active task auto-assignment on ambassador registration | ✅ |
| Referral creation updates task progress (auto-complete + award score) | ✅ |
| Admin dashboard (aggregate stats + top ambassadors) | ✅ |
| Admin leaderboard tab (full list with tier + score) | ✅ |
| Ambassador dashboard — tier badge, active tasks with progress bars, leaderboard | ✅ |
| Score stat card on ambassador dashboard | ✅ |
| Admin interceptor support (reads adminToken from localStorage) | ✅ |
| Seed script (`server/seed.js`) — admin + 7 ambassadors + referrals | ✅ |
| Font Awesome CDN integration | ✅ |
| MainBranch CSS classes: card, stat-card, form-wrap, form-input, table-wrap, badge, progress-bar | ✅ |
| Header uses Font Awesome toggle icons (fa-bars, fa-xmark) | ✅ |
| Footer with social links (Facebook, Instagram, LinkedIn) + admin link | ✅ |
| Loading component accepts optional style prop | ✅ |
| All pages use CSS classes instead of inline styles | ✅ |
| TypeScript compiles with zero errors | ✅ |
| Vite production build succeeds | ✅ |
