# Backend — Memoria

Node.js + Express REST API for the Memoria journaling app. Handles authentication, journal entry CRUD, and media uploads to Cloudinary.

---

## Tech Stack

- **Runtime** — Node.js 18+
- **Framework** — Express 5
- **Database** — MongoDB with Mongoose
- **Auth** — JWT (jsonwebtoken), bcrypt
- **Media** — Cloudinary, Multer (memory storage), Sharp (image compression)
- **Other** — express-async-handler, express-rate-limit, dotenv, cors

---

## Project Structure

```
backend/
├── server.js                  # Entry point
└── src/
    ├── config/
    │   └── cloudinary.js      # Cloudinary configuration
    ├── controllers/
    │   ├── authController.js  # Signup, login, refresh, logout
    │   └── journalController.js # Journal CRUD + media upload
    ├── database/
    │   └── db.js              # MongoDB connection
    ├── middlewares/
    │   ├── authMiddleware.js  # JWT protect middleware
    │   ├── errorhandler.js    # Global error handler
    │   ├── rateLimiter.js     # Auth route rate limiting
    │   ├── upload.js          # Multer configuration
    │   └── validation.js      # Request validation
    ├── models/
    │   ├── User-Model.js      # User schema
    │   ├── journeyEntry_model.js # Journal entry + blocks schema
    │   └── refreshToken_model.js # Refresh token schema
    └── routes/
        ├── authRoutes.js      # Auth endpoints
        └── journalroutes.js   # Journal endpoints
```

---

## Setup

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Create `.env` file

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
CLOUDINARY_NAME=your_cloudinary_cloud_name
CLOUDINARY_API=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_api_secret
```

### 3. Run the server

```bash
# Development
npm run dev

# Production
npm start
```

---

## API Reference

### Auth Routes — `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/signup` | No | Create a new account |
| POST | `/login` | No | Login and receive tokens |
| POST | `/refresh` | No | Get a new access token |
| POST | `/logout` | No | Invalidate refresh token |

#### POST `/signup`
```json
{ "name": "Utkarsh", "email": "u@example.com", "password": "secret123" }
```

#### POST `/login`
```json
{ "email": "u@example.com", "password": "secret123" }
```
Returns `accessToken`, `refreshToken`, and `user` object.

#### POST `/refresh`
```json
{ "refreshToken": "your_refresh_token" }
```
Returns new `accessToken` and `user` object.

#### POST `/logout`
```json
{ "refreshToken": "your_refresh_token" }
```

---

### Journal Routes — `/api/journal` 🔒

All routes require `Authorization: Bearer <accessToken>` header.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/myentries` | Get all entries (paginated, searchable) |
| GET | `/:id` | Get a single entry |
| POST | `/create` | Create a new entry |
| PUT | `/update/:id` | Update an existing entry |
| DELETE | `/delete/:id` | Delete an entry and its media |
| DELETE | `/:entryId/block/:blockId` | Delete a single block |
| POST | `/upload` | Upload a standalone media file |

#### GET `/myentries`
Query params: `?page=1&limit=9&search=`

#### POST `/create` — multipart/form-data
```
title: "My Entry"
blocks: JSON string — [{ type: "text", value: "..." }, { type: "image", fileIndex: 0 }]
files: file array matching fileIndex values in blocks
```

#### PUT `/update/:id` — multipart/form-data
Same format as create. For existing media blocks, pass `{ type, url, publicId }` instead of `fileIndex`.

---

## Data Models

### Journal Entry
```js
{
  userId: ObjectId,
  title: String,
  blocks: [
    {
      type: "text" | "image" | "video",
      value: String,      // text content
      url: String,        // cloudinary url
      publicId: String,   // cloudinary public_id for deletion
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

### User
```js
{
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date
}
```

---

## Token Strategy

- **Access token** — 15 minute expiry, stored in memory on the frontend
- **Refresh token** — 7 day expiry, stored in MongoDB and in the client's localStorage
- On refresh token use, a new access token is issued
- On logout, the refresh token is deleted from MongoDB

---

## Image Compression

All uploaded images are processed with Sharp before being sent to Cloudinary:
- Resized to max 1280px width
- Converted to WebP format at 80% quality
- Videos are uploaded as-is