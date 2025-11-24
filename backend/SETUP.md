# Quick Setup Guide

## 1. Install Dependencies

```bash
cd backend
npm install
```

## 2. Set Up Database Connection

### Get a PostgreSQL Database

**Option A: Neon (Free Tier)**
1. Go to https://neon.tech
2. Sign up and create a project
3. Copy the connection string

**Option B: Supabase (Free Tier)**
1. Go to https://supabase.com
2. Create a project
3. Go to Settings > Database
4. Copy the connection string

**Option C: Railway (Free Tier)**
1. Go to https://railway.app
2. Create a project
3. Add PostgreSQL service
4. Copy the connection string

### Configure Environment

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env` and add your database URL:

```env
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
PORT=3001
BASE_URL=http://localhost:3001
```

## 3. Initialize Database

```bash
# Generate Prisma Client
npm run prisma:generate

# Create and run migrations
npm run prisma:migrate
```

When prompted, name your migration: `init`

## 4. Start Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

## 5. Verify Setup

Test the health endpoint:

```bash
curl http://localhost:3001/healthz
```

Should return:
```json
{"ok":true,"version":"1.0","uptime":...,"timestamp":"..."}
```

## Troubleshooting

### "Prisma Client not generated"
```bash
npm run prisma:generate
```

### "Migration failed"
- Check your `DATABASE_URL` is correct
- Ensure database is accessible
- For cloud databases, add `?sslmode=require` to connection string

### "Port already in use"
- Change `PORT` in `.env` file
- Or kill the process: `lsof -ti:3001 | xargs kill` (Mac/Linux)

