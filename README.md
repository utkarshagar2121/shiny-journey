# 📖 Memoria — Video Journaling App

Memoria is a personal journaling app that lets you write, capture photos, and record videos — all inline in a single entry. Built with a React frontend and a Node.js/Express backend.

---

## Project Structure

```
video-journaling-app/
├── frontend/       # React + Vite + Tailwind CSS
└── backend/        # Node.js + Express + MongoDB + Cloudinary
```

---

## Features

- **Block-based editor** — mix text, images, and videos freely in any order within a single entry
- **Camera modal** — capture photos or record videos directly from the browser, or upload from device
- **JWT authentication** — access tokens in memory, refresh tokens in localStorage, auto session restore
- **Cloudinary media storage** — images are compressed with sharp before upload
- **Search & pagination** — debounced search across entry titles on the dashboard
- **Protected routes** — logged-out users redirected to auth, logged-in users redirected away from auth

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS v4, React Router v6 |
| Backend | Node.js, Express 5, MongoDB, Mongoose |
| Auth | JWT (access + refresh tokens), bcrypt |
| Media | Cloudinary, Multer, Sharp |
| HTTP | Axios with request/response interceptors |

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB database (local or Atlas)
- Cloudinary account

### 1. Clone the repo

```bash
git clone https://github.com/your-username/video-journaling-app.git
cd video-journaling-app
```

### 2. Set up the backend

See [backend/README.md](./backend/README.md) for full setup instructions.

### 3. Set up the frontend

See [frontend/README.md](./frontend/README.md) for full setup instructions.

---

## Environment Variables

Both frontend and backend require their own `.env` files. See the respective README files for the required variables.

---

## Scripts

From the root you can run each part independently:

```bash
# Backend
cd backend && npm run dev

# Frontend
cd frontend && npm run dev
```

---

## Deployment

- **Backend** — deployable to Railway, Render, or any Node.js host
- **Frontend** — deployable to Vercel or Netlify

Make sure to update `VITE_API_URL` in the frontend and set all environment variables on your hosting platform before deploying.

---

## Security Notes

- Never commit your `.env` file
- Rotate your MongoDB password and Cloudinary API secret if they have ever been pushed to a public repo
- Use a strong, unique `JWT_SECRET` and `REFRESH_TOKEN_SECRET` in production