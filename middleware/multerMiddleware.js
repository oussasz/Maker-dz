
import multer from "multer";
import path from "path";

const filename = function (req, file) {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  return file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
};

export const upload = multer({
  storage: multer.memoryStorage(), 

  fileFilter: (req, file, callback) => {
    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.mimetype)) {
      return callback(new Error("Only JPG and PNG files are allowed."));
    }
    callback(null, true); 
  },

  filename: filename,
});