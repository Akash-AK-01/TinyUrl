# Quick Fix for PostgreSQL Connection Error

## The Problem
```
❌ PrismaClientInitializationError: Can't reach database server at `localhost:5432`
```

## Quick Solutions (Choose One)

### 🚀 Option 1: Use Docker (Fastest - 2 minutes)

**Requirements:** Docker Desktop installed

```bash
# 1. Start PostgreSQL with Docker
cd backend
docker-compose up -d

# 2. Copy environment template
copy .env.template .env

# 3. Initialize database
npm run prisma:generate
npm run prisma:migrate

# 4. Start server
npm run dev
```

**To stop PostgreSQL later:**
```bash
docker-compose down
```

---

### ☁️ Option 2: Use Neon Cloud Database (Free - 3 minutes)

**No installation required!**

1. **Sign up at [neon.tech](https://neon.tech)**

2. **Create a new project** and copy the connection string

3. **Create `.env` file in backend directory:**
   ```env
   DATABASE_URL="postgresql://user:pass@host.neon.tech/dbname?sslmode=require"
   PORT=3001
   BASE_URL=http://localhost:3001
   ```

4. **Initialize and start:**
   ```bash
   cd backend
   npm run prisma:generate
   npm run prisma:migrate
   npm run dev
   ```

---

### 💻 Option 3: Install PostgreSQL Locally (10 minutes)

1. **Download PostgreSQL:**
   - Go to [postgresql.org/download/windows](https://www.postgresql.org/download/windows/)
   - Download and run the installer
   - Remember the password you set!

2. **Create database:**
   - Open "SQL Shell (psql)" from Start menu
   - Press Enter for defaults, then enter your password
   - Run: `CREATE DATABASE tinylink;`
   - Type: `\q` to exit

3. **Configure `.env` file:**
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/tinylink"
   PORT=3001
   BASE_URL=http://localhost:3001
   ```

4. **Initialize and start:**
   ```bash
   cd backend
   npm run prisma:generate
   npm run prisma:migrate
   npm run dev
   ```

---

## Verify Your Setup

After choosing an option above, test your connection:

```bash
cd backend
npm run check-db
```

You should see:
```
✅ DATABASE_URL is set
✅ Successfully connected to database
✅ Database query successful
✅ Database connection is working correctly!
```

Then start the server:
```bash
npm run dev
```

You should see:
```
✅ Connected to PostgreSQL database
✅ Database connection verified
🚀 Server running on http://localhost:3001
```

---

## Still Having Issues?

See the detailed guide: [DATABASE-SETUP-GUIDE.md](./DATABASE-SETUP-GUIDE.md)

Or check if `.env` file exists:
```bash
cd backend
dir .env
```

If it doesn't exist, create it using the template:
```bash
copy .env.template .env
```

Then edit `.env` with your database connection string.
