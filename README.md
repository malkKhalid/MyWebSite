<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Malk All Banna - Personal Website

Bilingual (Arabic/English) personal portfolio website for Eng. Malk Khalid All Banna with an AI chatbot, admin dashboard, and SQLite database.

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies (root + server):
   `npm install && cd server && npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Start the backend:
   `cd server && npm run dev`
4. Start the frontend:
   `npm run dev`

The frontend runs on `http://localhost:5173` and proxies API calls to the backend on `http://localhost:3001`.

## Production Mode (one server for everything)

Build the frontend, then start only the server. The server serves the built site + API together:

```
npm run build
cd server && npm run start
```

Open `http://localhost:3001`.

## Deploy to Render (Free)

Render serves the full stack (frontend + backend + SQLite database) from one web service.

1. **Push this project to a GitHub repository.**

2. **Go to https://render.com** → Sign up (free, no credit card) → **New** → **Web Service** → connect your GitHub repo.

3. Render auto-detects `render.yaml`. If not auto-loaded, choose **Blueprint** and select `render.yaml`.

4. In the service settings, add your environment variables:
   - `GEMINI_API_KEY` = your real Gemini API key (the one used for the chatbot)

5. Click **Apply** / **Deploy**. Render builds the frontend, installs server deps, and starts the server.

6. After deploy finishes, you'll get a URL like `https://malk-personal-website.onrender.com`. That's your live site for everyone.

### Notes about the free tier

- The free web service **spins down after 15 minutes of inactivity** and wakes up on the next visit (takes ~1 minute first time).
- The SQLite database file is committed to the repo, so **all your data ships with every deploy**. To update the site: edit locally → commit → push → Render redeploys automatically with your latest data.
- To use your own domain: Render free tier supports **2 custom domains** (Settings → Custom Domains).

## Important

- `.env.local` is gitignored — never commit real API keys.
- The `server/database.sqlite` file contains all site data (settings, projects, certifications, education, etc.). It is committed intentionally so data travels with the deploy.
