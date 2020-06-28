const Joi = require('@hapi/joi');

const mediaSchema = Joi.object({
  type: Joi.string().valid('image', 'document', 'audio', 'voice', 'video').optional(),
  url: Joi.string().uri().optional(),
  mediaId: Joi.string().optional(),
  caption: Joi.string().optional(),
});

const locationSchema = Joi.object({
  longitude: Joi.number().required(),
  latitude: Joi.number().required(),
  name: Joi.string().optional(),
  address: Joi.string().optional(),
});

const contentSchema = Joi.object({
  contentType: Joi.string().valid('text', 'url', 'media', 'location').required(),
  text: Joi.string().optional(),
  url: Joi.string().optional(),
  media: mediaSchema.optional().allow(null),
  location: locationSchema.optional().allow(null),
});

const contextSchema = Joi.object({
  messageId: Joi.string().optional(),
});

const smsOriginSchema = Joi.object({
  mcc: Joi.string().optional(),
  mnc: Joi.string().optional(),
  ttId: Joi.string().optional(),
});

const smsContentSchema = Joi.object({
  messageId: Joi.string().optional(),
  sentDate: Joi.string().isoDate().optional(),
  price: Joi.number().optional(),
  currency: Joi.string().optional(),
  priceEffective: Joi.string().isoDate().optional(),
  sequenceNumber: Joi.number().optional(),
});

const smsSchema = Joi.object({
  origin: smsOriginSchema.optional(),
  totalPrice: Joi.number().optional(),
  size: Joi.number().optional(),
  missingParts: Joi.boolean().optional(),
  parts: Joi.array().items(smsContentSchema).optional(),
});

const whatsappSchema = Joi.object({
  senderName: Joi.string().optional(),
});

const messageSchema = Joi.object({
  event: Joi.string().valid('MoMessage').required(),
  channel: Joi.string().valid('whatsapp', 'sms', 'tyntecEcho').required(),
  receivedAt: Joi.string().isoDate().optional(),
  timestamp: Joi.string().isoDate().optional(),
  messageId: Joi.string().required(),
  from: Joi.string().required(),
  to: Joi.string().required(),
  groupId: Joi.string().optional(),
  content: contentSchema.required(),
  context: contextSchema.optional(),
  sms: smsSchema.optional(),
  whatsapp: whatsappSchema.optional(),
});

module.exports = {
  messageSchema,
};
