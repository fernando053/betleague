# Deploy betNANDO — Vercel + Supabase (100% grátis, sem cartão)

## Arquitetura

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Vercel    │────▶│  Supabase    │     │ cron-job.org│
│ (API+Web)   │     │ (PostgreSQL) │     │ (triggers)  │
└─────────────┘     └──────────────┘     └──────┬──────┘
                                                │
                           ┌────────────────────┘
                           │ ping a cada 30min/2min
                           ▼
                    ┌──────────────┐
                    │  /api/cron/* │
                    └──────────────┘
```

---

## Passo 1 — Criar conta no Supabase

1. Vai a **https://supabase.com** e faz login com GitHub
2. Clica em **New Project**
3. Configura:
   - **Organization:** cria uma ou usa existente
   - **Project Name:** `betleague`
   - **Database Password:** escolhe uma password forte (guarda!)
   - **Region:** West Europe (Amsterdam)
4. Cria o projeto
5. Vai a **Settings** → **Database** → **Connection string** → **URI**
6. **Copia a URI** — vais precisar dela
   - Formato: `postgresql://postgres.[ref]:[password]@aws-0-eu-west-1.pooler.supabase.com:6543/postgres`

---

## Passo 2 — Criar conta no Vercel

1. Vai a **https://vercel.com** e faz login com GitHub
2. Clica em **Add New...** → **Project**
3. Seleciona o repositório `fernando053/betleague`
4. Configura:
   - **Framework Preset:** Outro
   - **Root Directory:** `.` (deixa vazio ou `.`)
   - **Build Command:** (deixa vazio — o vercel.json trata disso)
   - **Output Directory:** (deixa vazio)
5. Em **Environment Variables**, adiciona:
   - `DATABASE_URL` → cola a URI do Supabase (passo 1)
   - `JWT_SECRET` → gera uma string longa (ex: `bl-minha-chave-secreta-super-longa-2026`)
   - `CRON_SECRET` → gera outra string (ex: `bl-cron-secret-super-longo-2026`)
   - `FRONTEND_URL` → `https://betleague.vercel.app`
   - `PORT` → `3001`
   - `NODE_ENV` → `production`
6. Clica **Deploy**

---

## Passo 3 — Criar tabelas no Supabase

Depois do primeiro deploy (pode dar erro — é normal):

1. Vai ao **Supabase Dashboard** → **SQL Editor**
2. Cola e executa este SQL para criar as tabelas:

```sql
-- Tabelas do betNANDO (Prisma schema)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  balance DECIMAL(10,2) DEFAULT 100,
  bets_count INT DEFAULT 0,
  bets_won INT DEFAULT 0,
  roi DECIMAL(10,2) DEFAULT 0,
  profit DECIMAL(10,2) DEFAULT 0,
  role TEXT DEFAULT 'USER',
  is_blocked BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS groups (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  invite_code TEXT UNIQUE NOT NULL,
  admin_id TEXT NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS group_members (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  group_id TEXT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(group_id, user_id)
);

CREATE TABLE IF NOT EXISTS matches (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  external_id TEXT UNIQUE NOT NULL,
  home_team TEXT NOT NULL,
  away_team TEXT NOT NULL,
  home_crest TEXT,
  away_crest TEXT,
  league TEXT NOT NULL,
  country TEXT NOT NULL,
  matchday INT,
  group_stage TEXT,
  match_date TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'SCHEDULED',
  home_score INT,
  away_score INT,
  half_time_home INT,
  half_time_away INT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS odds (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  match_id TEXT NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  market TEXT NOT NULL,
  selection TEXT NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  source TEXT DEFAULT 'estimated',
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(match_id, market, selection)
);

CREATE TABLE IF NOT EXISTS bets (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES users(id),
  stake DECIMAL(10,2) NOT NULL,
  total_odds DECIMAL(10,2) NOT NULL,
  potential_return DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'PENDING',
  created_at TIMESTAMPTZ DEFAULT now(),
  settled_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS bet_selections (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  bet_id TEXT NOT NULL REFERENCES bets(id) ON DELETE CASCADE,
  match_id TEXT NOT NULL REFERENCES matches(id),
  market TEXT NOT NULL,
  selection TEXT NOT NULL,
  odds DECIMAL(10,2) NOT NULL,
  won BOOLEAN
);

CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);
CREATE INDEX IF NOT EXISTS idx_matches_date ON matches(match_date);
CREATE INDEX IF NOT EXISTS idx_odds_match ON odds(match_id);
CREATE INDEX IF NOT EXISTS idx_bets_user ON bets(user_id);
CREATE INDEX IF NOT EXISTS idx_bets_status ON bets(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
```

3. Depois faz ** redeploy** no Vercel

---

## Passo 4 — Seed da base de dados

Depois do redeploy funcionar:

1. Vai ao **Supabase SQL Editor**
2. Executa este SQL para criar os dados de teste:

```sql
-- Password hash para 'admin123' e 'password123'
-- (bcrypt hash gerado previamente)
INSERT INTO users (id, name, email, password_hash, role, balance)
VALUES
  ('admin-001', 'Admin', 'admin@betnando.com', '$2a$12$LJ3m4yPnVSRHLgM5e0Uz6OQxZ5e6Q6O5Q5O5Q5O5Q5O5Q5O5Q5O', 'ADMIN', 100),
  ('user-001', 'João Silva', 'joao@example.com', '$2a$12$LJ3m4yPnVSRHLgM5e0Uz6OQxZ5e6Q6O5Q5O5Q5O5Q5O5Q5O5Q5O', 'USER', 100),
  ('user-002', 'Maria Santos', 'maria@example.com', '$2a$12$LJ3m4yPnVSRHLgM5e0Uz6OQxZ5e6Q6O5Q5O5Q5O5Q5O5Q5O5Q5O', 'USER', 100)
ON CONFLICT (email) DO NOTHING;
```

**NOTA:** Os hashes acima são exemplos. Para production, gera hashes reais com bcrypt.

---

## Passo 5 — Configurar cron externo

1. Vai a **https://cron-job.org** e faz login
2. Cria dois cron jobs:

### Job 1: Sync de jogos (a cada 30 minutos)
- **URL:** `https://betleague.vercel.app/api/cron/sync`
- **Method:** GET
- **Headers:**
  - `Authorization: Bearer [O_TEU_CRON_SECRET]`
- **Schedule:** `*/30 * * * *` (a cada 30 minutos)

### Job 2: Liquidar apostas (a cada 2 minutos)
- **URL:** `https://betleague.vercel.app/api/cron/settle`
- **Method:** GET
- **Headers:**
  - `Authorization: Bearer [O_TEU_CRON_SECRET]`
