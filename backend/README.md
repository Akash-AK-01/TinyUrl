# TinyLink Backend API

Express.js backend API for the TinyLink URL shortener service using PostgreSQL with Prisma ORM.

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database (Neon, Supabase, Railway, or local)

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Database

#### Option A: Using Neon (Recommended for Free Tier)

1. Sign up at [Neon](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Add it to your `.env` file

#### Option B: Using Supabase

1. Sign up at [Supabase](https://supabase.com)
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string
5. Add it to your `.env` file

#### Option C: Using Railway

1. Sign up at [Railway](https://railway.app)
2. Create a new PostgreSQL database
3. Copy the connection string
4. Add it to your `.env` file

#### Option D: Local PostgreSQL

1. Install PostgreSQL locally
2. Create a database: `CREATE DATABASE tinylink;`
3. Use connection string: `postgresql://user:password@localhost:5432/tinylink`

### 3. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

Update the `.env` file with your database connection string:

```env
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
PORT=3001
BASE_URL=http://localhost:3001
```

### 4. Run Database Migrations

Generate Prisma Client and run migrations:

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations (creates tables)
npm run prisma:migrate
```

For production deployment:

```bash
npm run prisma:migrate:deploy
```

### 5. Start the Server

Development mode (with auto-reload):

```bash
npm run dev
```

Production mode:

```bash
npm start
```

## Database Schema

The `Link` model has the following structure:

- `id` (UUID, primary key)
- `code` (VARCHAR(8), unique) - Short code (6-8 alphanumeric)
- `url` (TEXT) - Target URL
- `total_clicks` (INTEGER, default 0)
- `last_clicked` (TIMESTAMP, nullable)
- `created_at` (TIMESTAMP, default now())

## API Endpoints

### Health Check
- `GET /healthz` - Returns server status

### Links API
- `POST /api/links` - Create a new short link
- `GET /api/links` - Get all links
- `GET /api/links/:code` - Get stats for a specific link
- `DELETE /api/links/:code` - Delete a link

### Redirect
- `GET /:code` - Redirect to original URL (302)

## Prisma Commands

- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Create and apply migrations (development)
- `npm run prisma:migrate:deploy` - Apply migrations (production)
- `npm run prisma:studio` - Open Prisma Studio (database GUI)

## Deployment

### Deploying to Render

1. Connect your GitHub repository
2. Set environment variables:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `PORT` - Port number (Render sets this automatically)
   - `BASE_URL` - Your deployed backend URL
3. Build command: `npm install && npm run prisma:generate && npm run prisma:migrate:deploy`
4. Start command: `npm start`

### Deploying to Railway

1. Connect your GitHub repository
2. Add PostgreSQL service
3. Set environment variables:
   - `DATABASE_URL` - Automatically set by Railway
   - `BASE_URL` - Your deployed backend URL
4. Railway will automatically run `npm install` and `npm start`

## Testing

Test the API endpoints:

```bash
# Health check
curl http://localhost:3001/healthz

# Create a link
curl -X POST http://localhost:3001/api/links \
  -H "Content-Type: application/json" \
  -d '{"target_url": "https://example.com", "code": "test01"}'

# Get all links
curl http://localhost:3001/api/links

# Get link stats
curl http://localhost:3001/api/links/test01

# Test redirect
curl -I http://localhost:3001/test01

# Delete link
curl -X DELETE http://localhost:3001/api/links/test01
```

## Troubleshooting

### Database Connection Issues

- Verify your `DATABASE_URL` is correct
- Check if your database allows connections from your IP
- For Neon/Supabase, ensure SSL mode is enabled: `?sslmode=require`

### Migration Issues

- Make sure Prisma Client is generated: `npm run prisma:generate`
- Check if migrations are applied: `npm run prisma:migrate:deploy`
- View database schema: `npm run prisma:studio`

### Port Already in Use

- Change `PORT` in `.env` file
- Or kill the process using the port
