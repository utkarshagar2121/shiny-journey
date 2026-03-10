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
    content: {
      type: String,
    },
    media: [
      {
        type: {
          type: String,
        },
        url: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("JournalEntry", journalEntry);
