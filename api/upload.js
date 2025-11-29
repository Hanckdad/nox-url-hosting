export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  try {
    const body = req.body;
    const { fileName, content } = body || {};
    if (!fileName || !content) return res.status(400).json({ error: 'Missing fileName or content' });

    const token = process.env.GITHUB_TOKEN;
    const username = process.env.GITHUB_USERNAME || 'Hanckdad';
    const repo = process.env.GITHUB_REPO || 'Database-Foto';

    if (!token) return res.status(500).json({ error: 'GITHUB_TOKEN not configured in environment' });

    const path = `images/${fileName}`;

    // content is expected to be base64 (without data: prefix)
    const url = `https://api.github.com/repos/${username}/${repo}/contents/${encodeURIComponent(path)}`;

    const resp = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github+json'
      },
      body: JSON.stringify({
        message: `Upload file: ${fileName}`,
        content: content
      })
    });

    const data = await resp.json();
    if (!resp.ok) {
      return res.status(resp.status).json({ error: data.message || data });
    }

    return res.status(200).json(data.content || data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
