import JourneyEntry from "../models/journeyEntry_model.js";
import cloudinary from "../config/cloudinary.js";
// export const createEntry = async (req, res) => {
//   try {
//     const { title, content, media } = req.body;
//     const entry = await JourneyEntry.create({
//       userId: req.user.id,
//       title,
//       content,
//       media: media || "",
//     });
//     res.status(201).json({
//       message: "Entry successful",
//       entry,
//     });
//   } catch (error) {
//     console.log("server error while journal creation = ", error.message);
//     res.status(500).json({ message: "Server error while creation of entry" });
//   }
// };

export const createEntry = async (req, res) => {
  try {
    const { title, content } = req.body;

    let media = [];

    //if files
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: "auto" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            },
          );
          stream.end(file.buffer);
        });

        media.push({
          type: uploadResult.resource_type,
          url: uploadResult.secure_url,
        });
      }
    }
    const entry = await JourneyEntry.create({
      userId: req.user.id,
      title,
      content,
      media,
    });
    res.status(200).json({
      message: "entry successfull",
      entry,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Server error in the create journal",
    });
  }
};

export const getMyEntries = async (req, res) => {
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
      message: "Successful in fetching the entries",
      total,
      page,
      pages: Math.ceil(total / limit),
      entries,
    });
  } catch (error) {
    console.log("server error while fetching the entries = ", error.message);
    res.status(500).json({
      message: "Error while fetching the entries",
    });
  }
};

export const updateEntry = async (req, res) => {
  try {
    const entry = await JourneyEntry.findById(req.params.id);

    if (!entry) {
      return res.status(401).json({
        message: "No entry found",
      });
    }
    if (entry.userId.toString() != req.user.id) {
      return res.status(401).json({
        message: "Invalid authoriazation",
      });
    }
    entry.title = req.body.title || entry.title;
    entry.content = req.body.content || entry.content;

    await entry.save();
    res.status(200).json({
      message: "edit successfully",
      entry,
    });
  } catch (error) {
    console.log("server error in editing the entry", error.message);
    res.status(500).json({
      message: "server error in editing the entry",
    });
  }
};

//getting public id of the cloudinary to delete
const publicId = (url) => {
  const part = url.split("/");
  const uploadIndex = part.indexOf("upload");
  const pathparts = part.slice(uploadIndex + 2);
  const filename = pathparts.join("/");
  return filename.replace(/\.[^/.]+$/, "");
};

export const deleteEntry = async (req, res) => {
  try {
    const entryid = req.params.id;
    const entry = await JourneyEntry.findById(entryid);
    if (!entry) {
      return res.status(401).json({ message: "no entry found" });
    }
    if (entry.userId.toString() != req.user.id) {
      return res.status(401).json({
        message: "Invalid authoriazation",
      });
    }

    //deleting media before deleting the entry
    if (entry.media && entry.media.length > 0) {
      for (const mediaitem of entry.media) {
        const cloudinaryID = publicId(mediaitem.url);
        await cloudinary.uploader.destroy(cloudinaryID, {
          resource_type: mediaitem.type,
        });
      }
    }
    await entry.deleteOne();
    res.status(200).json({ message: "deleled successfully" });
  } catch (error) {
    console.log("server error in deleting ", error.message);
    res.status(500).json({ message: "deleting server error" });
  }
};

export const deleteMedia = async (req, res) => {
  try {
    const { entryId, mediaId } = req.params;

    const entry = await JourneyEntry.findById(entryId);

    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }
    if (entry.userId.toString() != req.user.id) {
      return res.status(403).json({ message: "Invalid authorization" });
    }

    // find the specific media item inside the entry
    const mediaItem = entry.media.id(mediaId);
    if (!mediaItem) {
      return res.status(404).json({ message: "Media item not found" });
    }

    // delete from Cloudinary
    const cloudinaryId = publicId(mediaItem.url);
    await cloudinary.uploader.destroy(cloudinaryId, {
      resource_type: mediaItem.type,
    });

    // remove from the media array and save
    entry.media.pull(mediaId);
    await entry.save();

    res.status(200).json({
      message: "Media deleted successfully",
      entry,
    });
  } catch (error) {
    console.log("error deleting media item: ", error.message);
    res.status(500).json({ message: "Server error while deleting media" });
  }
};

export const uploadmedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(401).json({
        message: "No files found",
      });
    }
    // console.log(req.file)
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "auto" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );
      stream.end(req.file.buffer);
    });
    // console.log(uploadResult);
    res.status(200).json({
      message: "upload successful",
      type: uploadResult.resource_type,
      url: uploadResult.secure_url,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Upload failed from server",
    });
  }
};