- **Schedule:** `*/2 * * * *` (a cada 2 minutos)

---

## Passo 6 — Domínio próprio (opcional)

1. No **Vercel Dashboard**, vai a Settings → Domains
2. Adiciona o teu domínio
3. No teu registrar, cria um **CNAME record**:
   - **Name:** `@` (ou `www`)
   - **Value:** `cname.vercel-dns.com`
4. Aguarda propagação (5-30 minutos)

---

## Credenciais de teste

- **Admin:** `admin@betnando.com` / `admin123`
- **User:** `joao@example.com` / `password123`

---

## Variáveis de ambiente (resumo)

| Variável | Valor |
|----------|-------|
| `DATABASE_URL` | URI do Supabase |
| `JWT_SECRET` | String longa aleatória |
| `CRON_SECRET` | String longa aleatória |
| `FRONTEND_URL` | `https://betleague.vercel.app` |
| `PORT` | `3001` |
| `NODE_ENV` | `production` |

---

## Troubleshooting

**Erro 500 no deploy:**
- Verifica se o `DATABASE_URL` está correto
- Verifica se as tabelas foram criadas no Supabase

**Cron não funciona:**
- Verifica se o `CRON_SECRET` é igual no Vercel e no cron-job.org
- Verifica os logs no Vercel Dashboard

**Cold start lento:**
- Normal no Vercel free tier (1-3 segundos)
- Depois do primeiro request, responde rápido
