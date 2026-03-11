import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { connectDb } from "./src/database/db.js";
dotenv.config();

connectDb();

import authRoutes from "./src/routes/authRoutes.js";
import journalroutes from "./src/routes/journalroutes.js";
import { errorHandler } from "./src/middlewares/errorhandler.js";
import { authLimiter, apiLimiter } from "./src/middlewares/rateLimitater.js";

const app = express();

//middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("journal app backend running");
});

//routes
app.use("/api/auth", authLimiter,authRoutes);
app.use("/api/journal",apiLimiter, journalroutes);

// error handler must be registered after all routes
app.use(errorHandler);

const port = process.env.port || 5000;

app.listen(port, () => {
  console.log(`Server running  on port ${port}`);
});
