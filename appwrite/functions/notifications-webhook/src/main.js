import { Client, Databases, ID } from 'node-appwrite';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function isValidHexColor(color) {
  if (!color.startsWith('#')) return false;
  const hexPart = color.slice(1);
  return (hexPart.length === 3 || hexPart.length === 6) && /^[0-9A-Fa-f]+$/.test(hexPart);
}

export default async ({ req, res, log, error }) => {
  if (req.method === 'OPTIONS') {
    return res.empty();
  }

  if (req.method !== 'POST') {
    return res.json({ error: 'Method not allowed' }, 405, corsHeaders);
  }

  let payload;
  try {
    payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.json({ error: 'Invalid JSON body' }, 400, corsHeaders);
  }

  // Accept both "color" and "colour" from callers
  const { title, description, image, timestamp } = payload ?? {};
  const color = payload?.color ?? payload?.colour;

  if (!title || !description || !color) {
    return res.json(
      { error: 'Missing required fields: title, description, color' },
      400,
      corsHeaders
    );
  }

  if (
    typeof title !== 'string' || title.trim() === '' ||
    typeof description !== 'string' || description.trim() === '' ||
    typeof color !== 'string' || color.trim() === ''
  ) {
    return res.json(
      { error: 'title, description, and color must be non-empty strings' },
      400,
      corsHeaders
    );
  }

  const validImageTypes = ['good', 'bad', 'problem'];
  const finalImage = image && validImageTypes.includes(image) ? image : 'good';
  const finalColor = isValidHexColor(color) ? color : '#333333';
  const finalTimestamp = timestamp || new Date().toISOString();

  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new Databases(client);

  try {
    await databases.createDocument(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_COLLECTION_ID,
      ID.unique(),
      {
        title: title.trim(),
        description: description.trim(),
        colour: finalColor,
        Image: finalImage,
        timestamp: finalTimestamp,
      }
    );

    log('Notification created successfully');
    return res.json({ success: true }, 200, corsHeaders);
  } catch (err) {
    error('Database error: ' + err.message);
    return res.json({ error: 'Database error', details: err.message }, 500, corsHeaders);
  }
};
