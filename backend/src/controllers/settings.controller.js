import {
  DEFAULT_STOREFRONT_SETTINGS,
  SiteSettings,
} from '../models/siteSettings.model.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import {
  removeLocalFile,
  resolveUploadedImage,
} from '../utils/cloudinary.js'
import { serializeSiteSettings } from '../utils/serializers.js'

const parseNullableImageBody = (value) => {
  if (value === undefined) return undefined
  if (value === null) return null
  const trimmed = String(value).trim()
  if (!trimmed || trimmed === 'null') return null
  return trimmed
}

export const getStorefrontSettings = asyncHandler(async (_req, res) => {
  const settings = await SiteSettings.findOne({ key: 'storefront' })
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        serializeSiteSettings(settings),
        'Storefront settings fetched',
      ),
    )
})

export const updateStorefrontSettings = asyncHandler(async (req, res) => {
  const heroFile = req.files?.heroImage?.[0] || req.files?.image?.[0] || null
  const philosophyFile = req.files?.philosophyImage?.[0] || null

  try {
    let settings = await SiteSettings.findOne({ key: 'storefront' })
    if (!settings) {
      settings = new SiteSettings({ key: 'storefront' })
    }

    const { heroEyebrow, heroTitle, heroSubtitle } = req.body

    if (heroFile || req.body.heroImage !== undefined) {
      settings.heroImage = await resolveUploadedImage(
        heroFile,
        parseNullableImageBody(req.body.heroImage),
        'velora/site',
      )
    }

    if (philosophyFile || req.body.philosophyImage !== undefined) {
      settings.philosophyImage = await resolveUploadedImage(
        philosophyFile,
        parseNullableImageBody(req.body.philosophyImage),
        'velora/site',
      )
    }

    if (heroEyebrow !== undefined) {
      settings.heroEyebrow =
        String(heroEyebrow).trim() || DEFAULT_STOREFRONT_SETTINGS.heroEyebrow
    }
    if (heroTitle !== undefined) {
      settings.heroTitle =
        String(heroTitle).trim() || DEFAULT_STOREFRONT_SETTINGS.heroTitle
    }
    if (heroSubtitle !== undefined) {
      settings.heroSubtitle =
        String(heroSubtitle).trim() || DEFAULT_STOREFRONT_SETTINGS.heroSubtitle
    }

    await settings.save()

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          serializeSiteSettings(settings),
          'Storefront settings updated',
        ),
      )
  } catch (err) {
    removeLocalFile(heroFile?.path)
    removeLocalFile(philosophyFile?.path)
    throw err
  }
})

