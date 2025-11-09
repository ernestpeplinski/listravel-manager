// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
}

/**
 * Upload image to Cloudinary
 * @param file - Image file to upload
 * @param folder - Optional folder name in Cloudinary
 * @returns Cloudinary response with image URL
 */
export const uploadToCloudinary = async (
  file: File,
  folder: string = "listravel/trips"
): Promise<CloudinaryUploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  formData.append("folder", folder);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
};

/**
 * Generate thumbnail URL from Cloudinary image URL
 * @param imageUrl - Original image URL from Cloudinary
 * @param width - Thumbnail width (default 400px)
 * @returns Thumbnail URL
 */
export const getThumbnailUrl = (
  imageUrl: string,
  width: number = 400
): string => {
  // Cloudinary transformation to resize image
  return imageUrl.replace("/upload/", `/upload/w_${width},c_scale,q_auto/`);
};

/**
 * Delete image from Cloudinary by public_id
 * Note: This requires server-side implementation for security
 */
export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  // This should be done server-side or with Firebase Cloud Functions
  // for security reasons (requires API secret)
  console.warn(
    "Delete operation should be implemented server-side for:",
    publicId
  );
};
