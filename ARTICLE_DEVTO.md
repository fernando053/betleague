---
title: "I Built a Full-Stack Football Betting Platform With AI — Here's What Actually Works (and What Doesn't)"
published: false
description: "A completely honest breakdown of building BetLeague: a virtual football betting app for friend groups. No hype, just real numbers and real code decisions."
tags: javascript, react, fullstack, programming
series: "Building in Public"
canonical_url: null
---

# I Built a Full-Stack Football Betting Platform With AI — Here's What Actually Works (and What Doesn't)

> **TL;DR**: I used AI-assisted development to build a complete virtual football betting platform called BetLeague — 33 API endpoints, 11 betting markets, 14 frontend pages, 30 tests. The entire repo has ~15,000 lines of code across a Turborepo monorepo. Here's an honest account of what I built, what surprised me, and what I'd do differently.

---

## Why I Built This

I wanted to learn full-stack development by building something real. Not another todo app. Not another weather app. Something with:

- Real business logic (betting math is harder than it looks)
- Multiple user roles and permissions
- Background jobs and data syncing
- A deployment story that actually works

The idea: a platform where friend groups can bet on real football matches using virtual credits. No real money, no legal issues, just fun competition.

**The catch**: I built most of this with AI assistance (Claude/Crush), and I want to be completely transparent about what that means — what worked, what didn't, and where I still had to intervene.

---

## Tech Stack (And Why I Chose Each Piece)

### The Monorepo

```
betleague/
├── apps/
│   ├── api/        → Express + Prisma + PostgreSQL
│   └── web/        → React + Vite + Tailwind
├── api/            → Vercel serverless entry point
├── vercel.json     → Deployment config
├── turbo.json      → Monorepo orchestration
└── package.json    → Workspace root
```

**Turborepo** was the right call. Running `turbo dev` starts both apps with hot reload. Running `turbo build` compiles everything in dependency order. I never have to think about build order.

### Backend: Express + Prisma

| Library | Version | Why |
|---------|---------|-----|
| Express | 4.19 | Battle-tested, huge ecosystem |
| Prisma | 5.14 | Best TypeScript ORM, period |
| Zod | 3.23 | Schema validation that catches bugs at compile time |
| bcryptjs | 2.4 | Password hashing |
| jsonwebtoken | 9.0 | JWT auth |
| helmet | 7.1 | Security headers |
| express-rate-limit | 7.2 | Abuse prevention |

**Prisma** deserves special mention. The schema-driven approach means my database types are always in sync with my code. Running `prisma generate` after a schema change instantly updates all TypeScript types. I cannot imagine going back to raw SQL or even Knex.

### Frontend: React + Vite + Tailwind

| Library | Version | Why |
|---------|---------|-----|
| React | 18.3 | Component model, ecosystem |
| Vite | 5.2 | Fastest dev server I've used |
| Tailwind CSS | 3.4 | Utility-first, fast prototyping |
| Zustand | 4.5 | Minimal state management |
| React Router | 6.23 | Client-side routing |
| Axios | 1.7 | HTTP client with interceptors |

**Zustand** over Redux was a no-brainer. The bet slip store is 40 lines of code. Redux would have been 200+.

### Database: PostgreSQL (via Supabase)

I started with SQLite for local development. Switched to PostgreSQL for production via Supabase's free tier. The switch was mostly painless — Prisma handles the abstraction — but I had to change `Float` fields to `Decimal` with `@db.Decimal(10, 2)` annotations for financial accuracy.

---

## What I Actually Built

### The Numbers

| Metric | Count |
|--------|-------|
| API Endpoints | 33 |
| Betting Markets | 11 |
| Frontend Pages | 14 |
| Unit Tests | 30 |
| Database Tables | 8 |
| Total Lines of Code | ~15,000 |

### The Betting Engine

This is the heart of the platform. Here's what it actually does:

**11 Betting Markets** with auto-generated odds:
- **1X2** (Home/Draw/Away) — the bread and butter
- **Double Chance** (1X, X2, 12) — lower risk, lower reward
- **Over/Under** (0.5, 1.5, 2.5, 3.5, 4.5) — five different lines
- **BTTS** (Both Teams To Score) — yes/no
- **Half-time Result** — 1X2 at half time
- **Correct Score** — 9 outcomes (1-0, 0-1, 1-1, 2-0, 0-2, 2-1, 1-2, 2-2, other)
- **Odd/Even** — total goals odd or even

**How odds are generated**: When matches are synced from the Football-Data.org API (or created from fallback data), odds are generated with controlled randomness. Each market has a base probability that gets jittered by ±15%. The odds are then calculated as `1 / probability` with a built-in margin.

**Critical security decision**: Odds are **locked from the database at bet time**, not sent from the client. The frontend shows odds, but when a bet is placed, the server fetches the current odds from the `Odds` table. This prevents client-side odds manipulation.

### The Settlement Engine

This runs every 2 minutes (via external cron on Vercel). Here's the actual flow:

