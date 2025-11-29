export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  try {
    const { title, body } = req.body || {};
    if (!title) return res.status(400).json({ error: 'Missing title' });

    const token = process.env.GITHUB_TOKEN;
    const username = process.env.GITHUB_USERNAME || 'Hanckdad';
    const repo = process.env.GITHUB_REPO || 'Database-Foto';

    if (!token) return res.status(500).json({ error: 'GITHUB_TOKEN not configured in environment' });

    const url = `https://api.github.com/repos/${username}/${repo}/issues`;

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github+json'
      },
      body: JSON.stringify({ title, body })
    });

    const data = await resp.json();
    if (!resp.ok) return res.status(resp.status).json({ error: data.message || data });

    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
