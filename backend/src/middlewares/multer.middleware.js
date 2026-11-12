import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import multer from 'multer'
import { ApiError } from '../utils/ApiError.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const UPLOADS_DIR = path.resolve(__dirname, '../../public/uploads')

const ensureUploadsDir = () => {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true })
  }
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    ensureUploadsDir()
    cb(null, UPLOADS_DIR)
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase() || '.jpg'
    const baseName = path
      .basename(file.originalname || 'image', ext)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 40)
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`
    cb(null, `${baseName || 'velora'}-${uniqueSuffix}${ext}`)
  },
})

const imageFileFilter = (_req, file, cb) => {
  if (!file.mimetype?.startsWith('image/')) {
    return cb(
      new ApiError(
        400,
        'Only image files (JPG, PNG, WEBP, AVIF, GIF) are allowed',
      ),
    )
  }
  cb(null, true)
}

export const upload = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
})

