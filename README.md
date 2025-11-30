# FotoGallery - Vercel deployment (secure GitHub uploads)

![Image](https://github.com/user-attachments/assets/7ac754d2-29bd-4ce8-bdc5-fe87b9f144cf)

This project contains a static frontend (`index.html`) and two Vercel Serverless API endpoints:
- `/api/upload` — uploads a base64 image to a GitHub repo (creates file in `images/`).
- `/api/issue`  — creates a GitHub issue (to reference the uploaded image).

## How to deploy on Vercel (quick)
1. Create a Git repository with these files and push to GitHub.
2. Import the repository into Vercel (https://vercel.com/new).
3. In the Vercel Project > Settings > Environment Variables, add:
   - `GITHUB_TOKEN` = your GitHub personal access token (scopes: `repo` to allow contents & issues)
   - optional: `GITHUB_USERNAME` (default: Hanckdad)
   - optional: `GITHUB_REPO` (default: Database-Foto)

4. Deploy. The frontend will be served and the `/api/*` endpoints will run server-side with access to the token.

## Notes & Security
- **Do NOT** place the token in `index.html` or any client-side JS. The token must be in the environment variables.
- The frontend sends base64-encoded file content to `/api/upload`. The server then calls GitHub API.
- If your repo is public, uploaded images will be publicly accessible via `raw.githubusercontent.com` or via the file URL returned by the API.

## Troubleshooting
- If you see `GITHUB_TOKEN not configured` error — make sure the environment variable is set and redeploy.
- Check Vercel function logs for API errors.

Enjoy — you can now upload images securely without exposing your token in the browser.
