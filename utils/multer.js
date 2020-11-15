const multer = require('multer');
const path = require('path');


//Multer config
module.exports = multer({
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb) => {
        let ext = path.extname(file.originalname);
        if (ext !== ".jpg" && ext !== ".JPG" && ext !== ".png" && ext !== ".PNG" && ext !== ".jpeg" && ext !== ".JPEG" && ext !== ".gif" && ext !== ".GIF") {
            cb(new Error('File is not supported'), false);
        }
        cb(null, true)
    },

});
