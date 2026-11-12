import mongoose from 'mongoose'
import { DB_NAME } from '../constants.js'

const connectDB = async () => {
  try {
    const rawUrl = process.env.MONGODB_URL?.trim()
    if (!rawUrl) {
      throw new Error('MONGODB_URL environment variable is not defined')
    }
    const baseUrl = rawUrl.replace(/\/+$/, '')
    const connectionInstance = await mongoose.connect(`${baseUrl}/${DB_NAME}`)
    console.log(
      `\nMongoDB Connected! DB HOST: ${connectionInstance.connection.host}`,
    )
    return connectionInstance
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`)
    process.exit(1)
  }
}

export default connectDB
