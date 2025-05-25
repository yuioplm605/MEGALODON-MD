const config = require('../config');
const moment = require('moment-timezone');
const { cmd, commands } = require('../command');
const axios = require('axios');

cmd({
  pattern: "menu",
  alias: ["allmenu", "❄️"],
  use: '.menu',
  desc: "Show all bot commands",
  category: "menu",
  react: "❄️",
  filename: __filename
},
async (conn, mek, m, { from, reply }) => {
  try {
    const totalCommands = commands.length;
    const date = moment().tz("America/Port-au-Prince").format("dddd, DD MMMM YYYY");

    const uptime = () => {
      let sec = process.uptime();
      let h = Math.floor(sec / 3600);
      let m = Math.floor((sec % 3600) / 60);
      let s = Math.floor(sec % 60);
      return `${h}h ${m}m ${s}s`;
    };

    // En-tête du menu sans time ni pushwish
    let menuText = `
*╭══〘 𝐌𝐄𝐆𝐀𝐋𝐎𝐃𝐎𝐍-𝐌𝐃 〙*
*┃❍* *ᴜsᴇʀ* : @${m.sender.split("@")[0]}
*┃❍* *ʀᴜɴᴛɪᴍᴇ* : ${uptime()}
*┃❍* *ᴍᴏᴅᴇ* : *${config.MODE}*
*┃❍* *ᴘʀᴇғɪx* : [${config.PREFIX}]
*┃❍* *ᴩʟᴜɢɪɴ* :  ${totalCommands}
*┃❍* *ᴅᴇᴠ* : *ᴅʏʙʏ ᴛᴇᴄʜ*
*┃❍* *ᴠᴇʀsɪᴏɴs* : *1.0.0*
*╰════════════════⊷*


${String.fromCharCode(8206).repeat(4001)}
`;

    // Regroupement par catégorie
    let category = {};
    for (let cmd of commands) {
      if (!cmd.category) continue;
      if (!category[cmd.category]) category[cmd.category] = [];
      category[cmd.category].push(cmd);
    }

    const keys = Object.keys(category).sort();
    for (let k of keys) {
      menuText += `\n\n┌ ❏ 〤 *${k.toUpperCase()} MENU* 〤`;
      const cmds = category[k].filter(c => c.pattern).sort((a, b) => a.pattern.localeCompare(b.pattern));
      cmds.forEach((cmd) => {
        const usage = cmd.pattern.split('|')[0];
        menuText += `\n├❍ \`${config.PREFIX}${usage}\``;
      });
      menuText += `\n┗━━━━━━━━━━━━━━❍`;
    }

    menuText += `\n`;

    const imageUrl = 'https://files.catbox.moe/rful77.jpg';

    await conn.sendMessage(from, {
      image: { url: imageUrl },
      caption: menuText,
      contextInfo: {
        mentionedJid: [m.sender],
        externalAdReply: {
          title: "𝐌𝐄𝐆𝐀𝐋𝐎𝐃𝐎𝐍-𝐌𝐃",
          body: "ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅʏʙʏ ᴛᴇᴄʜ",
          mediaType: 3,
          renderLargerThumbnail: true,
          sourceUrl: 'https://github.com/Dybytech/MEGALODON-MD'
        }
      }
    }, { quoted: mek });

  } catch (e) {
    console.error(e);
    reply(`❌ Error: ${e.message}`);
  }
});
