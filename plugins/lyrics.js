const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { cmd } = require("../command");

const CACHE_PATH = path.join(__dirname, "..", "data", "lyrics_cache.json");
fs.ensureFileSync(CACHE_PATH);
let cache = fs.readJsonSync(CACHE_PATH, { throws: false }) || {};

function saveCache() {
  fs.writeJsonSync(CACHE_PATH, cache, { spaces: 2 });
}

function generateID() {
  return Math.random().toString(36).substring(2, 10);
}

cmd({
  pattern: "lyrics",
  alias: ["lyric"],
  desc: "Get the lyrics of a song by artist and title.",
  react: "🎵",
  category: "utility",
  use: ".lyrics <artist> - <song title>",
  filename: __filename,
}, async (conn, m, msg, { args, reply }) => {
  try {
    if (!args.includes("-")) {
      return reply("❌ Format invalide.\nUtilise: `.lyrics artiste - titre de chanson`");
    }

    const delimiter = args.indexOf("-");
    const artist = args.slice(0, delimiter).join(" ").trim();
    const title = args.slice(delimiter + 1).join(" ").trim();

    if (!artist || !title) {
      return reply("❌ Veuillez spécifier à la fois l'artiste et le titre.");
    }

    reply(`🔍 Recherche des paroles de *${title}* par *${artist}*...`);

    const res = await axios.get(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`);
    const lyrics = res.data?.lyrics;

    if (!lyrics) return reply("❌ Aucune parole trouvée.");

    const id = generateID();
    cache[id] = { artist, title, lyrics };
    saveCache();

    await conn.sendMessage(msg.from, {
      text: `🎶 *Paroles trouvées !*\n\n*Titre:* ${title}\n*Artiste:* ${artist}\n\n${lyrics}`,
      footer: `ID: ${id} | Tap .lyricsid ${id} pour revoir`,
      buttons: [
        { buttonId: `.lyricsid ${id}`, buttonText: { displayText: "Copier les paroles" }, type: 1 }
      ],
      headerType: 1
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    reply("❌ Erreur lors de la récupération des paroles.");
  }
});
