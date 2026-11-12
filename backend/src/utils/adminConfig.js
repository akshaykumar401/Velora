const cleanEnvItem = (value) =>
  value
    .trim()
    .replace(/^['"]|['"]$/g, '')
    .trim()

export const parseConfiguredAdminAccounts = () => {
  const emails = (process.env.ADMIN_EMAIL || '')
    .split(',')
    .map((item) => cleanEnvItem(item).toLowerCase())
    .filter(Boolean)

  const rawPassword = cleanEnvItem(
    process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSCODE || '',
  )

  if (emails.length === 0 || !rawPassword) {
    return []
  }

  const passwordParts = rawPassword
    .split(',')
    .map((item) => cleanEnvItem(item))
    .filter(Boolean)

  const hasPerAccountPasswords =
    emails.length > 1 && passwordParts.length === emails.length

  return emails.map((email, index) => ({
    email,
    password: hasPerAccountPasswords ? passwordParts[index] : rawPassword,
  }))
}

export const isConfiguredAdminEmail = (email) => {
  if (!email) return false
  const normalized = String(email).trim().toLowerCase()
  return parseConfiguredAdminAccounts().some(
    (account) => account.email === normalized,
  )
}

