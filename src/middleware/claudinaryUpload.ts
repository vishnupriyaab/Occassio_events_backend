import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { configureCloudinary } from '../config/claudinary';

const cloudinary = configureCloudinary();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'events',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    type: "authenticated",  // This makes images private
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  } as any
});

export const upload = multer({ storage: storage });