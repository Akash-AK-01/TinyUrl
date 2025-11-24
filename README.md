# TinyLink - URL Shortener

A full-stack URL shortener application similar to bit.ly, built with Node.js, Express, React, and PostgreSQL.

## Project Structure

```
tinylink/
├── backend/          # Express.js API server
├── frontend/         # React + Vite frontend
└── README.md
```

## Features

- ✅ Create short links with optional custom codes
- ✅ URL validation
- ✅ Redirect with click tracking
- ✅ View click statistics
- ✅ Delete links
- ✅ Search/filter links
- ✅ Responsive UI
- ✅ Health check endpoint

## Tech Stack

### Backend
- Node.js + Express
- PostgreSQL (via Neon)
- RESTful API

### Frontend
- React 18
- Vite
- React Router
- Tailwind CSS
- Axios

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database (or Neon account)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your database connection:
```
DATABASE_URL=postgresql://user:password@localhost:5432/tinylink
PORT=3001
BASE_URL=http://localhost:3001
```

5. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env`:
```
VITE_API_URL=http://localhost:3001
VITE_BASE_URL=http://localhost:3000
```

5. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Health Check
- `GET /healthz` - Returns server status

### Links API
- `POST /api/links` - Create a new short link
  - Body: `{ "target_url": "https://example.com", "code": "optional" }`
- `GET /api/links` - Get all links
- `GET /api/links/:code` - Get stats for a specific link
- `DELETE /api/links/:code` - Delete a link

### Redirect
- `GET /:code` - Redirect to original URL (302)

## Routes

- `/` - Dashboard (list, add, delete links)
- `/code/:code` - Stats page for a specific link
- `/:code` - Redirect endpoint (handled by backend)

## Deployment

### Backend
Deploy to Render, Railway, or similar service with PostgreSQL support.

### Frontend
Deploy to Vercel, Netlify, or similar service.

Make sure to set environment variables in your hosting platform.

## Database Schema

```sql
CREATE TABLE links (
  id SERIAL PRIMARY KEY,
  code VARCHAR(8) UNIQUE NOT NULL,
  target_url TEXT NOT NULL,
  total_clicks INTEGER DEFAULT 0,
  last_clicked TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Testing

The application follows the specified URL conventions for automated testing:
- `/healthz` returns 200
- Creating links works with duplicate code validation (409)
- Redirects work and increment click count
- Deletion stops redirect (404)

## License

ISC


