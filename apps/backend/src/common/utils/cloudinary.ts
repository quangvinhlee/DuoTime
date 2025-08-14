import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (file: {
  buffer: Buffer;
  mimetype: string;
}): Promise<string> => {
  try {
    const base64Image = file.buffer.toString('base64');
    const dataURI = `data:${file.mimetype};base64,${base64Image}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'duotime-avatars',
      transformation: [
        { width: 400, height: 400, crop: 'fill', gravity: 'face' },
        { quality: 'auto', fetch_format: 'auto' },
      ],
    });
    return result.secure_url;
  } catch {
    throw new Error('Failed to upload image to Cloudinary');
  }
};

export const deleteImage = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch {
    throw new Error('Failed to delete image from Cloudinary');
  }
};

export const getPublicIdFromUrl = (url: string): string | null => {
  try {
    const urlParts = url.split('/');
    const uploadIndex = urlParts.findIndex((part) => part === 'upload');

    if (uploadIndex === -1) {
      return null;
    }

    const pathParts = urlParts.slice(uploadIndex + 2, -1);
    const filename = urlParts[urlParts.length - 1];
    const filenameWithoutExt = filename.split('.')[0];

    const publicId = [...pathParts, filenameWithoutExt].join('/');

    return publicId;
  } catch {
    return null;
  }
};

export default cloudinary;
