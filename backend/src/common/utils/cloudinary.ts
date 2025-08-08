import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Direct upload function for programmatic uploads
export const uploadImage = async (file: {
  buffer: Buffer;
  mimetype: string;
}): Promise<string> => {
  try {
    // Convert buffer to base64 for Cloudinary upload
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
  } catch (error) {
    throw new Error('Failed to upload image to Cloudinary');
  }
};

// Delete image from Cloudinary
export const deleteImage = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw new Error('Failed to delete image from Cloudinary');
  }
};

// Get public ID from URL
export const getPublicIdFromUrl = (url: string): string | null => {
  try {
    // Example URL: https://res.cloudinary.com/ddgkcui8g/image/upload/v1754031357/duotime-avatars/go0pusvddzakegmsc2ee.jpg
    // We need to extract: duotime-avatars/go0pusvddzakegmsc2ee

    const urlParts = url.split('/');
    const uploadIndex = urlParts.findIndex((part) => part === 'upload');

    if (uploadIndex === -1) {
      return null;
    }

    // Get everything after 'upload' and before the last part (which is the filename with extension)
    const pathParts = urlParts.slice(uploadIndex + 2, -1); // Skip 'upload' and version
    const filename = urlParts[urlParts.length - 1];
    const filenameWithoutExt = filename.split('.')[0];

    // Reconstruct the public ID
    const publicId = [...pathParts, filenameWithoutExt].join('/');

    return publicId;
  } catch (error) {
    return null;
  }
};

export default cloudinary;
