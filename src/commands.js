// ============================================
// MALVIN C VPN - 126 Commands Handler
// Powered by Handsome Tech Zimbabwe
// ============================================

const axios = require("axios");

const BOT_NAME = "Malvin C Vpn";
const FOOTER = "\n\n> 🔒 *Malvin C Vpn* | Powered by *Handsome Tech Zimbabwe*";

// ── helpers ──────────────────────────────────
async function reply(ctx, text) {
  await ctx.sock.sendMessage(ctx.from, { text: text + FOOTER }, { quoted: ctx.msg });
}

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

// ── Economy Store (in-memory, resets on restart) ──
const economy = {};
function getUser(jid) {
  if (!economy[jid]) economy[jid] = { balance: 500, bank: 0, inventory: [], job: null, level: 1, xp: 0 };
  return economy[jid];
}
function addXp(jid, amt) {
  const u = getUser(jid);
  u.xp += amt;
  if (u.xp >= u.level * 100) { u.level++; u.xp = 0; return true; }
  return false;
}

// ── Command Map ──────────────────────────────
const commandList = {
  // ── INFO ─────────────────────────────────────
  menu: async (ctx) => {
    const menu = `╔══════════════════════════════╗
║   🔒 *MALVIN C VPN BOT*        ║
║   Powered by Handsome Tech ZW ║
╚══════════════════════════════╝

📋 *GENERAL*
.menu .ping .info .help .alive
.owner .uptime .runtime .botname
.source .version .donate .rules
.support .speed .report

📥 *DOWNLOADS*
.play .video .audio .ytmp3 .ytmp4
.tiktok .insta .twitter .facebook
.apk .file .search .lyrics .image

🎮 *GAMES*
.tictactoe .rps .guess .dice
.flip .trivia .quiz .math .word
.hangman .slots .blackjack .roulette
.8ball .truth .dare .neverhaveiever

💰 *ECONOMY*
.balance .daily .work .rob .pay
.deposit .withdraw .shop .buy
.inventory .sell .profile .leaderboard
.gamble .mine .fish .hunt .farm
.crime .beg .level .xp .bank

🛠️ *TOOLS*
.sticker .toimg .tomp4 .resize
.brightness .reverse .blur .crop
.read .translate .weather .time
.date .calc .qr .short .ip
.base64 .encode .decode .wiki

😂 *FUN*
.joke .meme .fact .quote .roast
.compliment .ship .rate .rank
.waifu .neko .hug .pat .slap
.kiss .cuddle .kill .punch .poke

👥 *GROUP*
.kick .add .promote .demote .mute
.unmute .leave .link .revoke .warn
.warnings .resetwarn .ban .unban
.groupinfo .members .admins .announce

🔞 *SOCIAL*
.pp .bio .status .tag .tagall

.help [command] for details`;
    await reply(ctx, menu);
  },

  ping: async (ctx) => { const s = Date.now(); await reply(ctx, `🏓 Pong! *${Date.now() - s}ms*`); },
  alive: async (ctx) => { await reply(ctx, `✅ *${BOT_NAME}* is alive and running!\n🇿🇼 Handsome Tech Zimbabwe`); },
  info: async (ctx) => {
    await reply(ctx, `╔═══════════════════╗
║  *BOT INFORMATION*  ║
╚═══════════════════╝
🤖 Name: *${BOT_NAME}*
🏷️ Version: *1.0.0*
🌍 Origin: *Zimbabwe*
🏢 Dev: *Handsome Tech ZW*
⚙️ Platform: *WhatsApp MD*
📦 Library: *Baileys 6.x*
📋 Commands: *126*`);
  },
  help: async (ctx) => {
    const cmd = ctx.args[0];
    if (!cmd) return reply(ctx, "ℹ️ Type *.menu* to see all commands.\nType *.help [command]* for help on a specific command.");
    if (commandList[cmd]) return reply(ctx, `📖 *Help: .${cmd}*\n\nCommand exists and is functional. Use it in chat.`);
    return reply(ctx, `❌ Command *.${cmd}* not found.`);
  },
  owner: async (ctx) => { await reply(ctx, "👑 *Bot Owner*\nHandsome Tech Zimbabwe\n📍 Harare, Zimbabwe\n🌐 Powered by Malvin C Vpn"); },
  uptime: async (ctx) => {
    const s = process.uptime();
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = Math.floor(s % 60);
    await reply(ctx, `⏱️ Uptime: *${h}h ${m}m ${sec}s*`);
  },
  runtime: async (ctx) => { const s = process.uptime(); await reply(ctx, `🕐 Runtime: *${Math.floor(s)}s*`); },
  botname: async (ctx) => { await reply(ctx, `🤖 Bot Name: *${BOT_NAME}*`); },
  source: async (ctx) => { await reply(ctx, "💻 Source: *Handsome Tech Zimbabwe*\n📦 Built with Baileys + Node.js"); },
  version: async (ctx) => { await reply(ctx, "🔢 Version: *1.0.0*\n📅 Updated: 2025"); },
  donate: async (ctx) => { await reply(ctx, "💸 *Support Handsome Tech Zimbabwe*\n\nYour support keeps this bot running!"); },
  rules: async (ctx) => {
    await reply(ctx, `📜 *BOT RULES*\n1. No spam\n2. Respect others\n3. No illegal requests\n4. Bot is for entertainment\n5. Enjoy & have fun!`);
  },
  support: async (ctx) => { await reply(ctx, "🛠️ *Support*\nContact Handsome Tech Zimbabwe for help."); },
  speed: async (ctx) => { const t = Date.now(); await reply(ctx, `⚡ Speed: *${Date.now() - t}ms*`); },
  report: async (ctx) => { await reply(ctx, "🐛 *Report a bug*\nContact Handsome Tech Zimbabwe with details."); },

  // ── DOWNLOADS ────────────────────────────────
  play: async (ctx) => {
    if (!ctx.args.length) return reply(ctx, "🎵 Usage: *.play [song name]*\nExample: *.play Jerusalema*");
    await reply(ctx, `🎵 Searching for: *${ctx.args.join(" ")}*\n\n⚠️ Note: Install ytdl-core & ffmpeg for real downloads.\nThis is a demo response.`);
  },
  video: async (ctx) => {
    if (!ctx.args.length) return reply(ctx, "🎬 Usage: *.video [title]*");
    await reply(ctx, `🎬 Searching video: *${ctx.args.join(" ")}*\n\n⚠️ Requires ytdl-core configured.`);
  },
  audio: async (ctx) => {
    if (!ctx.args.length) return reply(ctx, "🔊 Usage: *.audio [name]*");
    await reply(ctx, `🔊 Audio: *${ctx.args.join(" ")}*\n⚠️ Configure ytdl-core for downloads.`);
  },
  ytmp3: async (ctx) => {
    if (!ctx.args[0]) return reply(ctx, "🎵 Usage: *.ytmp3 [YouTube URL]*");
    await reply(ctx, `🎵 Converting to MP3: ${ctx.args[0]}\n⚠️ Configure ytdl-core.`);
  },
  ytmp4: async (ctx) => {
    if (!ctx.args[0]) return reply(ctx, "🎬 Usage: *.ytmp4 [YouTube URL]*");
    await reply(ctx, `🎬 Converting to MP4: ${ctx.args[0]}\n⚠️ Configure ytdl-core.`);
  },
  tiktok: async (ctx) => {
    if (!ctx.args[0]) return reply(ctx, "🎵 Usage: *.tiktok [TikTok URL]*");
    await reply(ctx, `🎵 Downloading TikTok: ${ctx.args[0]}\n⚠️ Configure TikTok API.`);
  },
  insta: async (ctx) => {
    if (!ctx.args[0]) return reply(ctx, "📸 Usage: *.insta [Instagram URL]*");
    await reply(ctx, `📸 Downloading Instagram media: ${ctx.args[0]}\n⚠️ Configure API.`);
  },
  twitter: async (ctx) => {
    if (!ctx.args[0]) return reply(ctx, "🐦 Usage: *.twitter [tweet URL]*");
    await reply(ctx, `🐦 Downloading tweet media: ${ctx.args[0]}\n⚠️ Configure API.`);
  },
  facebook: async (ctx) => {
    if (!ctx.args[0]) return reply(ctx, "📘 Usage: *.facebook [FB URL]*");
    await reply(ctx, `📘 Downloading Facebook media: ${ctx.args[0]}\n⚠️ Configure API.`);
  },
  apk: async (ctx) => {
    if (!ctx.args.length) return reply(ctx, "📦 Usage: *.apk [app name]*");
    await reply(ctx, `📦 Searching APK: *${ctx.args.join(" ")}*\n⚠️ Configure APK source API.`);
  },
  file: async (ctx) => { await reply(ctx, "📁 Usage: *.file [name]*\nSearch for files."); },
  search: async (ctx) => {
    if (!ctx.args.length) return reply(ctx, "🔍 Usage: *.search [query]*");
    await reply(ctx, `🔍 Searching: *${ctx.args.join(" ")}*\n⚠️ Configure Google API key.`);
  },
  lyrics: async (ctx) => {
    if (!ctx.args.length) return reply(ctx, "🎤 Usage: *.lyrics [song name]*");
    await reply(ctx, `🎤 Searching lyrics: *${ctx.args.join(" ")}*\n⚠️ Configure lyrics API.`);
  },
  image: async (ctx) => {
    if (!ctx.args.length) return reply(ctx, "🖼️ Usage: *.image [query]*");
    await reply(ctx, `🖼️ Searching image: *${ctx.args.join(" ")}*\n⚠️ Configure image search API.`);
  },

  // ── GAMES ────────────────────────────────────
  dice: async (ctx) => {
    const roll = randInt(1, 6);
    const faces = ["⚀","⚁","⚂","⚃","⚄","⚅"];
    await reply(ctx, `🎲 You rolled: *${faces[roll-1]} ${roll}*`);
  },
  flip: async (ctx) => {
    await reply(ctx, `🪙 Coin flip: *${rand(["Heads","Tails"])}*`);
  },
  rps: async (ctx) => {
    const choices = ["rock","paper","scissors"];
    const bot = rand(choices);
    const user = ctx.args[0]?.toLowerCase();
    if (!choices.includes(user)) return reply(ctx, "✊ Usage: *.rps rock|paper|scissors*");
    const wins = { rock: "scissors", paper: "rock", scissors: "paper" };
    const result = wins[user] === bot ? "🏆 You WIN!" : user === bot ? "🤝 Draw!" : "😈 Bot WINS!";
    await reply(ctx, `✊ You: *${user}*\n🤖 Bot: *${bot}*\n${result}`);
  },
  guess: async (ctx) => {
    const n = randInt(1, 10);
    const g = parseInt(ctx.args[0]);
    if (isNaN(g)) return reply(ctx, "🔢 Usage: *.guess [1-10]*");
    await reply(ctx, g === n ? `✅ Correct! The number was *${n}*! 🎉` : `❌ Wrong! The number was *${n}*`);
  },
  trivia: async (ctx) => {
    const questions = [
      { q: "What is the capital of Zimbabwe?", a: "harare" },
      { q: "How many sides does a hexagon have?", a: "6" },
      { q: "What planet is closest to the sun?", a: "mercury" },
      { q: "What is 2+2?", a: "4" },
    ];
    const q = rand(questions);
    await reply(ctx, `❓ *TRIVIA*\n${q.q}\n\n_(Reply with .answer [your answer])_\nHint answer starts with: *${q.a[0]}*`);
  },
  quiz: async (ctx) => {
    const quizzes = ["🌍 Africa has ___ countries. (A) 54 (B) 43 (C) 60", "💻 HTML stands for? (A) HyperText (B) HighText", "🔢 √144 = ? (A) 11 (B) 12 (C) 13"];
    await reply(ctx, `📝 *QUIZ*\n${rand(quizzes)}\n\nReply *.answer A/B/C*`);
  },
  math: async (ctx) => {
    const a = randInt(1, 50), b = randInt(1, 50);
    const ops = ["+", "-", "*"];
    const op = rand(ops);
    const ans = op === "+" ? a+b : op === "-" ? a-b : a*b;
    await reply(ctx, `🧮 *MATH CHALLENGE*\n${a} ${op} ${b} = ?\n\n_(Correct answer: *${ans}*)_`);
  },
  word: async (ctx) => {
    const words = ["JAVASCRIPT","ZIMBABWE","WHATSAPP","TECHNOLOGY","HANDSOME"];
    const w = rand(words);
    const scrambled = w.split("").sort(() => 0.5-Math.random()).join("");
    await reply(ctx, `🔤 *WORD SCRAMBLE*\nUnscramble: *${scrambled}*\n\n_(Hint: it has ${w.length} letters)_`);
  },
  hangman: async (ctx) => {
    const words = ["ELEPHANT","COMPUTER","ZEBRA","VICTORIA","HARARE"];
    const w = rand(words);
    const hidden = w.replace(/./g, "_ ");
    await reply(ctx, `🪢 *HANGMAN*\nWord: ${hidden}\nLetters: ${w.length}\n\nGuess with *.letter [A-Z]*`);
  },
  slots: async (ctx) => {
    const s = ["🍒","🍊","🍋","🔔","💎","⭐","🎰"];
    const r = [rand(s), rand(s), rand(s)];
    const win = r[0]===r[1] && r[1]===r[2];
    await reply(ctx, `🎰 *SLOTS*\n${r.join(" | ")}\n${win ? "🏆 JACKPOT! You WIN!" : "😔 Better luck next time!"}`);
  },
  blackjack: async (ctx) => {
    const user = randInt(14,21), bot2 = randInt(14,21);
    const res = user > bot2 ? "🏆 You WIN!" : user === bot2 ? "🤝 Draw!" : "😈 House WINS!";
    await reply(ctx, `🃏 *BLACKJACK*\nYour hand: *${user}*\nDealer: *${bot2}*\n${res}`);
  },
  roulette: async (ctx) => {
    const n = randInt(0,36);
    const color = n===0?"green":n%2===0?"red":"black";
    await reply(ctx, `🎡 *ROULETTE*\nBall lands on: *${n}* (${color})`);
  },
  "8ball": async (ctx) => {
    const answers = ["It is certain","Without a doubt","Yes definitely","Most likely","Outlook good","Cannot predict now","Don't count on it","Very doubtful","My reply is no","Outlook not so good"];
    const q = ctx.args.join(" ");
    if (!q) return reply(ctx, "🎱 Usage: *.8ball [question]*");
    await reply(ctx, `🎱 *Magic 8-Ball*\nQ: ${q}\nA: *${rand(answers)}*`);
  },
  truth: async (ctx) => {
    const truths = ["What is your biggest fear?","What is the most embarrassing thing you've done?","Do you have a secret crush?","What's a lie you told and got away with?","What's your biggest regret?"];
    await reply(ctx, `💬 *TRUTH*\n${rand(truths)}`);
  },
  dare: async (ctx) => {
    const dares = ["Send a selfie right now","Say something nice about everyone here","Change your status to 'I love bots'","Call someone and sing Happy Birthday","Text your last contact a random emoji"];
    await reply(ctx, `🔥 *DARE*\n${rand(dares)}`);
  },
  neverhaveiever: async (ctx) => {
    const items = ["Never have I ever lied to get out of trouble","Never have I ever eaten food off the floor","Never have I ever pretended to be sick","Never have I ever sent a text to the wrong person"];
    await reply(ctx, `🙈 *Never Have I Ever*\n${rand(items)}`);
  },
  tictactoe: async (ctx) => { await reply(ctx, "❌⭕ *TicTacToe*\nMultiplayer coming soon!\nChallenge friends in your group."); },

  // ── ECONOMY ──────────────────────────────────
  balance: async (ctx) => {
    const u = getUser(ctx.from);
    await reply(ctx, `💰 *Your Balance*\n💵 Wallet: *$${u.balance}*\n🏦 Bank: *$${u.bank}*\n⭐ Level: *${u.level}*`);
  },
  daily: async (ctx) => {
    const u = getUser(ctx.from);
    const reward = randInt(100, 500);
    u.balance += reward;
    addXp(ctx.from, 20);
    await reply(ctx, `🎁 *Daily Reward*\nYou received: *$${reward}*\n💰 Balance: *$${u.balance}*`);
  },
  work: async (ctx) => {
    const u = getUser(ctx.from);
    const jobs = ["developer","teacher","farmer","miner","trader"];
    const pay = randInt(50,200);
    u.balance += pay;
    addXp(ctx.from, 10);
    await reply(ctx, `💼 You worked as a *${rand(jobs)}* and earned *$${pay}*\n💰 Balance: *$${u.balance}*`);
  },
  rob: async (ctx) => {
    const u = getUser(ctx.from);
    const success = Math.random() > 0.5;
    if (success) {
      const loot = randInt(10, 100);
      u.balance += loot;
      await reply(ctx, `🦹 *Rob Successful!* You stole *$${loot}*\n💰 Balance: *$${u.balance}*`);
    } else {
      const fine = randInt(20, 80);
      u.balance = Math.max(0, u.balance - fine);
      await reply(ctx, `👮 *Caught!* You were fined *$${fine}*\n💰 Balance: *$${u.balance}*`);
    }
  },
  pay: async (ctx) => {
    const u = getUser(ctx.from);
    const amt = parseInt(ctx.args[0]);
    if (!amt || amt <= 0) return reply(ctx, "💸 Usage: *.pay [amount]*");
    if (u.balance < amt) return reply(ctx, "❌ Insufficient balance!");
    u.balance -= amt;
    await reply(ctx, `💸 Paid *$${amt}*\n💰 Remaining: *$${u.balance}*`);
  },
  deposit: async (ctx) => {
    const u = getUser(ctx.from);
    const amt = parseInt(ctx.args[0]);
    if (!amt || amt <= 0) return reply(ctx, "🏦 Usage: *.deposit [amount]*");
    if (u.balance < amt) return reply(ctx, "❌ Not enough in wallet!");
    u.balance -= amt; u.bank += amt;
    await reply(ctx, `🏦 Deposited *$${amt}*\n🏦 Bank: *$${u.bank}*`);
  },
  withdraw: async (ctx) => {
    const u = getUser(ctx.from);
    const amt = parseInt(ctx.args[0]);
    if (!amt || amt <= 0) return reply(ctx, "💵 Usage: *.withdraw [amount]*");
    if (u.bank < amt) return reply(ctx, "❌ Not enough in bank!");
    u.bank -= amt; u.balance += amt;
    await reply(ctx, `💵 Withdrew *$${amt}*\n💰 Wallet: *$${u.balance}*`);
  },
  shop: async (ctx) => {
    await reply(ctx, `🏪 *SHOP*\n1. VPN Pass - $200\n2. Lucky Charm - $150\n3. Fishing Rod - $100\n4. Mining Pick - $120\n5. Farm Seeds - $80\n\nBuy with *.buy [item number]*`);
  },
  buy: async (ctx) => {
    const items = { "1":"VPN Pass","2":"Lucky Charm","3":"Fishing Rod","4":"Mining Pick","5":"Farm Seeds" };
    const prices = { "1":200,"2":150,"3":100,"4":120,"5":80 };
    const id = ctx.args[0];
    if (!items[id]) return reply(ctx, "❌ Invalid item. Check *.shop*");
    const u = getUser(ctx.from);
    if (u.balance < prices[id]) return reply(ctx, `❌ Need $${prices[id]}. You have $${u.balance}`);
    u.balance -= prices[id];
    u.inventory.push(items[id]);
    await reply(ctx, `✅ Bought *${items[id]}* for *$${prices[id]}*\n💰 Balance: *$${u.balance}*`);
  },
  inventory: async (ctx) => {
    const u = getUser(ctx.from);
    const inv = u.inventory.length ? u.inventory.join(", ") : "Empty";
    await reply(ctx, `🎒 *Your Inventory*\n${inv}`);
  },
  sell: async (ctx) => {
    const u = getUser(ctx.from);
    if (!u.inventory.length) return reply(ctx, "🎒 Your inventory is empty!");
    const item = u.inventory.pop();
    const earn = randInt(20, 80);
    u.balance += earn;
    await reply(ctx, `💰 Sold *${item}* for *$${earn}*\n💰 Balance: *$${u.balance}*`);
  },
  profile: async (ctx) => {
    const u = getUser(ctx.from);
    await reply(ctx, `👤 *Your Profile*\n💰 Wallet: $${u.balance}\n🏦 Bank: $${u.bank}\n⭐ Level: ${u.level}\n✨ XP: ${u.xp}/${u.level*100}\n🎒 Items: ${u.inventory.length}`);
  },
  leaderboard: async (ctx) => {
    const entries = Object.entries(economy).sort((a,b) => (b[1].balance+b[1].bank)-(a[1].balance+a[1].bank)).slice(0,5);
    const lb = entries.map((e,i) => `${i+1}. ...${e[0].slice(-6)}: $${e[1].balance+e[1].bank}`).join("\n") || "No data yet";
    await reply(ctx, `🏆 *LEADERBOARD*\n${lb}`);
  },
  gamble: async (ctx) => {
    const u = getUser(ctx.from);
    const amt = parseInt(ctx.args[0]);
    if (!amt || amt <= 0) return reply(ctx, "🎲 Usage: *.gamble [amount]*");
    if (u.balance < amt) return reply(ctx, "❌ Not enough balance!");
    const win = Math.random() > 0.5;
    win ? u.balance += amt : u.balance -= amt;
    await reply(ctx, `🎲 You ${win?"WON":"LOST"} *$${amt}*!\n💰 Balance: *$${u.balance}*`);
  },
  mine: async (ctx) => {
    const u = getUser(ctx.from);
    const earn = randInt(30,120);
    u.balance += earn;
    addXp(ctx.from, 5);
    const finds = ["Coal","Iron","Gold","Diamond","Emerald"];
    await reply(ctx, `⛏️ You mined *${rand(finds)}* and earned *$${earn}*\n💰 Balance: *$${u.balance}*`);
  },
  fish: async (ctx) => {
    const u = getUser(ctx.from);
    const earn = randInt(20,80);
    u.balance += earn;
    addXp(ctx.from, 5);
    const catches = ["Tilapia","Catfish","Bream","Bass","Carp"];
    await reply(ctx, `🎣 You caught *${rand(catches)}* worth *$${earn}*\n💰 Balance: *$${u.balance}*`);
  },
  hunt: async (ctx) => {
    const u = getUser(ctx.from);
    const earn = randInt(40,150);
    u.balance += earn;
    const animals = ["Rabbit","Deer","Wild Turkey","Boar"];
    await reply(ctx, `🏹 You hunted a *${rand(animals)}* worth *$${earn}*\n💰 Balance: *$${u.balance}*`);
  },
  farm: async (ctx) => {
    const u = getUser(ctx.from);
    const earn = randInt(25,100);
    u.balance += earn;
    const crops = ["Maize","Tomatoes","Potatoes","Tobacco","Cotton"];
    await reply(ctx, `🌾 You farmed *${rand(crops)}* and earned *$${earn}*\n💰 Balance: *$${u.balance}*`);
  },
  crime: async (ctx) => {
    const u = getUser(ctx.from);
    const success = Math.random() > 0.4;
    const amt = randInt(50,200);
    success ? u.balance += amt : u.balance = Math.max(0, u.balance - amt);
    await reply(ctx, `🦹 Crime ${success?"succeeded":"failed"}! You ${success?"gained":"lost"} *$${amt}*\n💰 Balance: *$${u.balance}*`);
  },
  beg: async (ctx) => {
    const u = getUser(ctx.from);
    const earn = randInt(1,30);
    u.balance += earn;
    const msgs = ["A kind stranger gave you","The bot felt sorry and gave you","You found on the street","Someone dropped"];
    await reply(ctx, `🙏 ${rand(msgs)} *$${earn}*\n💰 Balance: *$${u.balance}*`);
  },
  level: async (ctx) => { const u = getUser(ctx.from); await reply(ctx, `⭐ Level: *${u.level}*\n✨ XP: *${u.xp}/${u.level*100}*`); },
  xp: async (ctx) => { const u = getUser(ctx.from); await reply(ctx, `✨ Your XP: *${u.xp}*\n⭐ Level: *${u.level}*`); },
  bank: async (ctx) => { const u = getUser(ctx.from); await reply(ctx, `🏦 Bank Balance: *$${u.bank}*`); },

  // ── TOOLS ────────────────────────────────────
  sticker: async (ctx) => { await reply(ctx, "🎭 *Sticker*\nReply to an image with *.sticker* to convert."); },
  toimg: async (ctx) => { await reply(ctx, "🖼️ Reply to a sticker with *.toimg* to convert."); },
  tomp4: async (ctx) => { await reply(ctx, "🎬 Reply to a GIF with *.tomp4* to convert."); },
  resize: async (ctx) => { await reply(ctx, "📐 Reply to an image with *.resize [width] [height]*"); },
  brightness: async (ctx) => { await reply(ctx, "☀️ Reply to an image with *.brightness [1-10]*"); },
  reverse: async (ctx) => { await reply(ctx, "🔄 Reply to audio/video with *.
