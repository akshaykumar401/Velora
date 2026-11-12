import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { errorHandler } from './middlewares/error.middleware.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PUBLIC_DIR = path.resolve(__dirname, '../public')

// Route imports
import userRouter from './routes/user.routes.js'
import adminRouter from './routes/admin.routes.js'
import categoryRouter from './routes/category.routes.js'
import productRouter from './routes/product.routes.js'
import orderRouter from './routes/order.routes.js'
import reviewRouter from './routes/review.routes.js'
import newsletterRouter from './routes/newsletter.routes.js'
import settingsRouter from './routes/settings.routes.js'
import mailRouter from './routes/mail.routes.js'

const app = express()

const corsOrigin = process.env.CORS_ORIGIN?.trim()
app.use(
  cors({
    origin: !corsOrigin || corsOrigin === '*' ? true : corsOrigin.split(','),
    credentials: true,
  }),
)

app.use(express.json({ limit: '16kb' }))
app.use(express.urlencoded({ extended: true, limit: '16kb' }))
app.use(express.static(PUBLIC_DIR))
app.use(cookieParser())

app.get('/api/v1/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'velora-api' })
})

// Route Declarations
app.use('/api/v1/users', userRouter)
app.use('/api/v1/admin', adminRouter)
app.use('/api/v1/categories', categoryRouter)
app.use('/api/v1/products', productRouter)
app.use('/api/v1/orders', orderRouter)
app.use('/api/v1/reviews', reviewRouter)
app.use('/api/v1/newsletter', newsletterRouter)
app.use('/api/v1/settings', settingsRouter)
app.use('/api/v1/mail', mailRouter)

app.use(errorHandler)

export { app }
