export const ADMIN_PHONES = ['9014011885', '7416995503'];

export const isAdminPhone = (phone: string | null) =>
  Boolean(phone && ADMIN_PHONES.includes(phone));
