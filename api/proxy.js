export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwGI3Z1vYOG4HvKM18Xp4QnmwLPxHVrhI0HJt8fuLTFQvtsP9GXGjNe_HfjUDHXVo1PMA/exec';

  try {
    let targetUrl = SCRIPT_URL;
    let fetchOptions = { method: 'GET', redirect: 'follow' };

    if (req.method === 'POST') {
      const body = req.body;
      const encoded = encodeURIComponent(JSON.stringify(body));
      targetUrl = `${SCRIPT_URL}?data=${encoded}`;
    } else if (req.query && Object.keys(req.query).length > 0) {
      const params = new URLSearchParams(req.query).toString();
      targetUrl = `${SCRIPT_URL}?${params}`;
    }

    const response = await fetch(targetUrl, fetchOptions);
    const text = await response.text();

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(text);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
