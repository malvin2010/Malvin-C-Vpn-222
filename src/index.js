const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  isJidBroadcast,
} = require("@whiskeysockets/baileys");
const pino = require("pino");
const path = require("path");
const fs = require("fs-extra");
const commands = require("./commands");

const SESSION_DIR = path.join(__dirname, "../sessions/bot");

async function startBot() {
  fs.ensureDirSync(SESSION_DIR);

  const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);
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
    getMessage: async () => ({ conversation: "" }),
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", ({ connection, lastDisconnect, qr }) => {
    if (qr) {
      console.log("QR Code received - scan via pairing site");
    }
    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log("Connection closed. Reconnecting:", shouldReconnect);
      if (shouldReconnect) setTimeout(startBot, 3000);
    } else if (connection === "open") {
      console.log("✅ Malvin C Vpn connected to WhatsApp!");
    }
  });

  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify") return;

    for (const msg of messages) {
      if (!msg.message || msg.key.fromMe) continue;
      if (isJidBroadcast(msg.key.remoteJid)) continue;

      const from = msg.key.remoteJid;
      const isGroup = from.endsWith("@g.us");
      const body =
        msg.message?.conversation ||
        msg.message?.extendedTextMessage?.text ||
        msg.message?.imageMessage?.caption ||
        msg.message?.videoMessage?.caption ||
        "";

      const prefix = ".";
      if (!body.startsWith(prefix)) continue;

      const args = body.slice(prefix.length).trim().split(/\s+/);
      const command = args.shift().toLowerCase();

      const ctx = { sock, msg, from, isGroup, args, body };

      try {
        await commands.handle(ctx, command);
      } catch (e) {
        console.error("Command error:", e.message);
        await sock.sendMessage(from, {
          text: `❌ Error: ${e.message}`,
        });
      }
    }
  });

  return sock;
}

startBot();
      
