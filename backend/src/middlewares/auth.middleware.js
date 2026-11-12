import jwt from 'jsonwebtoken'
import { createClerkClient, verifyToken } from '@clerk/backend'
import { User } from '../models/user.model.js'
import { ApiError } from '../utils/ApiError.js'
import {
  isConfiguredAdminEmail,
  parseConfiguredAdminAccounts,
} from '../utils/adminConfig.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { buildWelcomeEmail } from '../utils/emailTemplates.js'
import {
  isDeliverableEmail,
  notifyInBackground,
  sendMailSafe,
} from '../utils/mailService.js'

const getAccessSecret = () =>
  process.env.ACCESS_TOKEN_SECRET || 'velora-dev-access-secret-change-in-env'

const extractToken = (req, cookieName = 'accessToken') => {
  const authHeader = req.headers.authorization
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7).trim()
  }
  return req.cookies?.[cookieName] || ''
}

const findOrCreateClerkUser = async (clerkUserId) => {
  let user = await User.findOne({ clerkId: clerkUserId })
  if (user) return user

  let email = `${clerkUserId}@clerk.velora.local`
  let fullName = 'Velora Client'
  let avatarUrl = ''

  if (process.env.CLERK_SECRET_KEY) {
    try {
      const clerkClient = createClerkClient({
        secretKey: process.env.CLERK_SECRET_KEY,
      })
      const clerkUser = await clerkClient.users.getUser(clerkUserId)
      const primaryEmail =
        clerkUser.emailAddresses?.find(
          (e) => e.id === clerkUser.primaryEmailAddressId,
        )?.emailAddress || clerkUser.emailAddresses?.[0]?.emailAddress

      if (primaryEmail) email = primaryEmail.toLowerCase()
      const combinedName = [clerkUser.firstName, clerkUser.lastName]
        .filter(Boolean)
        .join(' ')
        .trim()
      if (combinedName) fullName = combinedName
      else if (clerkUser.username) fullName = clerkUser.username
      if (clerkUser.imageUrl) avatarUrl = clerkUser.imageUrl
    } catch {
      // Proceed with minimal claims if Clerk user lookup is unavailable
    }
  }

  // Link by email if an existing user matches
  user = await User.findOne({ email })
  if (user) {
    user.clerkId = clerkUserId
    if (avatarUrl && !user.avatarUrl) user.avatarUrl = avatarUrl
    await user.save({ validateBeforeSave: false })
    return user
  }

  user = await User.create({
    clerkId: clerkUserId,
    email,
    fullName,
    avatarUrl,
    role: 'customer',
  })

  if (isDeliverableEmail(user.email)) {
    notifyInBackground(
      () =>
        sendMailSafe({
          to: user.email,
          ...buildWelcomeEmail({ fullName: user.fullName }),
          context: 'clerk-welcome',
        }),
      'clerk-welcome',
    )
  }

  return user
}

const resolveCustomerFromToken = async (token) => {
  if (!token) return { user: null, provider: null }

  // 1. Attempt Clerk JWT verification when CLERK_SECRET_KEY is configured
  if (process.env.CLERK_SECRET_KEY) {
    try {
      const verifiedPayload = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
      })
      if (verifiedPayload?.sub) {
        const user = await findOrCreateClerkUser(verifiedPayload.sub)
        return { user, provider: 'clerk' }
      }
    } catch {
      // Fall through to local JWT verification
    }
  }

  // 2. Fallback to local Velora JWT
  const decoded = jwt.verify(token, getAccessSecret())
  const user = await User.findById(decoded._id)
  if (!user) {
    throw new ApiError(401, 'Invalid authentication session')
  }
  return { user, provider: 'jwt' }
}

export const verifyCustomerAuth = asyncHandler(async (req, _res, next) => {
  const token = extractToken(req, 'accessToken')
  if (!token) {
    throw new ApiError(401, 'Authentication required')
  }

  try {
    const { user, provider } = await resolveCustomerFromToken(token)
    req.user = user
    req.authProvider = provider
    next()
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(401, 'Invalid or expired authentication token')
  }
})

export const optionalCustomerAuth = asyncHandler(async (req, _res, next) => {
  const token = extractToken(req, 'accessToken')
  if (!token) {
    return next()
  }

  try {
    const { user, provider } = await resolveCustomerFromToken(token)
    if (user) {
      req.user = user
      req.authProvider = provider
    }
  } catch {
    // Guests / expired tokens proceed without blocking public read routes
  }
  next()
})

export const verifyAdminAuth = asyncHandler(async (req, _res, next) => {
  const token = extractToken(req, 'adminAccessToken')
  if (!token) {
    throw new ApiError(401, 'Administrator authentication required')
  }

  try {
    const decoded = jwt.verify(token, getAccessSecret())
    const user = await User.findById(decoded._id)
    if (!user) {
      throw new ApiError(401, 'Invalid administrator session')
    }
    if (user.role !== 'admin') {
      throw new ApiError(403, 'Administrator privileges required')
    }
    if (
      parseConfiguredAdminAccounts().length === 0 ||
      !isConfiguredAdminEmail(user.email)
    ) {
      throw new ApiError(
        403,
        'Administrator access is not authorized in environment configuration',
      )
    }
    req.admin = user
    next()
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(401, 'Invalid or expired administrator token')
  }
})

