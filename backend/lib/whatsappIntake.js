const path = require('path');
const fs = require('fs/promises');
const crypto = require('crypto');
const Property = require('../models/Property');
const User = require('../models/User');
const WhatsAppIntake = require('../models/WhatsAppIntake');
const { parsePropertySummary } = require('./propertySummaryParser');

const normalizePhone = (value = '') =>
  String(value || '').replace(/\D/g, '').slice(-10);

const getIndiaHour = () =>
  Number(new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    hour12: false
  }).format(new Date()));

const getIntakePeriod = () => {
  const hour = getIndiaHour();
  return hour < 15 ? 'morning' : 'evening';
};

const ensureIntakeOwner = async ({ phone, name }) => {
  const ownerPhone = normalizePhone(phone);
  if (!ownerPhone) return null;

  const fullName = String(name || 'WhatsApp Owner').trim();
  const [firstName, ...rest] = fullName.split(/\s+/);
  let user = await User.findOne({ phone: ownerPhone });
  if (user) {
    if (!['owner', 'mediator'].includes(user.accountType)) return user;
    if (firstName && (!user.firstName || user.firstName === 'WhatsApp')) user.firstName = firstName;
    if (rest.length && !user.lastName) user.lastName = rest.join(' ');
    user.isVerified = true;
    await user.save();
    return user;
  }

  user = await User.create({
    phone: ownerPhone,
    firstName: firstName || 'WhatsApp',
    lastName: rest.join(' '),
    accountType: 'owner',
    builderVerificationStatus: 'not_required',
    isVerified: true
  });
  return user;
};

const downloadWhatsAppMedia = async (mediaId) => {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  if (!token || !mediaId || typeof fetch !== 'function') return '';

  try {
    const metaRes = await fetch(`https://graph.facebook.com/v19.0/${mediaId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const meta = await metaRes.json();
    if (!metaRes.ok || !meta.url) return '';

    const mediaRes = await fetch(meta.url, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!mediaRes.ok) return '';

    const contentType = mediaRes.headers.get('content-type') || 'image/jpeg';
    const ext = contentType.includes('png') ? '.png' : contentType.includes('webp') ? '.webp' : '.jpg';
    const bytes = Buffer.from(await mediaRes.arrayBuffer());
    const folder = path.join(__dirname, '..', '..', 'uploads', 'whatsapp-intake');
    await fs.mkdir(folder, { recursive: true });
    const filename = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`;
    await fs.writeFile(path.join(folder, filename), bytes);
    return `/uploads/whatsapp-intake/${filename}`;
  } catch (error) {
    console.error('WhatsApp media download failed:', error);
    return '';
  }
};

const createPendingPropertyFromIntake = async ({
  summary,
  ownerPhone,
  ownerName,
  mediaIds = [],
  mediaUrls = [],
  source = 'whatsapp_manual',
  whatsappMessageId = ''
}) => {
  const parsed = parsePropertySummary(summary);
  const owner = await ensureIntakeOwner({ phone: ownerPhone, name: ownerName });
  const intakePeriod = getIntakePeriod();
  const downloadedUrls = [];

  for (const mediaId of mediaIds.slice(0, 3)) {
    const url = await downloadWhatsAppMedia(mediaId);
    if (url) downloadedUrls.push(url);
  }

  const allMediaUrls = [...downloadedUrls, ...mediaUrls].filter(Boolean);
  const intake = await WhatsAppIntake.create({
    source: source === 'whatsapp_webhook' ? 'webhook' : 'manual',
    ownerPhone: normalizePhone(ownerPhone),
    ownerName: ownerName || '',
    summary,
    parsed,
    mediaIds,
    mediaUrls: allMediaUrls,
    whatsappMessageId,
    intakePeriod,
    status: 'pending'
  });

  const property = await Property.create({
    ...parsed,
    totalArea: parsed.totalArea || '0',
    city: parsed.city || 'Hyderabad',
    state: parsed.state || 'Telangana',
    locality: parsed.locality || 'WhatsApp Intake',
    landmark: parsed.landmark || 'Shared via WhatsApp',
    description: parsed.description || summary,
    imageUrl: allMediaUrls[0] || '',
    plotDiagramUrl: allMediaUrls[1] || '',
    contactPhone: normalizePhone(ownerPhone),
    phone: normalizePhone(ownerPhone),
    contactEmail: owner?.email || '',
    userId: owner?._id?.toString() || 'whatsapp-intake',
    status: 'pending',
    source,
    whatsappIntakeId: intake._id.toString(),
    whatsappMediaIds: mediaIds,
    intakePeriod
  });

  intake.propertyId = property._id.toString();
  intake.status = 'converted';
  await intake.save();

  return { intake, property };
};

module.exports = {
  createPendingPropertyFromIntake,
  getIntakePeriod,
  normalizePhone
};