```typescript
// Simplified from apps/api/src/services/bet.service.ts
async settlePendingBets() {
  if (isRunning) return;  // Prevent concurrent execution
  isRunning = true;
  
  try {
    const pendingBets = await prisma.bet.findMany({
      where: { status: 'PENDING', match: { status: 'FINISHED' } }
    });
    
    for (const bet of pendingBets) {
      const allWon = bet.selections.every(s => checkSelectionWon(s));
      const anyLost = bet.selections.some(s => checkSelectionLost(s));
      
      if (allWon) {
        const winnings = bet.selections.reduce((acc, s) => acc * Number(s.odds), bet.stake);
        await updateBalance(bet.userId, winnings - bet.stake);
        await createNotification(bet.userId, 'BET_WON', winnings);
      } else if (anyLost) {
        await createNotification(bet.userId, 'BET_LOST');
      }
    }
  } finally {
    isRunning = false;
  }
}
```

The `isRunning` flag is important — without it, two cron invocations could process the same bets twice.

### The Authentication System

JWT-based with role-based access control:

- **USER** role: Can browse matches, place bets, view rankings
- **ADMIN** role: Can manage users, sync matches manually, view system stats

The auth middleware checks the JWT token and attaches `userId` and `userRole` to the request. The `requireAdmin` middleware adds an additional role check.

**Rate limiting** is aggressive:
- General API: 200 requests per 15 minutes
- Login/Register: 10 requests per 15 minutes

### The Group System

Users can create groups and invite friends via 8-character hex codes. Each group has its own leaderboard. This was the feature that made the project "real" — it transforms a solo betting app into a social experience.

### The Admin Panel

A complete admin dashboard with:
- System statistics (total users, bets, groups)
- User management (list, edit roles, delete)
- Group management
- Manual match sync trigger
- Swagger/OpenAPI documentation at `/api/docs`

---

## The Deployment Story

### What I Tried (And Failed At)

| Platform | Result | Why It Failed |
|----------|--------|---------------|
| **Fly.io** | Installed, logged in | Requires credit card on file |
| **Render.com** | Configured | Free tier spins down after 15min |
| **Koyeb** | Researched | $29/month minimum |
| **Oracle Cloud** | Researched | Requires credit card verification |
| **Railway** | Researched | No free tier anymore |

### What Actually Works: Vercel + Supabase

| Component | Service | Cost |
|-----------|---------|------|
| Frontend | Vercel | Free |
| Backend | Vercel (serverless) | Free (100GB-hrs/month) |
| Database | Supabase | Free (500MB, 50K MAU) |
| Cron Jobs | cron-job.org | Free (external) |
| **Total** | | **$0/month** |

**The cron problem**: Vercel serverless functions can't run persistent processes. My original `node-cron` jobs that synced matches every 30 minutes and settled bets every 2 minutes wouldn't work. Solution: HTTP endpoints protected by a secret token, called by cron-job.org.

