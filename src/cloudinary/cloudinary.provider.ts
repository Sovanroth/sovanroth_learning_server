import { v2 as cloudinary } from 'cloudinary';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  useFactory: () => {
    return cloudinary.config({
      cloud_name: 'drm2qtfij',
      api_key: '922592464989149',
      api_secret: 'AJGFt1W8sh9YyJTDo6KS4IIkbQU',
    });
  },
};
