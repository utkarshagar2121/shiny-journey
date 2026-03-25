# Frontend — Memoria

React + Vite frontend for the Memoria journaling app. A warm, editorial UI for writing journal entries with inline text, photos, and videos.

---

## Tech Stack

- **Framework** — React 18
- **Build tool** — Vite
- **Routing** — React Router v6
- **Styling** — Tailwind CSS v4 + inline styles
- **HTTP** — Axios with auth interceptors
- **Media** — Browser MediaDevices API (camera), MediaRecorder API (video)

---

## Project Structure

```
frontend/
└── src/
    ├── api/
    │   ├── axios.js           # Base axios instance (public routes)
    │   └── useApi.js          # Authenticated axios hook with interceptors
    ├── context/
    │   └── AuthContext.jsx    # Auth state, token management, session restore
    ├── components/
    │   ├── Header.jsx         # App header with logo and logout
    │   └── Footer.jsx         # Minimal footer with rotating quotes
    ├── pages/
    │   ├── HomePage.jsx       # Landing page
    │   ├── authPage.jsx       # Flip card login/signup
    │   ├── DashboardPage.jsx  # Masonry grid of journal entries
    │   ├── EntryDetailPage.jsx # Full entry view with inline blocks
    │   ├── CreateEntryPage.jsx # Block editor for new entries
    │   └── EditEntryPage.jsx  # Block editor for existing entries
    ├── App.jsx                # Routes + protected/public route guards
    └── main.jsx               # Entry point
```

---

## Setup

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Configure API URL

In `src/api/axios.js` and `src/api/useApi.js`, update the `baseURL` to match your backend:

```js
baseURL: "http://localhost:5000/api"  // development
// baseURL: "https://your-backend.railway.app/api"  // production
```

### 3. Run the dev server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Pages

### `/` — HomePage
Static landing page with app introduction and a link to sign in.

### `/auth` — AuthPage
Flip card animation with login on the front and signup on the back. Rotating quotes at the bottom. Redirects to `/dashboard` on success.

### `/dashboard` — DashboardPage
Masonry grid of journal entries with:
- Live debounced search (400ms delay)
- Pagination (9 entries per page)
- Skeleton loading state
- Empty state with call to action

### `/entry/:id` — EntryDetailPage
Renders all blocks in order. Images start as thumbnails and expand on click. Videos show as a compact pill that expands a player below. Edit and delete buttons at the bottom.

### `/create` — CreateEntryPage
Block-based editor:
- `+ Text` adds a new auto-growing textarea
- `📷 Media` opens the camera modal
- Between-block `+ Text` / `+ Media` buttons appear on hover
- Fixed bottom toolbar with Save button

### `/entry/:id/edit` — EditEntryPage
Same editor as Create but pre-populated with existing entry data. Existing media blocks show their Cloudinary thumbnails. New media blocks can be added alongside existing ones.

---

## Auth Flow

1. On app load, `AuthContext` checks localStorage for a refresh token
2. If found, calls `/api/auth/refresh` to restore the session silently
3. Access token is kept in React state and a `tokenRef` for synchronous access
4. `useApi` hook attaches the token to every request via axios interceptor
5. On 401, the interceptor automatically refreshes the token and retries (except for multipart requests)
6. On logout, refresh token is deleted from both the backend and localStorage

---

## Camera Modal

The camera modal uses the browser's `MediaDevices API`:
- Requests camera + microphone permission on open
- **Photo mode** — captures a canvas snapshot as JPEG
- **Video mode** — records using `MediaRecorder`, saves as WebM
- **Flip camera** — switches between front/rear if multiple cameras are detected
- **Error state** — falls back to file upload if camera is unavailable or permission is denied
- File upload accepts both `image/*` and `video/*` — type is auto-detected from `file.type`

---

## Design System

| Token | Value |
|---|---|
| Background | `#faf7f2` |
| Card background | `#fffdf9` |
| Primary brown | `#5c4a32` |
| Accent tan | `#c4a882` |
| Muted text | `#a08c72` |
| Border | `#ede8df` |
| Danger | `#b04040` |
| Heading font | Georgia, serif |
| Body font | System sans-serif |

---

## Building for Production

```bash
npm run build
```

Output goes to `dist/`. Deploy this folder to Vercel, Netlify, or any static host. Make sure to update the `baseURL` in the axios config to point to your production backend before building.