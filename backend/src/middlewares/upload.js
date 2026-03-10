import multer from "multer";

// console.log("multer in check");
const storage = multer.memoryStorage();
// console.log(storage);

export const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, //50 mb
});
