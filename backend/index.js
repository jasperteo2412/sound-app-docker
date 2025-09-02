import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import SQLiteStoreFactory from "connect-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import { initDatabase } from "./db.js";
import multer from "multer";
import fs from "fs";
import mime from "mime";
import bcrypt from "bcrypt";

dotenv.config();

const app = express();

// PORTS
const PORT = process.env.PORT || 4000;
const ORIGIN = process.env.CORS_ORIGIN || "http://localhost:4173";

//DB session
const SQLiteStore = SQLiteStoreFactory(session);
const sessionSecret = "8zXxHZTRr9";

//fileName dirName
const _fileName = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_fileName);

app.use(cors({ origin: ORIGIN, credentials: true }));
app.use(express.json());
app.use(
  session({
    store: new SQLiteStore({
      db: "sessions.sqlite",
      dir: _dirname,
    }),
    secret: process.env.SESSION_SECRET || sessionSecret,
    resave: false,
    saveUninitialized: false,
    // set cookie age 1 day
    cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 },
  })
);

const uploadDir = path.join(_dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(_dirname, "uploads")); // ensure "uploads" folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const allowed = new Set([
  "audio/mpeg", // mp3
  "audio/mp4", // m4a
  "audio/aac",
  "audio/wav",
  "audio/ogg",
  "audio/webm",
  "video/mp4", // as per brief (mp4/avi)
  "video/x-msvideo", // avi
]);

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (allowed.has(file.mimetype)) cb(null, true);
    else cb(new Error("Unsupported file type: " + file.mimetype));
  },
  limits: { fileSize: 1024 * 1024 * 1024 }, // 1GB max
});

//initDB
let db;
initDatabase().then((d) => (db = d));

function requireAuth(req, res, next) {
  if (req.session.user) return next();
  return res.status(401).json({ error: "User is unauthorised!" });
}

function requireAdmin(req, res, next) {
  if (req.session.user?.role === "admin") return next();
  return res.status(403).json({ error: "User is forbidden to perform action" });
}

// authentication API
app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Missing credentials!" });
  }

  const user = await db.get("SELECT * FROM users WHERE username = ?", username);
  if (!user) {
    return res.status(401).json({ error: "Invalid login!" });
  }

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) {
    return res.status(401).json({ error: "Invalid login!" });
  }

  req.session.user = { id: user.id, username: user.username, role: user.role };
  res.json({ user: req.session.user });
});

app.post("/api/auth/logout", (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

app.get("/api/auth/me", (req, res) => {
  res.json({ user: req.session.user || null });
});

//users API
app.get("/api/users", requireAuth, requireAdmin, async (req, res) => {
  const users = await db.all(
    "SELECT id, username, role, datetime(created_at, '+8 hours') AS created_at FROM users ORDER BY id"
  );
  res.json({ users });
});

app.post("/api/users", requireAuth, requireAdmin, async (req, res) => {
  const { username, password, role = "user" } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Missing fields! Please check your inputs" });
  }
  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await db.run(
      "INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)",
      [username, hash, role]
    );
    res.status(201).json({ id: result.lastID, username, role });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.put("/api/users/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const { password, role } = req.body;

  const acting = req.session.user;
  if (acting.role !== "admin" && acting.id !== Number(id)) {
    return res
      .status(403)
      .json({ error: "User is forbidden to perform action" });
  }
  if (acting.role !== "admin" && role) {
    return res.status(403).json({ error: "Only admin users can change role" });
  }

  const fields = [];
  const values = [];

  if (password) {
    fields.push("password_hash = ?");
    values.push(await bcrypt.hash(password, 10));
  }
  if (role && acting.role === "admin") {
    fields.push("role = ?");
    values.push(role);
  }

  if (fields.length === 0) {
    return res.status(400).json({ error: "No changes were made" });
  }

  values.push(id);
  await db.run(`UPDATE users SET ${fields.join(", ")} WHERE id = ?`, values);
  res.json({ ok: true });
});

app.delete("/api/users/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const acting = req.session.user;

  if (acting.role !== "admin" && acting.id !== Number(id)) {
    return res
      .status(403)
      .json({ error: "User is forbidden to perform action" });
  }

  // Remove files on disk
  const files = await db.all("SELECT stored_name FROM audio WHERE user_id= ?", [
    id,
  ]);

  for (const f of files) {
    const p = path.join(uploadDir, f.stored_name);
    if (fs.existsSync(p)) {
      fs.unlinkSync(p);
    }
  }

  await db.run("DELETE FROM users WHERE id = ?", [id]);
  res.json({ ok: true });
});

//upload APIs
app.post(
  "/api/audio",
  requireAuth,
  upload.single("file"),
  async (req, res) => {
    const { description = "", category = "General" } = req.body;
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded!" });
    }
    if (file.size > 1024 * 1024 * 1024) {
      return res.status(400).json({ error: "File size exceeded 1GB!" });
    }
    await db.run(
      `INSERT INTO audio (user_id, original_name, stored_name, mime_type, size_bytes, description, category) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        req.session.user.id,
        file.originalname,
        file.filename,
        file.mimetype,
        file.size,
        description,
        category,
      ]
    );
    res.status(201).json({ ok: true });
  }
);

app.get("/api/audio", requireAuth, async (req, res) => {
  const rows = await db.all(
    "SELECT id, original_name, mime_type, size_bytes, description, category, datetime(created_at, '+8 hours') AS created_at FROM audio WHERE user_id = ? ORDER BY created_at DESC",
    [req.session.user.id]
  );
  res.json({ files: rows });
});

app.get("/api/audio/:id/play", requireAuth, async (req, res) => {
  const row = await db.get("SELECT * FROM audio WHERE id = ? AND user_id = ?", [
    req.params.id,
    req.session.user.id,
  ]);
  if (!row) {
    return res.status(404).json({ error: "Not found!" });
  }

  const filePath = path.join(uploadDir, row.stored_name);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "File not found!" });
  }

  const stat = fs.statSync(filePath);
  const range = req.headers.range;
  const contentType =
    row.mime_type || mime.getType(filePath) || "application/octet-stream";

  if (!range) {
    res.writeHead(200, {
      "Content-Length": stat.size,
      "Content-Type": contentType,
    });
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  const parts = range.replace(/bytes=/, "").split("-");
  const start = parseInt(parts[0], 10);
  const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
  const chunkSize = end - start + 1;
  const stream = fs.createReadStream(filePath, { start, end });
  res.writeHead(206, {
    "Content-Range": `bytes ${start}-${end}/${stat.size}`,
    "Accept-Ranges": "bytes",
    "Content-Length": chunkSize,
    "Content-Type": contentType,
  });
  stream.pipe(res);
});

app.listen(PORT, () => {
  console.log(`Backend server started on http://localhost:${PORT}`);
});
