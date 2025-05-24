const config = require('../config');
const moment = require('moment-timezone');
const { cmd, commands } = require('../command');

cmd({
  pattern: 'menu',
  alias: ['allmenu', '❄️'],
  use: '.menu',
  desc: 'Show all bot commands',
  category: 'menu',
  react: '❄️',
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    // Date, heure, uptime
    const date = moment().tz('America/Port-au-Prince').format('dddd, DD MMMM YYYY');
    const time = moment().tz('America/Port-au-Prince').format('HH:mm:ss');

    const uptimeSeconds = process.uptime();
    const h = Math.floor(uptimeSeconds / 3600);
    const m_ = Math.floor((uptimeSeconds % 3600) / 60);
    const s = Math.floor(uptimeSeconds % 60);
    const uptime = `${h}h ${m_}m ${s}s`;

    // Nombre total commandes
    const totalCommands = commands.length;

    // Message de salutation selon l’heure
    const currentTime = moment().tz('America/Port-au-Prince').format('HH:mm:ss');
    let pushwish = '';
    if (currentTime < '05:00:00' || currentTime >= '19:00:00') pushwish = 'Good Night 🌌';
    else if (currentTime < '11:00:00') pushwish = 'Good Morning 🌄';
    else if (currentTime < '15:00:00') pushwish = 'Good Afternoon 🌅';
    else if (currentTime < '19:00:00') pushwish = 'Good Evening 🌃';

    // Header du menu
    let header = `╭═══ 𝐌𝐄𝐆𝐀𝐋𝐎𝐃𝐎𝐍-𝐌𝐃 ═══⊷
┃❃╭──────────────
┃❃│ Prefix : *[${config.PREFIX}]*
┃❃│ User :  *${m.pushName || 'Utilisateur'}*!
┃❃│ Mode : *[${config.MODE}]*
┃❃│ Date :   *${date}*
┃❃│ Version : *1.0.0 Bᴇᴛᴀ*
┃❃│ Plugin : *${totalCommands}*
┃❃│ Uptime : *${uptime}*
┃❃│ Dev : 𝐃𝐘𝐁𝐘 𝐓𝐄𝐂𝐇
┃❃╰───────────────
╰═════════════════⊷

> ${pushwish} *@${m.sender.split("@")[0]}*\n\n`;

    // Regrouper commandes par catégorie
    let category = {};
    for (let cmd of commands) {
      if (!cmd.category) continue;
      if (!category[cmd.category]) category[cmd.category] = [];
      category[cmd.category].push(cmd);
    }

    // Trier les catégories alphabétiquement
    const keys = Object.keys(category).sort();

    // Construire le texte du menu
    let menuText = header + String.fromCharCode(8206).repeat(4001);
    for (let k of keys) {
      menuText += `\n\n╭━──〔 *${k.toUpperCase()}* 〕──`;
      const cmds = category[k].sort((a, b) => a.pattern.localeCompare(b.pattern));
      cmds.forEach(cmd => {
        const usage = cmd.pattern.split('|')[0];
        menuText += `\n┃ ⬡ ${config.PREFIX}${usage}`;
      });
      menuText += `\n╰──────────────❒`;
    }

    // URL d’une image sympa pour le menu (à changer si tu veux)
    const menuImageUrl = 'https://files.catbox.moe/rful77.jpg';

    // Envoi du menu avec image + caption
    await conn.sendMessage(
      from,
      {
        image: { url: menuImageUrl },
        caption: menuText,
        contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 999,
          isForwarded: true,
        },
      },
      { quoted: mek }
    );
  } catch (e) {
    console.error(e);
    reply(`❌ Error: ${e.message}`);
  }
});
