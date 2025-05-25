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

    const [artist, ...songArray] = text.split(' ');
    const song = songArray.join(' ');
    const api = `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(song)}`;
    const { data } = await axios.get(api);

    if (!data || !data.lyrics) {
      return reply("❌ Paroles non trouvées.");
    }

    const message = `*Artiste:* ${artist}\n*Titre:* ${song}\n\n${data.lyrics}`.trim();

    await conn.sendMessage(m.chat, {
      text: message,
      contextInfo: {
        externalAdReply: {
          title: `${song} - ${artist}`,
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
