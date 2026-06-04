# 🔒 MALVIN C VPN — WhatsApp MD Bot
### Powered by Handsome Tech Zimbabwe 🇿🇼

---

## 📋 Requirements
- Node.js v18+
- npm
- A WhatsApp number

---

## 🚀 Setup (Termux / Linux / VPS)

## ✅ 1. Download Zip File 

### 2. Extract the zip
```bash
unzip malvin-c-vpn.zip
cd malvin-c-vpn
```

### 3. Install dependencies
```bash
npm install
```

### 4. Start the pairing website
```bash
node src/web.js
```

### 5. Open the site
- **Local:** http://localhost:3000
- **Termux:** Open browser → http://localhost:3000
- **VPS:** http://YOUR_SERVER_IP:3000

### 6. Pair your number
1. Enter your WhatsApp number with country code (e.g. `263771234567`)
2. Click **GENERATE PAIRING CODE**
3. Open WhatsApp → Settings → Linked Devices
4. Tap "Link a Device" → "Link with phone number instead"
5. Enter the code shown on screen

### 7. Start the bot
```bash
node src/index.js
```

---

## 💬 Commands (126 total)

| Category | Commands |
|----------|----------|
| 📥 Downloads | .play .video .ytmp3 .ytmp4 .tiktok .insta .twitter .facebook |
| 🎮 Games | .dice .rps .slots .blackjack .trivia .quiz .hangman .roulette |
| 💰 Economy | .balance .daily .work .mine .fish .hunt .farm .gamble .rob |
| 🛠️ Tools | .sticker .translate .weather .calc .qr .wiki .base64 |
| 😂 Fun | .joke .fact .quote .roast .8ball .truth .dare |
| 👥 Group | .kick .add .promote .demote .mute .warn .tagall |
| ℹ️ Info | .menu .ping .alive .info .uptime .owner |

Type **.menu** in WhatsApp to see all 126 commands.

---

## ⚙️ Optional APIs (configure for full download support)

Edit `src/commands.js` to add:
- **YouTube downloads:** ytdl-core already included
- **Weather:** OpenWeatherMap API key
- **Translate:** Google Translate API key
- **TikTok/Instagram:** Add API endpoint

---

## 🏢 Credits
- Bot: **Malvin C Vpn**
- Dev: **Malvin C**
- Powered by: **Handsome tech**
- Library: [@whiskeysockets/baileys](https://github.com/WhiskeySockets/Baileys)

