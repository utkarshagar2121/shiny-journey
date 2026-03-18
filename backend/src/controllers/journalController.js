import JourneyEntry from "../models/journeyEntry_model.js";
import cloudinary from "../config/cloudinary.js";
import sharp from "sharp";

// compress images before uploading
const compressImage = async (buffer) => {
  return await sharp(buffer)
    .resize({ width: 1280, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();
};

// upload a single buffer to cloudinary
const uploadToCloudinary = (buffer, resourceType = "auto") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: resourceType },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );
    stream.end(buffer);
  });
};

// ================= CREATE ENTRY =================
export const createEntry = async (req, res) => {
  try {
    const { title, blocks } = req.body;

    let parsedBlocks = [];
    if (blocks) {
      parsedBlocks = JSON.parse(blocks);
    }

    const finalBlocks = [];

    for (const block of parsedBlocks) {
      if (block.type === "text") {
        finalBlocks.push({ type: "text", value: block.value });
      } else if (block.type === "image" || block.type === "video") {
        const file = req.files?.[block.fileIndex];
        if (file) {
          let buffer = file.buffer;
          if (block.type === "image") {
            buffer = await compressImage(buffer);
          }
          const result = await uploadToCloudinary(buffer);
          finalBlocks.push({
            type: block.type,
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      }
    }

    const entry = await JourneyEntry.create({
      userId: req.user.id,
      title,
      blocks: finalBlocks,
    });

    res.status(201).json({ message: "Entry created successfully", entry });
  } catch (error) {
    console.log("error creating entry:", error.message);
    res.status(500).json({ message: "Server error while creating entry" });
  }
};

// ================= GET ALL ENTRIES =================
export const getMyEntries = async (req, res) => {
  // console.log("here");
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const search = req.query.search || "";

    const query = {
      userId: req.user.id,
      title: { $regex: search, $options: "i" },
    };

    const total = await JourneyEntry.countDocuments(query);
    const entries = await JourneyEntry.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      message: "Entries fetched successfully",
      total,
      page,
      pages: Math.ceil(total / limit),
      entries,
    });
  } catch (error) {
    console.log("error fetching entries:", error.message);
    res.status(500).json({ message: "Error while fetching entries" });
  }
};

// ================= GET SINGLE ENTRY =================
export const getEntryById = async (req, res) => {
  try {
    const entry = await JourneyEntry.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }
    if (entry.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json({ entry });
  } catch (error) {
    console.log("error fetching entry:", error.message);
    res.status(500).json({ message: "Server error while fetching entry" });
  }
};

// ================= UPDATE ENTRY =================
export const updateEntry = async (req, res) => {
  try {
    const entry = await JourneyEntry.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: "Entry not found" });
    if (entry.userId.toString() !== req.user.id)
      return res.status(403).json({ message: "Invalid authorization" });

    entry.title = req.body.title || entry.title;

    if (req.body.blocks) {
      const parsedBlocks = JSON.parse(req.body.blocks);
      const finalBlocks = [];

      for (const block of parsedBlocks) {
        if (block.type === "text") {
          finalBlocks.push({ type: "text", value: block.value });
        } else if (block.fileIndex !== undefined) {
          // new media file uploaded
          const file = req.files?.[block.fileIndex];
          if (file) {
            let buffer = file.buffer;
            if (block.type === "image") buffer = await compressImage(buffer);
            const result = await uploadToCloudinary(buffer);
            finalBlocks.push({
              type: block.type,
              url: result.secure_url,
              publicId: result.public_id,
            });
          }
        } else {
          // existing media block — keep as is
          finalBlocks.push({
            type: block.type,
            url: block.url,
            publicId: block.publicId,
          });
        }
      }
      entry.blocks = finalBlocks;
    }

    await entry.save();
    res.status(200).json({ message: "Entry updated successfully", entry });
  } catch (error) {
    console.log("error updating entry:", error.message);
    res.status(500).json({ message: "Server error while updating entry" });
  }
};

// ================= DELETE ENTRY =================
export const deleteEntry = async (req, res) => {
  try {
    const entry = await JourneyEntry.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }
    if (entry.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Invalid authorization" });
    }

    // delete all media blocks from cloudinary
    for (const block of entry.blocks) {
      if (
        (block.type === "image" || block.type === "video") &&
        block.publicId
      ) {
        await cloudinary.uploader.destroy(block.publicId, {
          resource_type: block.type,
        });
      }
    }

    await entry.deleteOne();
    res.status(200).json({ message: "Entry deleted successfully" });
  } catch (error) {
    console.log("error deleting entry:", error.message);
    res.status(500).json({ message: "Server error while deleting entry" });
  }
};

// ================= DELETE SINGLE BLOCK =================
export const deleteBlock = async (req, res) => {
  try {
    const { entryId, blockId } = req.params;
    const entry = await JourneyEntry.findById(entryId);

    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }
    if (entry.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Invalid authorization" });
    }

    const block = entry.blocks.id(blockId);
    if (!block) {
      return res.status(404).json({ message: "Block not found" });
    }

    // delete from cloudinary if media block
    if ((block.type === "image" || block.type === "video") && block.publicId) {
      await cloudinary.uploader.destroy(block.publicId, {
        resource_type: block.type,
      });
    }

    entry.blocks.pull(blockId);
    await entry.save();

    res.status(200).json({ message: "Block deleted successfully", entry });
  } catch (error) {
    console.log("error deleting block:", error.message);
    res.status(500).json({ message: "Server error while deleting block" });
  }
};

// ================= UPLOAD MEDIA =================
export const uploadmedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file found" });
    }

    let buffer = req.file.buffer;

    if (req.file.mimetype.startsWith("image/")) {
      buffer = await compressImage(buffer);
    }

    const result = await uploadToCloudinary(buffer);

    res.status(200).json({
      message: "Upload successful",
      type: result.resource_type,
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.log("upload error:", error.message);
    res.status(500).json({ message: "Upload failed" });
  }
};
