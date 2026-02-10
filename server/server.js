import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const PORT = Number(process.env.PORT || 8787);
const HOST = process.env.HOST || "0.0.0.0";
const DATA_DIR = path.resolve("server/data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const NOTES_FILE = path.join(DATA_DIR, "notes.json");
const TOKEN_SECRET = process.env.TOKEN_SECRET || "dev-secret-change-me";

ensureFile(USERS_FILE, []);
ensureFile(NOTES_FILE, []);

function ensureFile(filePath, initialValue) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(initialValue, null, 2));
  }
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
}

function sendJson(res, statusCode, body) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  });
  res.end(JSON.stringify(body));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 15 * 1024 * 1024) {
        reject(new Error("Payload too large"));
      }
    });
    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, hashed) {
  const [salt, expectedHash] = hashed.split(":");
  if (!salt || !expectedHash) {
    return false;
  }
  const computed = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  return crypto.timingSafeEqual(Buffer.from(computed, "hex"), Buffer.from(expectedHash, "hex"));
}

function createToken(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", TOKEN_SECRET).update(body).digest("base64url");
  return `${body}.${signature}`;
}

function parseToken(token) {
  const [body, signature] = token.split(".");
  if (!body || !signature) {
    return null;
  }
  const expected = crypto.createHmac("sha256", TOKEN_SECRET).update(body).digest("base64url");
  if (signature !== expected) {
    return null;
  }
  try {
    return JSON.parse(Buffer.from(body, "base64url").toString("utf-8"));
  } catch {
    return null;
  }
}

function getUserFromAuthHeader(req) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  return parseToken(token);
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    sendJson(res, 200, { ok: true });
    return;
  }

  try {
    if (req.method === "POST" && req.url === "/api/auth/signup") {
      const { email, password } = await parseBody(req);
      if (!email || !password || password.length < 6) {
        sendJson(res, 400, { error: "Valid email and password (min 6 chars) are required." });
        return;
      }

      const users = readJson(USERS_FILE);
      const normalizedEmail = String(email).toLowerCase().trim();
      if (users.some((user) => user.email === normalizedEmail)) {
        sendJson(res, 409, { error: "Email already registered." });
        return;
      }

      const user = {
        id: crypto.randomUUID(),
        email: normalizedEmail,
        passwordHash: hashPassword(password),
        createdAt: Date.now(),
      };
      users.push(user);
      writeJson(USERS_FILE, users);

      const token = createToken({ id: user.id, email: user.email });
      sendJson(res, 201, { token, user: { id: user.id, email: user.email } });
      return;
    }

    if (req.method === "POST" && req.url === "/api/auth/signin") {
      const { email, password } = await parseBody(req);
      const users = readJson(USERS_FILE);
      const user = users.find((item) => item.email === String(email).toLowerCase().trim());
      if (!user || !verifyPassword(password || "", user.passwordHash)) {
        sendJson(res, 401, { error: "Invalid credentials." });
        return;
      }

      const token = createToken({ id: user.id, email: user.email });
      sendJson(res, 200, { token, user: { id: user.id, email: user.email } });
      return;
    }

    if (req.url === "/api/notes") {
      const user = getUserFromAuthHeader(req);
      if (!user) {
        sendJson(res, 401, { error: "Unauthorized" });
        return;
      }

      if (req.method === "GET") {
        const notes = readJson(NOTES_FILE)
          .filter((note) => note.userId === user.id)
          .sort((a, b) => b.createdAt - a.createdAt);
        sendJson(res, 200, { notes });
        return;
      }

      if (req.method === "POST") {
        const { title, imageData } = await parseBody(req);
        if (!imageData || typeof imageData !== "string") {
          sendJson(res, 400, { error: "imageData is required." });
          return;
        }

        const notes = readJson(NOTES_FILE);
        const note = {
          id: crypto.randomUUID(),
          userId: user.id,
          title: (title || "Untitled note").trim() || "Untitled note",
          imageData,
          createdAt: Date.now(),
        };

        notes.push(note);
        writeJson(NOTES_FILE, notes);
        sendJson(res, 201, { note });
        return;
      }
    }

    if (req.method === "GET" && req.url === "/api/health") {
      sendJson(res, 200, { ok: true });
      return;
    }

    sendJson(res, 404, { error: "Not found" });
  } catch (error) {
    sendJson(res, 500, { error: error.message || "Server error" });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Notes backend running on http://${HOST}:${PORT}`);
});
