import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/assets");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

export const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
        const mimetype = file.mimetype;
        if (mimetype.startsWith('image/') ||
            mimetype === 'application/pdf' ||
            mimetype === 'application/msword' ||
            mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            return cb(null, true);
        }
        cb("Error: File upload only supports images, pdfs and docs!");
    },
    limits: { fileSize: 15 * 1024 * 1024 } // 15MB
});
