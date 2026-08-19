// server.js
// Physics AI Study Assistant — backend
// Handles: file upload + text extraction, chunking, embeddings, and
// retrieval-augmented chat answers using the free-tier Google Gemini API.

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const { GoogleGenAI } = require("@google/genai");

const app = express();
const PORT = process.env.PORT || 5000;

if (!process.env.GEMINI_API_KEY) {
  console.warn("WARNING: GEMINI_API_KEY is not set. Set it in your .env file.");
}
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const EMBEDDING_MODEL = "gemini-embedding-001";
const CHAT_MODEL = "gemini-3.6-flash";

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json({ limit: "2mb" }));

// ---------- In-memory store ----------
// Each document: { id, name, chunks: [{ id, text, embedding }] }
// This resets if the server restarts (fine for a personal study tool).
// For real persistence, swap this for a database later.
let documents = [];

// ---------- File upload setup ----------
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

// ---------- Helpers ----------

// Extract raw text from an uploaded file buffer based on its type.
async function extractText(file) {
  const ext = path.extname(file.originalname).toLowerCase();

  if (ext === ".pdf") {
    const data = await pdfParse(file.buffer);
    return data.text;
  }

  if (ext === ".docx") {
    const result = await mammoth.extractRawText({ buffer: file.buffer });
    return result.value;
  }

  if (ext === ".txt") {
    return file.buffer.toString("utf-8");
  }

  throw new Error(`Unsupported file type: ${ext}. Use PDF, DOCX, or TXT.`);
}

// Split text into overlapping chunks so context isn't cut mid-idea.
function chunkText(text, chunkSize = 1000, overlap = 150) {
  const clean = text.replace(/\s+/g, " ").trim();
  const chunks = [];
  let start = 0;

  while (start < clean.length) {
    const end = Math.min(start + chunkSize, clean.length);
    chunks.push(clean.slice(start, end));
    start += chunkSize - overlap;
  }

  return chunks.filter((c) => c.trim().length > 30);
}

// Get embeddings for an array of text strings in one API call.
async function embedTexts(texts) {
  const response = await ai.models.embedContent({
    model: EMBEDDING_MODEL,
    contents: texts,
  });
  return response.embeddings.map((e) => e.values);
}

// Cosine similarity between two equal-length vectors.
function cosineSimilarity(a, b) {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Find the top-k most relevant chunks across all uploaded documents.
function findRelevantChunks(queryEmbedding, k = 6) {
  const scored = [];
  for (const doc of documents) {
    for (const chunk of doc.chunks) {
      scored.push({
        docName: doc.name,
        text: chunk.text,
        score: cosineSimilarity(queryEmbedding, chunk.embedding),
      });
    }
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, k);
}

// ---------- Routes ----------

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", documents: documents.length });
});

// List uploaded documents
app.get("/api/documents", (req, res) => {
  res.json(
    documents.map((d) => ({ id: d.id, name: d.name, chunks: d.chunks.length }))
  );
});

// Delete a document
app.delete("/api/documents/:id", (req, res) => {
  documents = documents.filter((d) => d.id !== req.params.id);
  res.json({ success: true });
});

// Upload + process a document
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const text = await extractText(req.file);
    if (!text || text.trim().length < 20) {
      return res.status(400).json({ error: "Couldn't find readable text in that file." });
    }

    const chunkTexts = chunkText(text);
    if (chunkTexts.length === 0) {
      return res.status(400).json({ error: "No usable content found after processing." });
    }

    const embeddings = await embedTexts(chunkTexts);

    const doc = {
      id: uuidv4(),
      name: req.file.originalname,
      chunks: chunkTexts.map((t, i) => ({
        id: `${i}`,
        text: t,
        embedding: embeddings[i],
      })),
    };
    documents.push(doc);

    res.json({
      success: true,
      document: { id: doc.id, name: doc.name, chunks: doc.chunks.length },
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: err.message || "Failed to process file." });
  }
});

// Ask a question — retrieves relevant chunks and asks the model to answer
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required." });
    }

    let contextBlock = "";
    if (documents.length > 0) {
      const [queryEmbedding] = await embedTexts([message]);
      const relevant = findRelevantChunks(queryEmbedding, 6);
      if (relevant.length > 0) {
        contextBlock = relevant
          .map((r) => `(from "${r.docName}")\n${r.text}`)
          .join("\n\n---\n\n");
      }
    }

    const systemPrompt = `You are a friendly physics tutor talking to a school student.

How to explain:
- Use simple, everyday words. Avoid heavy jargon — if you must use a technical term, explain it in plain language right after.
- Break ideas into small steps. Use short sentences and real-life examples or analogies (things a student sees every day) wherever they help.
- Keep answers focused and not overly long, the way a good teacher would explain it face to face — clear over exhaustive.
- Use simple math notation only where it actually helps (e.g. F = ma), and explain what each symbol means.

How to use the reference material:
- The excerpts below come from the student's own uploaded notes. Use them to understand the topic and match what the student is studying — but answer in your own natural words, don't quote them directly or say things like "From Excerpt 2." Just explain it like you already know it.
- If the notes don't fully cover the question, that's fine — just answer from general physics knowledge, still in the same simple style. No need to point out that it wasn't in the notes unless it's genuinely relevant.

How to match the student's tone:
- Mirror how the student is asking — if they're casual, be casual; if they write in short phrases or mix in their own language/slang, respond in a similarly relaxed, approachable way rather than switching to a stiff, formal register.
- Stay warm and encouraging, especially if they seem stuck or frustrated.

Reference material from the student's uploaded documents (for your understanding only — don't cite it directly):
${contextBlock || "(No documents uploaded yet, or none relevant to this question.)"}`;

    // Gemini expects alternating user/model turns, no separate "system" role.
    const priorTurns = history.slice(0, -1).slice(-10).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const contents = [...priorTurns, { role: "user", parts: [{ text: message }] }];

    const response = await ai.models.generateContent({
      model: CHAT_MODEL,
      contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.4,
      },
    });

    const answer = response.text;
    res.json({ answer });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: err.message || "Failed to get a response." });
  }
});

app.listen(PORT, () => {
  console.log(`Physics AI Study Assistant backend running on port ${PORT}`);
});
