import mongoose from 'mongoose'
import multer from 'multer'
import { ApiError } from '../utils/ApiError.js'

export const errorHandler = (err, _req, res, _next) => {
  let statusCode = err?.statusCode || 500
  let message = err?.message || 'Internal Server Error'
  let errors = err?.errors || []

  if (err instanceof multer.MulterError) {
    statusCode = 400
    message =
      err.code === 'LIMIT_FILE_SIZE'
        ? 'Uploaded image exceeds the 5MB size limit'
        : err.message
  } else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400
    message = 'Validation failed'
    errors = Object.values(err.errors).map((e) => e.message)
  } else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400
    message = `Invalid identifier for field "${err.path}"`
  } else if (err?.code === 11000) {
    statusCode = 409
    const field = Object.keys(err.keyPattern || {})[0] || 'record'
    message = `Duplicate value for ${field}`
  } else if (!(err instanceof ApiError)) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[API Error]', err)
    }
  }

  return res.status(statusCode).json({
    statusCode,
    data: null,
    message,
    success: false,
    errors,
  })
}

