// api/issue.js

export default async function handler(req, res) {
    if (req.method !== "POST")
        return res.status(405).json({ error: "Method not allowed" });

    try {
        const { filename, imageUrl } = req.body;

        if (!filename || !imageUrl) {
            return res.status(400).json({ error: "Invalid body" });
        }

        const token = process.env.GITHUB_TOKEN;
        const username = "Hanckdad";
        const repo = "Database-Foto";

        const issueTitle = `Foto Baru: ${filename}`;
        const issueBody = `Foto telah diupload:\n\n![${filename}](${imageUrl})`;

        const response = await fetch(
            `https://api.github.com/repos/${username}/${repo}/issues`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: issueTitle,
                    body: issueBody,
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return res.status(500).json({
                error: "Gagal membuat issue",
                detail: data,
            });
        }

        return res.status(200).json({
            message: "Issue berhasil dibuat",
            issueUrl: data.html_url,
        });

    } catch (err) {
        return res.status(500).json({ error: "Server error", detail: err });
    }
}