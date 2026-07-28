const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

async function redisRequest(method, path, body) {
  const url = `${UPSTASH_URL}${path}`;
  const headers = { Authorization: `Bearer ${UPSTASH_TOKEN}` };
  const opts = { method, headers };
  if (body) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(body);
  }
  const res = await fetch(url, opts);
  const json = await res.json();
  return json.result;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    return res.status(500).json({ error: 'Redis not configured' });
  }

  if (req.method === 'GET') {
    const count = parseInt(await redisRequest('GET', '/get/count')) || 0;
    return res.json({ count });
  }

  if (req.method === 'POST') {
    const count = parseInt(await redisRequest('POST', '/incr/count'));
    return res.json({ count });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
