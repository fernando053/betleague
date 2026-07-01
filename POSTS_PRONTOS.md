# Posts Prontos para Copiar e Colar

---

## 1. REDDIT — r/webdev

**Título:**
I built a virtual football betting platform with AI — completely honest about what works

**Corpo:**
Hey r/webdev,

I just finished building betNANDO — a full-stack virtual football betting platform where friend groups compete with virtual credits on real matches.

**The tech stack:**
- React 18 + Vite + Tailwind CSS (frontend)
- Express + Prisma + PostgreSQL (backend)
- Deployed on Vercel + Supabase (free tier, $0/month)

**What actually works (verified):**
- JWT authentication with role-based access
- 11 betting markets with auto-generated odds
- Multi-selection bet slips (up to 20 selections)
- Automatic bet settlement via cron jobs
- Friend groups with invite codes
- Global + group rankings
- Admin panel with user management
- PWA (installable on mobile)
- 30 unit tests

**What doesn't work (honest):**
- No real-time updates (uses 30s polling)
- No OAuth login
- No search functionality
- Odds are estimated, not from real bookmakers

I built most of this with AI assistance (Claude) and I want to be transparent about that. The AI was great for boilerplate and debugging, but I still had to make all architectural decisions and verify everything worked end-to-end.

The entire codebase is open source: https://github.com/fernando053/betleague

Would love feedback on the code structure and architecture decisions.

---

## 2. REDDIT — r/reactjs

**Título:**
betNANDO: Full-stack football betting app built with React + Express. Open source.

**Corpo:**
Built a virtual football betting platform for friend groups. React 18 + Vite + Tailwind on the frontend, Express + Prisma + PostgreSQL on the backend.

Features: 11 betting markets, multi-selection bet slips, friend groups with invite codes, rankings, admin panel, PWA.

Deployed on Vercel + Supabase (free tier). 33 API endpoints, 30 tests.

Honest about what works and what doesn't — README has a full breakdown.

GitHub: https://github.com/fernando053/betleague

---

## 3. REDDIT — r/node

**Título:**
Virtual football betting platform: Express + Prisma + PostgreSQL. 33 API endpoints.

**Corpo:**
Built a complete betting platform with Express, Prisma ORM, and PostgreSQL. Features JWT auth, Zod validation, rate limiting, background job settlement, and Swagger docs.

Key architectural decisions:
- Services as plain objects (not classes)
- Odds locked from DB at bet time (not from client)
- HTTP cron endpoints instead of node-cron (works on Vercel)
- Singleton PrismaClient with global cache for hot-reload

Deployed on Vercel serverless + Supabase. $0/month.

https://github.com/fernando053/betleague

---

## 4. TWITTER/X — Thread (7 tweets)

**Tweet 1:**
🧵 I just built a complete football betting platform in 2 weeks using AI assistance.

Here's what's inside and what I learned about building in public 👇

**Tweet 2:**
⚽ The features:
• 11 betting markets (1X2, Over/Under, BTTS, etc.)
• Multi-selection bet slips
• Friend groups with invite codes
• Global + group rankings
• Admin panel
• PWA (installable on mobile)

**Tweet 3:**
🛠️ The tech:
• React 18 + Vite + Tailwind
• Express + Prisma + PostgreSQL
• Vercel + Supabase (free tier)
• 33 API endpoints
• 30 unit tests

Total cost: $0/month

**Tweet 4:**
✅ What works perfectly:
• JWT authentication
• Bet placement with locked odds
• Automatic settlement
• Notifications
• Group system
• Statistics dashboard

**Tweet 5:**
⚠️ What doesn't work (being honest):
• No real-time updates (polling)
• No OAuth
• No search
• Odds are estimated
• API key expired (fallback data)

**Tweet 6:**
🧠 What I learned:
1. Betting math is harder than it looks
2. Deployment is half the work
3. AI accelerates but doesn't replace understanding
4. Start simple, iterate

**Tweet 7:**
The entire codebase is open source. If you're building something similar, feel free to use it as a reference.

⭐ https://github.com/fernando053/betleague

#javascript #react #fullstack #open-source #webdev

---

## 5. HACKER NEWS — Show HN

**Título:**
Show HN: betNANDO – Virtual football betting platform for friend groups

**URL:**
https://github.com/fernando053/betleague

**Corpo:**
I built a full-stack virtual football betting platform where friends compete with virtual credits on real football matches.

Key features:
- 11 betting markets with auto-generated odds
- Multi-selection bet slips with combined odds
- Friend groups with invite codes and private leaderboards
- Automatic bet settlement via external cron jobs
- Admin panel with user/group management
- PWA (installable on mobile/desktop)
- 33 REST API endpoints with Swagger docs
- 30 unit tests

Stack: React 18, Vite, Tailwind, Express, Prisma, PostgreSQL (Supabase), deployed on Vercel.

Built primarily with AI assistance (Claude). The README has an honest breakdown of what works and what doesn't. Would love feedback.

---

## 6. DEV.TO — Título e Primeiro Parágrafo

**Título:**
I Built a Full-Stack Football Betting Platform With AI — Here's What Actually Works (and What Doesn't)

**Subtítulo:**
A completely honest breakdown of building betNANDO: a virtual football betting app for friend groups. No hype, just real numbers and real code decisions.

*(O artigo completo está no arquivo ARTICLE_DEVTO.md que você tem localmente)*

---

## 7. DISCORD — Mensagem para Reactiflux/Nodeiflux

Hey everyone, I just open-sourced a full-stack betting platform I built with AI assistance.

Stack: React + Vite + Tailwind + Express + Prisma + PostgreSQL, deployed on Vercel + Supabase ($0/month).

33 API endpoints, 11 betting markets, 30 tests. The README has an honest breakdown of what works and what doesn't.

Would love feedback on the architecture: https://github.com/fernando053/betleague

---

## HORÁRIOS SUGERIDOS (BRT)

| Horário | Onde postar |
|---------|-------------|
| 12:00 | Reddit (r/webdev) |
| 12:30 | Reddit (r/reactjs) |
| 13:00 | Reddit (r/node) |
| 13:30 | Twitter/X thread |
| 14:00 | Hacker News |
| 15:00 | Dev.to article |
| 16:00 | Discord servers |
| 17:00+ | Responder todos os comentários |
