import express from "express";
import {
  createEntry,
  getMyEntries,
  updateEntry,
  deleteEntry,
  deleteMedia,
  uploadmedia,
  getEntry,
} from "../controllers/JournalController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { validateEntry } from "../middlewares/validation.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

router.post(
  "/create",
  protect,
  upload.array("files", 10),
  validateEntry,
  createEntry,
);
router.get("/myentries", protect, getMyEntries);
router.get("/:id", protect, getEntry);
router.post("/update/:id", protect, validateEntry, updateEntry);
router.delete("/delete/:id", protect, deleteEntry);
router.delete("/:entryId/media/:mediaId", protect, deleteMedia);
router.post("/upload", protect, upload.single("file"), uploadmedia);

export default router;
