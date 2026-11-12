import fs from 'fs'
import path from 'path'
import { v2 as cloudinary } from 'cloudinary'
import { ApiError } from './ApiError.js'

const getCloudinaryCredentials = () => ({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim() || '',
  api_key: process.env.CLOUDINARY_API_KEY?.trim() || '',
  api_secret: process.env.CLOUDINARY_API_SECRET?.trim() || '',
})

export const isCloudinaryConfigured = () => {
  const { cloud_name, api_key, api_secret } = getCloudinaryCredentials()
  return Boolean(cloud_name && api_key && api_secret)
}

export const removeLocalFile = (localFilePath) => {
  if (!localFilePath) return
  try {
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath)
    }
  } catch {
    // Ignore cleanup errors for temporary files
  }
}

export const uploadOnCloudinary = async (
  localFilePath,
  folder = 'velora',
) => {
  if (!localFilePath) return null

  if (!isCloudinaryConfigured()) {
    return {
      url: `/uploads/${path.basename(localFilePath)}`,
      publicId: null,
      provider: 'local',
    }
  }

  cloudinary.config(getCloudinaryCredentials())

  try {
    const response = await cloudinary.uploader.upload(localFilePath, {
      folder,
      resource_type: 'image',
    })
    removeLocalFile(localFilePath)
    return {
      url: response.secure_url || response.url,
      publicId: response.public_id,
      provider: 'cloudinary',
    }
  } catch (error) {
    removeLocalFile(localFilePath)
    throw new ApiError(
      500,
      error?.message || 'Failed to upload image to Cloudinary',
    )
  }
}

export const resolveUploadedImage = async (
  file,
  fallbackUrl,
  folder = 'velora',
) => {
  if (file?.path) {
    const uploaded = await uploadOnCloudinary(file.path, folder)
    return uploaded?.url || null
  }

  return typeof fallbackUrl === 'string' && fallbackUrl.trim()
    ? fallbackUrl.trim()
    : null
}

