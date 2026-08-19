# Physics Study Assistant

A personal AI study assistant for physics. Upload your notes (PDF, DOCX, or TXT),
then ask questions — the assistant reads your documents and answers using them,
with a minimal Claude-style interface (greeting, one input box, one upload button).

## How it works

- **Frontend** — React + Vite + Tailwind. Single-screen chat UI.
- **Backend** — Node.js + Express, using Google's current `@google/genai` SDK.
  Extracts text from your uploads, splits it into chunks, embeds them with
  Gemini, and retrieves the most relevant chunks to answer each question
  (retrieval-augmented generation).
- **AI model** — Gemini `gemini-embedding-001` for search, `gemini-3.6-flash`
  for answers. Both are **free** — no credit card required, generous daily quota,
  more than enough for personal study use.

> Google renames/retires Gemini model versions every few months. If you ever see
> a "model not found" or "no longer available" error, open `backend/server.js`
> and update the `EMBEDDING_MODEL` / `CHAT_MODEL` constants near the top to
> whatever current model names Google's error message (or
> https://ai.google.dev/gemini-api/docs/models) points you to — no other code
> needs to change.

Uploaded documents are kept in the backend's memory while it's running — simple
and enough for personal use. If the backend restarts, re-upload your files.

---

## Part 1 — Run it on your own computer first

### 1. Get a free Gemini API key
Go to https://aistudio.google.com/apikey, sign in with a Google account, and
click **Create API key**. No credit card, no payment setup — it's free within
daily limits that are far more than a personal study assistant will hit.

### 2. Backend setup
```bash
cd backend
npm install
cp .env.example .env
```
Open `.env` and paste your key:
```
GEMINI_API_KEY=AIza...
PORT=5000
CORS_ORIGIN=http://localhost:5173
```
Run it:
```bash
npm start
```
You should see `Physics AI Study Assistant backend running on port 5000`.

### 3. Frontend setup
In a new terminal:
```bash
cd frontend
npm install
cp .env.example .env
```
`.env` should point at your local backend (default is already correct):
```
VITE_API_URL=http://localhost:5000
VITE_SITE_PIN=1234
```
Change `VITE_SITE_PIN` to whatever PIN you want — the site shows a lock screen
first and only lets someone in if they enter it. This isn't strong security
(it's plain client-side code), just a way to keep the link from being wide
open to randoms until you build real sign-in.
Run it:
```bash
npm run dev
```
Open the URL it prints (usually `http://localhost:5173`). Upload a PDF and
start asking questions.

> Tip: open `frontend/src/App.jsx` and change `STUDENT_NAME` to your name — that's
> the "Hello, ___" greeting.

---

## Part 2 — Put it on GitHub

```bash
cd physics-study-assistant
git init
git add .
git commit -m "Initial commit: physics study assistant"
```
Create a new empty repo on GitHub (no README/gitignore — you already have them),
then:
```bash
git remote add origin https://github.com/<your-username>/physics-study-assistant.git
git branch -M main
git push -u origin main
```

---

## Part 3 — Deploy the backend (Render)

1. Go to https://render.com and sign in with GitHub.
2. **New +** → **Web Service** → pick your `physics-study-assistant` repo.
3. Set:
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
4. Under **Environment Variables**, add:
   - `GEMINI_API_KEY` → your key
   - `CORS_ORIGIN` → you'll fill this in after step 4 below (leave as `*` for now)
5. Click **Create Web Service**. Wait for it to deploy, then copy its URL —
   something like `https://physics-study-assistant.onrender.com`.

> Free Render services spin down after inactivity and take ~30–60 seconds to
> wake up on the next request — normal for a personal project, and the
> in-memory documents will reset when that happens, so you'd re-upload files
> after a long idle period.

---

## Part 4 — Deploy the frontend (Vercel)

1. Go to https://vercel.com and sign in with GitHub.
2. **Add New** → **Project** → pick the same repo.
3. Set:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite (auto-detected)
4. Under **Environment Variables**, add:
   - `VITE_API_URL` → your Render backend URL from Part 3 (e.g.
     `https://physics-study-assistant.onrender.com`)
   - `VITE_SITE_PIN` → whatever PIN you want people to enter before seeing the site
5. Click **Deploy**. Vercel gives you a live URL like
   `https://physics-study-assistant.vercel.app`.

### Connect the two
Go back to Render → your backend service → Environment → set
`CORS_ORIGIN` to your Vercel URL (e.g. `https://physics-study-assistant.vercel.app`),
then **Manual Deploy → Deploy latest commit** to restart it with the new setting.

---

## You're live

Visit your Vercel URL from any device — upload a physics chapter, ask a
question, and it'll answer using your material.

## Later upgrades (optional)
- **Persistent storage:** swap the in-memory document store for a database
  (e.g. Neon Postgres, which you've already used before) so uploads survive
  backend restarts.
- **Multiple subjects/folders:** tag documents by chapter or topic.
- **Auth:** add a simple login if you want this to only be usable by you.
