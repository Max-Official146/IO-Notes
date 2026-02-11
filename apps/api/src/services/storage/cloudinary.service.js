import { v2 as cloudinary } from "cloudinary";
import { env } from "../../config/env.js";

cloudinary.config({
  cloud_name: env.cloudinaryCloudName,
  api_key: env.cloudinaryApiKey,
  api_secret: env.cloudinaryApiSecret,
});

export async function uploadToCloudinary(filePath, resourceType = "auto") {
  if (!env.cloudinaryCloudName || !env.cloudinaryApiKey || !env.cloudinaryApiSecret) {
    return { url: "", message: "Cloudinary not configured" };
  }

  const result = await cloudinary.uploader.upload(filePath, { resource_type: resourceType });
  return { url: result.secure_url };
}
