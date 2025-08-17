// import path from 'path';
// import multer from 'multer';
// const upload=multer({
//     storage: multer.diskStorage({
//         des:"upload/",
//         limit:{
//             fileSize: 1024 * 1024 * 50, // 50MB
//         },
//         destination: (req, file, cb) => {
//             cb(null, file.originalname);
//         },
//     }),
//     fileFilter: (req, file, cb) => {
//         const ext = path.extname(file.originalname);
//         if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
//             return next(AppError('Only .jpg, .jpeg, and .png files are allowed'), false);
//         }
//         cb(null, true);
//     }
// })
// export default upload;

import path from 'path';
import multer from 'multer';
import AppError from '../Utils/error.util.js';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads'); // folder jisme save karna hai
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // unique name
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 50 // 50MB
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
            return cb(new AppError('Only .jpg, .jpeg, and .png files are allowed', 400), false);
        }
        cb(null, true);
    }
});

export default upload;
