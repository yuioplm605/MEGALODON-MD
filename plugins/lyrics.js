const axios = require('axios');
const { cmd } = require('../command');

cmd({
  pattern: "lyrics",
  alias: ["paroles"],
  desc: "Obtenir les paroles d'une chanson",
  category: "tools",
  use: '.lyrics <titre de chanson>',
  filename: __filename
},
async (conn, mek, m, { text, reply }) => {
  try {
    if (!text) return reply('❌ Utilisation : .lyrics <titre de la chanson>\nExemple : .lyrics Faded Alan Walker');

    const res = await axios.get(`https://api.gifted.my.id/api/search/lyrics?apikey=gifted&query=${encodeURIComponent(text)}`);
    const data = res.data;

    if (!data || !data.data || !data.data.lyrics) {
      return reply("❌ Paroles non trouvées.");
    }

    const { title, artist, lyrics } = data.data;

    const msg = `*Titre:* ${title}\n*Artiste:* ${artist}\n\n${lyrics}`.trim();

    await conn.sendMessage(m.chat, {
      text: msg,
      contextInfo: {
        externalAdReply: {
          title: `${title} - ${artist}`,
          body: 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅʏʙʏ ᴛᴇᴄʜ',
          thumbnailUrl: 'https://i.ibb.co/NnXWJsd/music-thumb.jpg',
          sourceUrl: 'https://github.com/Dybytech/MEGALODON-MD',
          mediaType: 2,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: mek });
    
  } catch (e) {
    console.error(e);
    reply("❌ Une erreur est survenue lors de la récupération des paroles.");
  }
});
