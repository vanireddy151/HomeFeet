export const ADMIN_PHONES = ['9014011885', '7416995503'];

export const isAdminPhone = (phone: string | null) =>
  Boolean(phone && ADMIN_PHONES.includes(phone));

// Recognizes admins by phone allowlist (phone OTP accounts) or by
// accountType (email-registered accounts promoted to admin in the DB).
export const isAdminUser = (phone: string | null, accountType?: string | null) =>
  isAdminPhone(phone) || accountType === 'admin';
