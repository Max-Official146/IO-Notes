import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

/* ---------------- CONFIG ---------------- */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 8080); // ✅ FIXED
const HOST = process.env.HOST || "0.0.0.0";

const DATA_DIR = path.join(__dirname, "data"); // ✅ FIXED PATH
const USERS_FILE = path.join(DATA_DIR, "users.json");
const NOTES_FILE = path.join(DATA_DIR, "notes.json");

const TOKEN_SECRET =
  process.env.TOKEN_SECRET || "dev-secret-change-me";

/* ---------------- INIT ---------------- */

ensureFile(USERS_FILE, []);
ensureFile(NOTES_FILE, []);

/* ---------------- HELPERS ---------------- */

function ensureFile(filePath, initialValue) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(
      filePath,
      JSON.stringify(initialValue, null, 2)
    );
  }
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function writeJson(filePath, value) {
  fs.writeFileSync(
    filePath,
    JSON.stringify(value, null, 2)
  );
}

function sendJson(res, status, body) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization",
    "Access-Control-Allow-Methods":
      "GET, POST, OPTIONS",
  });

  res.end(JSON.stringify(body));
}

/* ---------------- BODY PARSER ---------------- */

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";

    req.on("data", (chunk) => {
      raw += chunk;

      if (raw.length > 15 * 1024 * 1024) {
        reject(new Error("Payload too large"));
        req.destroy(); // ✅ STOP REQUEST
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

/* ---------------- AUTH ---------------- */

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto
    .pbkdf2Sync(password, salt, 100000, 64, "sha512")
    .toString("hex");

  return `${salt}:${hash}`;
}

function verifyPassword(password, hashed) {
  const [salt, expected] = hashed.split(":");

  if (!salt || !expected) return false;

  const computed = crypto
    .pbkdf2Sync(password, salt, 100000, 64, "sha512")
    .toString("hex");

  return crypto.timingSafeEqual(
    Buffer.from(computed, "hex"),
    Buffer.from(expected, "hex")
  );
}

/* ---------------- TOKEN ---------------- */

function createToken(payload) {
  const data = {
    ...payload,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // ✅ 7 days
  };

  const body = Buffer.from(JSON.stringify(data)).toString("base64url");

  const sig = crypto
    .createHmac("sha256", TOKEN_SECRET)
    .update(body)
    .digest("base64url");

  return `${body}.${sig}`;
}

function parseToken(token) {
  const [body, sig] = token.split(".");

  if (!body || !sig) return null;

  const expected = crypto
    .createHmac("sha256", TOKEN_SECRET)
    .update(body)
    .digest("base64url");

  if (sig !== expected) return null;

  try {
    const data = JSON.parse(
      Buffer.from(body, "base64url").toString()
    );

    if (data.exp && Date.now() > data.exp) return null;

    return data;
  } catch {
    return null;
  }
}

function getUser(req) {
  const header = req.headers.authorization || "";

  if (!header.startsWith("Bearer ")) return null;

  return parseToken(header.slice(7));
}

/* ---------------- SERVER ---------------- */

const server = http.createServer(async (req, res) => {
  /* ---------- CORS ---------- */

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization",
      "Access-Control-Allow-Methods":
        "GET, POST, OPTIONS",
    });

    res.end();
    return;
  }

  /* ---------- HEALTH ---------- */

  if (req.method === "GET" && req.url === "/api/health") {
    sendJson(res, 200, { ok: true });
    return;
  }

  try {
    /* ---------- SIGNUP ---------- */

    if (req.method === "POST" && req.url === "/api/auth/signup") {
      const { email, password } = await parseBody(req);

      if (!email || !password || password.length < 6) {
        sendJson(res, 400, {
          error: "Invalid email or password",
        });
        return;
      }

      const users = readJson(USERS_FILE);

      const norm = String(email).toLowerCase().trim();

      if (users.some((u) => u.email === norm)) {
        sendJson(res, 409, {
          error: "Email exists",
        });
        return;
      }

      const user = {
        id: crypto.randomUUID(),
        email: norm,
        passwordHash: hashPassword(password),
        createdAt: Date.now(),
      };

      users.push(user);
      writeJson(USERS_FILE, users);

      const token = createToken({
        id: user.id,
        email: user.email,
      });

      sendJson(res, 201, {
        token,
        user: { id: user.id, email: user.email },
      });

      return;
    }

    /* ---------- SIGNIN ---------- */

    if (req.method === "POST" && req.url === "/api/auth/signin") {
      const { email, password } = await parseBody(req);

      const users = readJson(USERS_FILE);

      const user = users.find(
        (u) => u.email === String(email).toLowerCase().trim()
      );

      if (!user || !verifyPassword(password || "", user.passwordHash)) {
        sendJson(res, 401, {
          error: "Invalid credentials",
        });
        return;
      }

      const token = createToken({
        id: user.id,
        email: user.email,
      });

      sendJson(res, 200, {
        token,
        user: { id: user.id, email: user.email },
      });

      return;
    }

    /* ---------- NOTES ---------- */

    if (req.url === "/api/notes") {
      const user = getUser(req);

      if (!user) {
        sendJson(res, 401, { error: "Unauthorized" });
        return;
      }

      /* GET NOTES */

      if (req.method === "GET") {
        const notes = readJson(NOTES_FILE)
          .filter((n) => n.userId === user.id)
          .sort((a, b) => b.createdAt - a.createdAt);

        sendJson(res, 200, { notes });
        return;
      }

      /* CREATE NOTE */

      if (req.method === "POST") {
        const { title, imageData } = await parseBody(req);

        if (!imageData) {
          sendJson(res, 400, {
            error: "imageData required",
          });
          return;
        }

        const notes = readJson(NOTES_FILE);

        const note = {
          id: crypto.randomUUID(),
          userId: user.id,
          title: (title || "Untitled").trim() || "Untitled",
          imageData,
          createdAt: Date.now(),
        };

        notes.push(note);

        writeJson(NOTES_FILE, notes);

        sendJson(res, 201, { note });
        return;
      }
    }

    /* ---------- FALLBACK ---------- */

    sendJson(res, 404, { error: "Not found" });
  } catch (err) {
    sendJson(res, 500, {
      error: err.message || "Server error",
    });
  }
});

/* ---------------- START ---------------- */

server.listen(PORT, HOST, () => {
  console.log(`✅ Backend running on http://${HOST}:${PORT}`);
});