```typescript
// apps/api/src/index.ts — The cron endpoints
app.post('/api/cron/sync', async (req, res) => {
  const auth = req.headers.authorization;
  if (auth !== `Bearer ${env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  // ... run match sync
});
```

### The Serverless Entry Point

```javascript
// api/index.js — Vercel's entry point
require('dotenv').config({ path: '../apps/api/.env' });
const path = require('path');
process.chdir(path.join(__dirname, '..', 'apps', 'api'));
require('../apps/api/dist/index.js');
```

This is hacky but works. Vercel needs a single entry point, so this file loads the compiled Express app. The `app.listen()` call is skipped when `VERCEL` env is set.

---

## What Surprised Me

### 1. Betting Math Is Non-Trivial

Calculating combined odds for multi-selection bets sounds simple until you realize:
- Odds can't be negative
- Rounding errors compound across selections
- You need to handle edge cases (what if odds are 0? What if a selection is cancelled?)

### 2. The Settlement Engine Is the Hardest Part

Getting the math right for bet settlement was more complex than expected. Consider a 3-selection bet:
- Selection 1: Won (odds 1.90)
- Selection 2: Won (odds 2.10)
- Selection 3: Lost (odds 1.85)

The user loses the entire stake. But what about:
- Selection 1: Won
- Selection 2: Won
- Selection 3: Cancelled (match abandoned)

In this case, the bet should be recalculated without Selection 3. I handled this by treating cancelled selections as `1.0` odds (effectively removing them from the calculation).

### 3. Windows Development Has Surprises

- `grep` isn't available by default — had to use alternative search tools
- `sleep` command doesn't exist — timing-dependent scripts break
- Prisma client locks on Windows — must kill all node processes before regenerating
- Path with spaces (`C:/Users/Fernando Vasconcelos/Desktop/nandobets`) causes issues with some tools

### 4. AI Assistance Is Fast But Not Perfect

The AI (Claude/Crush) was incredibly useful for:
- Generating boilerplate (routes, services, types)
- Writing tests
- Creating deployment configs
- Debugging Prisma schema issues

But I still had to:
- Make architectural decisions (Vercel vs Render, SQLite vs PostgreSQL)
- Debug deployment issues that weren't in the training data
- Verify that generated code actually worked end-to-end
- Refuse some suggestions (the AI wanted to add WebSockets — overkill for this project)

---

## What I'd Do Differently

### 1. Start With PostgreSQL From Day One

The SQLite-to-PostgreSQL migration was mostly painless, but it would have been even more painless if I'd just started with PostgreSQL via Supabase from the beginning. The `Float` vs `Decimal` issue alone cost me an hour.

### 2. Write Tests Earlier

I wrote 30 tests, but I wrote them after most features were built. Writing tests alongside features would have caught the odds calculation bugs earlier.

### 3. Don't Over-Engineer the Cron System

My original approach used `node-cron` inside the Express server. This seemed elegant until I tried to deploy to Vercel. The HTTP endpoint approach is simpler and more portable.

### 4. Use Fewer Dependencies

I installed `swagger-jsdoc` and `swagger-ui-express` for API docs. They work, but the JSDoc comments add visual clutter to every route handler. A simpler approach would be to manually write an OpenAPI spec.

---

## The Code Structure (For Anyone Wanting to Contribute)

```
apps/api/
├── src/
│   ├── config/
│   │   └── env.ts           # Environment variables + Zod schemas
│   ├── lib/
│   │   └── prisma.ts        # Singleton Prisma client
│   ├── middleware/
│   │   ├── auth.ts          # JWT authentication
│   │   └── validation.ts    # Zod request validation
│   ├── routes/
│   │   ├── auth.routes.ts   # Login, register, profile
│   │   ├── bet.routes.ts    # Place, view, cancel bets
│   │   ├── group.routes.ts  # Create, join, manage groups
│   │   ├── match.routes.ts  # Browse matches, view odds
│   │   ├── admin.routes.ts  # Admin panel endpoints
│   │   └── ...
│   ├── services/
│   │   ├── bet.service.ts   # Bet placement + settlement logic
│   │   ├── match.service.ts # Match sync + odds generation
│   │   └── ...
│   └── index.ts             # Express server + cron endpoints

apps/web/
├── src/
│   ├── lib/
│   │   ├── api.ts           # Axios instance with JWT interceptor
│   │   └── auth.tsx         # React Context for authentication
│   ├── store/
│   │   └── betSlip.ts       # Zustand store for bet slip
│   ├── pages/
│   │   ├── Dashboard.tsx    # Main dashboard
│   │   ├── Matches.tsx      # Match browser
│   │   ├── BetHistory.tsx   # Bet history + details
│   │   ├── Groups.tsx       # Group management
│   │   ├── Rankings.tsx     # Leaderboard
│   │   ├── Statistics.tsx   # User statistics
│   │   └── ...
│   └── components/
│       ├── BetSlip.tsx      # Multi-selection bet slip
│       └── ...
```

### Key Patterns

**Services are plain objects** (not classes):
```typescript
export const betService = {
  async placeBet(userId: string, selections: BetSelection[], stake: number) {
    // Business logic here
  }
};
```

**Error handling follows a consistent pattern**:
```typescript
try {
  const result = await someService.doSomething();
  res.json(result);
} catch (error) {
  res.status(400).json({ 
    error: error instanceof Error ? error.message : 'Erro desconhecido' 
  });
}
```

**Validation uses Zod schemas**:
```typescript
const betSchema = z.object({
  matchId: z.string().cuid(),
  selections: z.array(z.object({
    market: z.string(),
    selection: z.string(),
  })).min(1).max(20),
  stake: z.number().positive().max(100),
});
```

---

## What's Next

| Feature | Priority | Difficulty |
|---------|----------|------------|
| Real-time updates (SSE) | High | Medium |
| Search functionality | High | Easy |
| Password reset flow | High | Medium |
| OAuth (Google/GitHub) | Medium | Medium |
| Live odds updates | Medium | Hard |
| Mobile app (React Native) | Low | Hard |
| Multi-language support | Low | Easy |

---

## Final Thoughts

Building BetLeague taught me more about full-stack development than any tutorial or course. The key lessons:

1. **Real projects have real complexity** — even "simple" features like betting settlement have dozens of edge cases
2. **Deployment is half the work** — getting code to run locally is easy; getting it to run in production is a different game
3. **AI assistance accelerates but doesn't replace understanding** — I had to understand every piece of generated code to deploy and debug it
4. **Start simple, iterate** — the SQLite approach let me build fast; the PostgreSQL migration was worth it for production
5. **Security matters from day one** — odds locking, rate limiting, input validation — these aren't optional

The entire codebase is open source on GitHub. If you're building something similar, feel free to use it as a reference, contribute, or just roast my code.

**GitHub**: [github.com/fernando053/betleague](https://github.com/fernando053/betleague)

---

*Have questions about the architecture? Found a bug? Want to contribute? Open an issue on GitHub or drop a comment below.*
