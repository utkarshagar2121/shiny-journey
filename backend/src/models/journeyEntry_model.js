import mongoose from "mongoose";

const journalEntry = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    blocks: [
      {
        type: {
          type: String,
          enum: ["text", "image", "video"],
          required: true,
        },
        value: {
          type: String, // text content for text blocks
        },
        url: {
          type: String, // cloudinary url for image/video blocks
        },
        publicId: {
          type: String, // cloudinary public_id for deletion
        },
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("JournalEntry", journalEntry);
