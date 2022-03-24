import multer from 'multer'
import path from 'path'
// Multer config
export const upload = multer({ 
  fileFilter: function (req, file, cb) {
       let ext = path.extname(file.originalname);
       if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
             cb(null, false);
             return
      }
      cb(null, true);
  }
});

