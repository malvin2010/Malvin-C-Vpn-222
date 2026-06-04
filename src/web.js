// ============================================
// MALVIN C VPN - Pairing Web Server
// Powered by Handsome Tech Zimbabwe
// ============================================

const express = require("express");
const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
} = require("@whiskeysockets/baileys");
const pino = require("pino");
const path = require("path");
const fs = require("fs-extra");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

const SESSION_BASE = path.join(__dirname, "../sessions");
fs.ensureDirSync(SESSION_BASE);

// Active pairing sessions
const pairingSessions = new Map();

// ── Pairing API ──────────────────────────────
app.post("/api/pair", async (req, res) => {
  const { phone } = req.body;
  if (!phone || !/^\d{10,15}$/.test(phone)) {
    return res.json({ success: false, error: "Invalid phone number. Use format: 263XXXXXXXXX" });
  }

  // Clean up existing session for this number
  if (pairingSessions.has(phone)) {
    try { pairingSessions.get(phone).sock?.end(); } catch {}
    pairingSessions.delete(phone);
  }

  const sessionDir = path.join(SESSION_BASE, `pair_${phone}`);
  fs.ensureDirSync(sessionDir);

  try {
    const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
      version,
      logger: pino({ level: "silent" }),
      printQRInTerminal: false,
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "silent" })),
      },
      browser: ["Malvin C Vpn", "Chrome", "1.0.0"],
    });

    sock.ev.on("creds.update", saveCreds);

    // Request pairing code
    await new Promise((resolve) => setTimeout(resolve, 2000));

    let pairingCode;
    try {
      pairingCode = await sock.requestPairingCode(phone);
    } catch (e) {
      return res.json({ success: false, error: "Could not generate pairing code. Make sure the number is active on WhatsApp." });
    }

    pairingSessions.set(phone, { sock, sessionDir, status: "pending" });

    sock.ev.on("connection.update", ({ connection }) => {
      if (connection === "open") {
        pairingSessions.set(phone, { ...pairingSessions.get(phone), status: "connected" });
        // Copy session to bot session
        const botSession = path.join(SESSION_BASE, "bot");
        fs.ensureDirSync(botSession);
        fs.copySync(sessionDir, botSession);
        console.log(`✅ ${phone} paired successfully!`);
      }
      if (connection === "close") {
        pairingSessions.set(phone, { ...pairingSessions.get(phone), status: "disconnected" });
      }
    });

    // Format code with dash
    const formatted = pairingCode.match(/.{1,4}/g)?.join("-") || pairingCode;

    res.json({ success: true, code: formatted, phone });

  } catch (err) {
    console.error("Pairing error:", err);
    res.json({ success: false, error: "Server error. Try again." });
  }
});

// Check pairing status
app.get("/api/status/:phone", (req, res) => {
  const { phone } = req.params;
  const session = pairingSessions.get(phone);
  res.json({ status: session?.status || "not_found" });
});

// Serve main page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.listen(PORT, () => {
  console.log(`\n🔒 Malvin C Vpn Pairing Site`);
  console.log(`🌍 Powered by Handsome Tech Zimbabwe`);
  console.log(`🚀 Running at http://localhost:${PORT}\n`);
});
