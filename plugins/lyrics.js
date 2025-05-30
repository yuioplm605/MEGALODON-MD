const axios = require('axios');
const { cmd } = require('../command');

cmd({
  pattern: "lyrics",
  desc: "Recherche les paroles d'une chanson",
  category: "tools",
  use: ".lyrics <song name>,<nombre>",
  react: "🎵",
  filename: __filename
},
async (conn, m, mdata, { reply }) => {
  try {
    const q = m.text?.split(" ").slice(1).join(" ").trim();
    if (!q) return reply('✍️ Exemple : .lyrics <titre song>,<number>\n📌 Exemple : .lyrics past live,3');

    let [keyword, jumlah] = q.split(',').map(v => v.trim());
    if (!keyword) return reply('❌ give the titre valid');

    jumlah = parseInt(jumlah) || 3;

    const res = await axios.get(`https://apikey.sazxofficial.web.id/api/search/lyrics?q=${encodeURIComponent(keyword)}`);
    const data = res.data;

    if (!data.status || !data.result || data.result.length === 0) {
      return reply('❌ Paroles introuvables.');
    }

    const results = data.result.slice(0, jumlah).map((item, i) => {
      return `*${i + 1}. ${item.title}* - _${item.artist}_\n\n${item.lyricSingkat.trim()}`;
    }).join('\n────────────\n\n');

    reply(`🎵 *Résultats pour:* _${keyword}_\n\n${results}`);

  } catch (err) {
    console.error("Erreur API Lyrics:", err.response?.data || err.message);
    reply('❌ Une erreur est survenue lors de la récupération des paroles.');
  }
});
