// api/upload.js

export default async function handler(req, res) {
    if (req.method !== "POST")
        return res.status(405).json({ error: "Method not allowed" });

    try {
        const { filename, base64 } = req.body;

        if (!filename || !base64) {
            return res.status(400).json({ error: "Invalid request body" });
        }

        const token = process.env.GITHUB_TOKEN;
        const username = "Hanckdad";
        const repo = "Database-Foto";

        const path = `images/${Date.now()}-${filename}`;

        const response = await fetch(
            `https://api.github.com/repos/${username}/${repo}/contents/${path}`,
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: `Upload foto: ${filename}`,
                    content: base64,
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return res.status(500).json({
                error: "Upload gagal",
                detail: data,
            });
        }

        return res.status(200).json({
            message: "Upload berhasil",
            imageUrl: data.content.download_url
        });

    } catch (err) {
        return res.status(500).json({ error: "Server error", detail: err });
    }
}