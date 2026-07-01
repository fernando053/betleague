<div align="center">

# ⚽ BetLeague

### Virtual Football Betting Platform for Friend Groups

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933.svg)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.14-2D3748.svg)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4.svg)](https://tailwindcss.com/)

**Bet with virtual credits on real football matches. Compete with friends, climb the rankings, and prove you're the smartest bettor in the group.**

[🚀 Deploy](#-deploy) | [📖 API Docs](#-api-endpoints) | [🎯 Features](#-features) | [🛠️ Tech Stack](#-tech-stack)

</div>

---

## 📐 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      BETLEAGUE ARCHITECTURE                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────┐     ┌─────────────────┐                    │
│  │   🖥️ Frontend   │     │   ⚙️ Backend    │                    │
│  │   React + Vite  │────▶│   Express.js    │                    │
│  │   Port 5555     │     │   Port 3001     │                    │
│  └─────────────────┘     └────────┬────────┘                    │
│                                   │                              │
│                    ┌──────────────┼──────────────┐              │
│                    │              │              │              │
│                    ▼              ▼              ▼              │
│           ┌─────────────┐ ┌─────────────┐ ┌─────────────┐      │
│           │  🗄️ SQLite  │ │  🔐 JWT     │ │  📡 Football│      │
│           │  Database   │ │  Auth       │ │  Data API   │      │
│           └─────────────┘ └─────────────┘ └─────────────┘      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 🔄 How It Works

```
1. User registers → Gets 100 virtual credits
2. Browse matches → View odds for 11 betting markets
3. Build bet slip → Combine up to 20 selections
4. Place bet → Stake deducted, odds locked from DB
5. Match settles → System checks results, pays winners
6. Climb rankings → Compete with friends in groups
```

---

## 🎯 What Actually Works

### ✅ Fully Implemented

| Feature | Status | Details |
|---------|--------|---------|
| 🔐 **JWT Authentication** | ✅ Working | Login, register, password hashing (bcrypt), token refresh |
| 👥 **Groups System** | ✅ Working | Create, join via invite code (8-char hex), max 50 members, group rankings |
| ⚽ **Match Browser** | ✅ Working | Upcoming/live matches, cursor pagination, match details |
| 🎰 **11 Betting Markets** | ✅ Working | 1X2, Double Chance, Over/Under (0.5-4.5), BTTS, Half-time, Correct Score, Odd/Even |
| 🎫 **Bet Slips** | ✅ Working | Multi-selection bets (max 20), combined odds, stake presets |
| 💰 **Virtual Wallet** | ✅ Working | 100 starting credits, balance tracking, profit/ROI stats |
| 🏆 **Rankings** | ✅ Working | Global top 50 + group leaderboards sorted by balance |
| 📊 **Statistics** | ✅ Working | Win rate, profit, ROI, total bets, wins, losses |
| 🔔 **Notifications** | ✅ Working | In-app notifications (bet placed/won/lost/cancelled), mark read |
| 👑 **Admin Panel** | ✅ Working | Stats dashboard, user CRUD, group management, manual sync |
| 📱 **PWA** | ✅ Working | Installable, offline fallback, service worker, iOS detection |
| 📚 **Swagger Docs** | ✅ Working | OpenAPI 3.0 at `/api/docs` |
| 🛡️ **Security** | ✅ Working | Rate limiting, input validation (Zod), CORS, Helmet |

### ⚠️ Partially Working

| Feature | Status | Details |
|---------|--------|---------|
| 📡 **Football Data API** | ⚠️ API key expired | Falls back to hardcoded World Cup matches |
| 🔄 **Match Sync** | ⚠️ Depends on API | Needs valid `FOOTBALL_DATA_API_KEY` or uses fallback |
| 🎲 **Odds Generation** | ⚠️ Estimated only | Auto-generates odds with jitter, no real market data |

### ❌ Not Implemented

| Feature | Status | Details |
|---------|--------|---------|
| 📡 **Real-time Updates** | ❌ Not built | No WebSockets/SSE, uses 30s polling for notifications |
| 📧 **Email Notifications** | ❌ Not built | In-app only, no email/SMS/push delivery |
| 🔑 **Password Reset** | ❌ Not built | No forgot password flow |
| 🌐 **OAuth Login** | ❌ Not built | Email/password only |
| 🔍 **Search** | ❌ Not built | No match/user search functionality |
| ✏️ **Edit Bets** | ❌ Not built | Can only cancel pending bets, not modify |
| 📈 **Live Odds** | ❌ Not built | Odds are static once generated |

---

## 🎰 Betting Markets

### Auto-Generated Odds (11 markets)

| Market | Selections | Example Odds |
|--------|------------|--------------|
| **1X2** | Home, Draw, Away | 1.90, 3.50, 3.80 |
| **Double Chance** | 1X, X2, 12 | 1.30, 1.80, 1.25 |
| **Over/Under 0.5** | Over, Under | 1.08, 9.50 |
| **Over/Under 1.5** | Over, Under | 1.35, 3.20 |
| **Over/Under 2.5** | Over, Under | 1.85, 1.95 |
| **Over/Under 3.5** | Over, Under | 2.60, 1.50 |
| **Over/Under 4.5** | Over, Under | 3.40, 1.30 |
| **BTTS** | Yes, No | 1.75, 2.05 |
| **Half-time Result** | Home, Draw, Away | 2.80, 2.20, 3.60 |
| **Correct Score** | 9 outcomes | 5.50 - 12.00 |
| **Odd/Even** | Odd, Even | 1.90, 1.90 |

### Scraped Odds (via `odds.json`)

| Market | Description |
|--------|-------------|
| Handicap ±0.5, ±1.5 | Asian handicap |
| Total Goals 0-6 | Exact goal count |

---

## 🛠️ Tech Stack

<table>
<tr>
<td><strong>Frontend</strong></td>
<td><strong>Backend</strong></td>
<td><strong>Database</strong></td>
<td><strong>DevOps</strong></td>
</tr>
<tr>
<td>

- ⚛️ React 18.3
- 📦 Vite 5.2
- 🎨 Tailwind CSS 3.4
- 🗃️ Zustand 4.5
- 🌐 React Router 6
- 📡 Axios 1.7
- 📱 PWA (Service Worker)

</td>
<td>

- 🟢 Node.js 20
- 🚂 Express 4.19
- 🔐 JWT + bcrypt
- 📝 Zod Validation
- 📚 Swagger/OpenAPI
- 🛡️ Helmet + CORS

</td>
<td>

- 💾 SQLite (Dev)
- 🗄️ PostgreSQL (Prod)
- 🔧 Prisma ORM 5.14

</td>
<td>

- 🐳 Docker Compose
- ⚡ Turborepo
- 🧪 Vitest
- 📝 ESLint + Prettier

</td>
</tr>
</table>

---

## ⚡ Quick Start

### Prerequisites

- Node.js 20+
- Docker (optional, for PostgreSQL)

### 🐳 Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/fernando053/betleague.git
cd betleague

# Start PostgreSQL + API + Web
docker-compose up -d

# Create tables
npx prisma db push

# Seed test data
npx prisma db seed
```

### 🔧 Manual Setup

```bash
# Clone the repository
git clone https://github.com/fernando053/betleague.git
cd betleague

# Install dependencies
npm install

# Setup database
cd apps/api
cp .env.example .env
# Edit .env with your DATABASE_URL

# Create tables and seed data
npx prisma db push
npx tsx prisma/seed.ts

# Start development
cd ../..
npm run dev
```

### 📱 Access

| Service | URL |
|---------|-----|
| 🌐 Frontend | http://localhost:5555 |
| ⚙️ API | http://localhost:3001 |
| 📚 Swagger Docs | http://localhost:3001/api/docs |
| 🩺 Health Check | http://localhost:3001/api/health |

### 🔑 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| 👑 Admin | admin@betleague.com | admin123 |
| 👤 User | joao@example.com | password123 |
| 👤 User | maria@example.com | password123 |
| 👤 User | pedro@example.com | password123 |

**Group invite code:** `TESTCODE`

---

## 📁 Project Structure

```
betleague/
├── 📂 apps/
│   ├── 📂 api/                    # Express Backend
│   │   ├── 📂 prisma/
│   │   │   ├── schema.prisma      # Database schema (8 models)
│   │   │   └── seed.ts            # Test data seeder
│   │   ├── 📂 src/
│   │   │   ├── 📂 config/         # Env, Swagger config
│   │   │   ├── 📂 jobs/           # Cron jobs (sync, settle)
│   │   │   ├── 📂 middleware/     # Auth, Validation
│   │   │   ├── 📂 routes/         # 8 route files
│   │   │   ├── 📂 services/       # 8 service files
│   │   │   ├── 📂 lib/            # Prisma client
│   │   │   └── index.ts           # Entry point
│   │   ├── 📂 tests/              # 17 API tests
│   │   └── package.json
│   │
│   └── 📂 web/                    # React Frontend
│       ├── 📂 src/
│       │   ├── 📂 components/     # BetSlip, Layout, Navbar
│       │   ├── 📂 pages/          # 14 page components
│       │   ├── 📂 hooks/          # useIOS detection
│       │   ├── 📂 lib/            # API client, Auth context
│       │   ├── 📂 store/          # Zustand bet slip store
│       │   └── main.tsx           # Entry point
│       ├── 📂 public/             # PWA assets, icons
│       ├── 📂 tests/              # 3 Web tests
│       └── package.json
│
├── 📄 docker-compose.yml          # PostgreSQL + API + Web
├── 📄 turbo.json                  # Monorepo config
├── 📄 .eslintrc.json              # Linting
└── 📄 .prettierrc                 # Formatting
```

---

## 📡 API Endpoints

<details>
<summary><strong>🔐 Authentication (2 endpoints)</strong></summary>

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Register new user (100 CR free) |
| POST | `/api/auth/login` | Public | Login with email/password |

</details>

<details>
<summary><strong>👤 Users (3 endpoints)</strong></summary>

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/users/me` | JWT | Get current user profile |
| PATCH | `/api/users/me` | JWT | Update profile (name, email) |
| POST | `/api/users/change-password` | JWT | Change password |

</details>

<details>
<summary><strong>👥 Groups (4 endpoints)</strong></summary>

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/groups` | JWT | Create group (auto-generates invite code) |
| POST | `/api/groups/join` | JWT | Join group via 8-char invite code |
| GET | `/api/groups` | JWT | List user's groups |
| GET | `/api/groups/:id` | JWT | Group detail + members ranked by balance |
| DELETE | `/api/groups/:id` | JWT | Delete group (owner only) |

</details>

<details>
<summary><strong>⚽ Matches (5 endpoints)</strong></summary>

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/matches` | JWT | Upcoming matches (cursor pagination) |
| GET | `/api/matches/live` | JWT | Live/started matches |
| GET | `/api/matches/:id` | JWT | Match detail + all odds |
| POST | `/api/matches/sync` | Admin | Sync matches from football-data.org |
| POST | `/api/matches/sync-odds` | Admin | Apply scraped odds from odds.json |

</details>

<details>
<summary><strong>🎰 Bets (5 endpoints)</strong></summary>

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/bets` | JWT | Place bet (max 20 selections) |
| GET | `/api/bets` | JWT | List user's bets (cursor pagination) |
| GET | `/api/bets/active` | JWT | List pending bets |
| GET | `/api/bets/:id` | JWT | Get bet detail |
| POST | `/api/bets/:id/cancel` | JWT | Cancel pending bet (refunds stake) |
| POST | `/api/bets/settle` | Admin | Manual settlement trigger |

</details>

<details>
<summary><strong>🏆 Rankings (2 endpoints)</strong></summary>

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/rankings/global` | JWT | Global top 50 by balance |
| GET | `/api/rankings/group/:id` | JWT | Group rankings |

</details>

<details>
<summary><strong>🔔 Notifications (4 endpoints)</strong></summary>

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/notifications` | JWT | List notifications (max 50) |
| GET | `/api/notifications/unread-count` | JWT | Get unread count |
| PATCH | `/api/notifications/:id/read` | JWT | Mark as read |
| POST | `/api/notifications/read-all` | JWT | Mark all as read |

</details>

<details>
<summary><strong>👑 Admin (8 endpoints)</strong></summary>

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/stats` | Admin | Dashboard statistics |
| GET | `/api/admin/users` | Admin | List all users (paginated) |
| POST | `/api/admin/users` | Admin | Create user with custom balance |
| PATCH | `/api/admin/users/:id` | Admin | Update user (balance, block, role) |
| DELETE | `/api/admin/users/:id` | Admin | Delete user |
| GET | `/api/admin/groups` | Admin | List all groups |
| DELETE | `/api/admin/groups/:id` | Admin | Delete group |
| POST | `/api/admin/sync-matches` | Admin | Force match sync |

</details>

<details>
<summary><strong>🔄 Cron (2 endpoints)</strong></summary>

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/cron/sync` | Bearer | Sync matches (for external cron) |
| GET | `/api/cron/settle` | Bearer | Settle pending bets (for external cron) |
| GET | `/api/health` | Public | Health check |

</details>

---

## ⚙️ Environment Variables

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `DATABASE_URL` | ✅ | PostgreSQL/SQLite connection string | - |
| `JWT_SECRET` | ✅ | JWT signing secret | - |
| `JWT_EXPIRES_IN` | ❌ | Token expiration | `7d` |
| `PORT` | ❌ | Server port | `3001` |
| `FOOTBALL_DATA_API_KEY` | ❌ | Football-Data.org API key (expired) | - |
| `FRONTEND_URL` | ❌ | CORS allowed origin | `http://localhost:5173` |
| `CRON_SECRET` | ❌ | Secret for cron endpoints | - |

---

## 🧪 Testing

```bash
# Run all tests (30 total)
npm test

# Run API tests only (27 tests)
npm run test:api

# Run Web tests only (3 tests)
npm run test:web
```

### Test Coverage

| Suite | Tests | What's Tested |
|-------|-------|---------------|
| `schemas.test.ts` | 5 | Zod validation schemas |
| `bet-logic.test.ts` | 11 | Bet settlement logic (all markets) |
| `env.test.ts` | 11 | Environment config, validation |
| `localStorage.test.ts` | 2 | localStorage browser mock |
| `hooks.test.ts` | 1 | Hook exports |

---

## 📊 Database Schema

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    User     │────▶│    Group    │◀────│ GroupMember  │
│             │     │             │     │             │
│ • balance   │     │ • name      │     │ • groupId   │
│ • betsCount │     │ • inviteCode│     │ • userId    │
│ • betsWon   │     │ • adminId   │     │ • joinedAt  │
│ • roi       │     └─────────────┘     └─────────────┘
│ • profit    │
│ • role      │
└──────┬──────┘
       │
       ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│     Bet     │────▶│BetSelection │◀────│    Match    │
│             │     │             │     │             │
│ • stake     │     │ • market    │     │ • homeTeam  │
│ • totalOdds │     │ • selection │     │ • awayTeam  │
│ • potential │     │ • odds      │     │ • status    │
│ • status    │     │ • won       │     │ • matchDate │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                                               ▼
                                        ┌─────────────┐
                                        │    Odds     │
                                        │             │
                                        │ • market    │
                                        │ • selection │
                                        │ • value     │
                                        │ • source    │
                                        └─────────────┘
```

---

## 🚀 Deploy

### Free Options (No Credit Card)

| Platform | Type | Limitations |
|----------|------|-------------|
| **Vercel** | Serverless | 10s timeout, no persistent cron |
| **Render.com** | Web Service | 15min spin-down on free tier |
| **Supabase** | PostgreSQL | 500MB storage, 500K rows |

### Deploy Architecture (Vercel + Supabase)

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────┐
│     🌐 Vercel    │     │   🗄️ Supabase    │     │ cron-job.org │
│   (Frontend +    │────▶│   (PostgreSQL)   │     │   (Triggers) │
│    API Server)   │     │                  │     │              │
└──────────────────┘     └──────────────────┘     └──────┬───────┘
                                                         │
                              ┌──────────────────────────┘
                              │ Ping every 30min/2min
                              ▼
                       ┌──────────────┐
                       │ /api/cron/*  │
                       └──────────────┘
```

📖 **Complete guide:** See [DEPLOY.md](DEPLOY.md)

---

## 📄 License

MIT License

```
MIT License

Copyright (c) 2026 BetLeague

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<div align="center">

![GitHub stars](https://img.shields.io/github/stars/fernando053/betleague?style=social)
![GitHub forks](https://img.shields.io/github/forks/fernando053/betleague?style=social)
![GitHub last commit](https://img.shields.io/github/last-commit/fernando053/betleague)

**Made with ⚽ and ❤️ for football friends worldwide**

[⬆ Back to Top](#-betleague)

</div>
