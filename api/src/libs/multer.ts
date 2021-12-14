import multer from 'multer';

const maxSize = 1024 * 1024 * 10;

const storage = multer.diskStorage({
  destination: 'uploads',
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});

export default multer({ storage, limits: { fileSize: maxSize } });