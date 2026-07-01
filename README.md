# BetLeague

Fantasy football betting platform for friend groups using virtual credits.

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: JWT + bcrypt

## Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL (or Docker)

### Option 1: Docker (Recommended)

```bash
docker-compose up -d
```

### Option 2: Manual Setup

1. Install dependencies:
```bash
npm install
```

2. Set up database:
```bash
cd apps/api
cp .env.example .env
npx prisma db push
npx tsx prisma/seed.ts
```

3. Start development:
```bash
npm run dev
```

### Access

- Frontend: http://localhost:5173
- API: http://localhost:3001

### Test Credentials

- **Admin**: admin@betleague.com / admin123
- **User**: joao@example.com / password123
- **Group Invite Code**: TESTCODE

## Features

- User registration with 100 virtual credits
- Groups with invite codes
- Football matches from Football-Data.org API
- Multiple betting markets (1X2, Over/Under, BTTS)
- Combined odds bet slips
- Automatic bet settlement every 5 minutes
- Global and group rankings
- Statistics and history
- Notifications
- Admin panel
- Dark/Light theme
- Mobile-first responsive design

## Project Structure

```
nandobets/
├── apps/
│   ├── api/          # Express backend
│   └── web/          # React frontend
├── prisma/           # Database schema
├── docker-compose.yml
└── package.json
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login

### Users
- `GET /api/users/me` - Get profile
- `PATCH /api/users/me` - Update profile

### Groups
- `POST /api/groups` - Create group
- `POST /api/groups/join` - Join by code
- `GET /api/groups` - List groups
- `GET /api/groups/:id` - Group detail

### Matches
- `GET /api/matches` - Upcoming matches
- `GET /api/matches/live` - Live matches
- `GET /api/matches/:id` - Match detail

### Bets
- `POST /api/bets` - Place bet
- `GET /api/bets` - List bets
- `GET /api/bets/active` - Active bets
- `POST /api/bets/:id/cancel` - Cancel bet

### Rankings
- `GET /api/rankings/global` - Global ranking
- `GET /api/rankings/group/:id` - Group ranking

### Notifications
- `GET /api/notifications` - List notifications
- `PATCH /api/notifications/:id/read` - Mark read
- `POST /api/notifications/read-all` - Mark all read

### Admin
- `GET /api/admin/stats` - Dashboard stats
- `GET /api/admin/users` - List users
- `PATCH /api/admin/users/:id` - Update user
- `GET /api/admin/groups` - List groups

## Environment Variables

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/betleague
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
PORT=3001
FOOTBALL_DATA_API_KEY=your-api-key
FRONTEND_URL=http://localhost:5173
```

## License

MIT
