const express = require('express');
const router = express.Router();
const multer = require('multer');
const Anthropic = require('@anthropic-ai/sdk');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

router.post('/analyze-floor-plan', upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image provided' });

  const base64Image = req.file.buffer.toString('base64');
  const mediaType = req.file.mimetype || 'image/jpeg';

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mediaType, data: base64Image }
            },
            {
              type: 'text',
              text: `Analyze this floor plan image and extract all room names and their dimensions.
Return ONLY a JSON array of objects with "name" and "dimension" keys.
Include all rooms visible (bedrooms, bathrooms, kitchen, living room, hall, balcony, etc.).
Use the dimension format shown in the image (e.g. "12'×10'" or "3.5m×4m").
If no dimension is visible for a room, omit the "dimension" value or set it to "".
Example output: [{"name":"Master Bedroom","dimension":"14'×12'"},{"name":"Bedroom 2","dimension":"11'×10'"},{"name":"Living Room","dimension":"18'×15'"}]
Return ONLY the JSON array, no extra text.`
            }
          ]
        }
      ]
    });

    const text = message.content[0]?.text?.trim() || '[]';
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    const rooms = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    res.json({ rooms });
  } catch (err) {
    console.error('Floor plan analysis error:', err.message || err);
    res.status(500).json({ error: 'Unable to analyze image', rooms: [] });
  }
});

module.exports = router;
