const config = require('../config');
const moment = require('moment-timezone');
const { cmd, commands } = require('../command');
const axios = require('axios');

async function getBuffer(url) {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(response.data, 'binary');
}

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
        const time = moment().tz("America/Port-au-Prince").format("HH:mm:ss");

        const uptime = () => {
            let sec = process.uptime();
            let h = Math.floor(sec / 3600);
            let m = Math.floor((sec % 3600) / 60);
            let s = Math.floor(sec % 60);
            return `${h}h ${m}m ${s}s`;
        };

        let pushwish = "Good";
        if (time < "05:00:00") pushwish = `Good Morning 🌄`;
        else if (time < "11:00:00") pushwish = `Good Morning 🌄`;
        else if (time < "15:00:00") pushwish = `Good Afternoon 🌅`;
        else if (time < "19:00:00") pushwish = `Good Evening 🌃`;
        else pushwish = `Good Night 🌌`;

        // En-tête du menu
        let menuText = `╭═══ 𝐌𝐄𝐆𝐀𝐋𝐎𝐃𝐎𝐍-𝐌𝐃 ═══⊷
┃❃╭──────────────
┃❃│ Prefix : *[${config.PREFIX}]*
┃❃│ User :  *${m.pushName}*!
┃❃│ Mode : *[${config.MODE}]*
┃❃│ Date :   *${date}*
┃❃│ Time :   *${time}*
┃❃│ Plugin : *${totalCommands}*
┃❃│ Uptime : *${uptime()}*
┃❃│ Dev : 𝐃𝐘𝐁𝐘 𝐓𝐄𝐂𝐇
┃❃╰───────────────
╰═════════════════⊷

> ${pushwish} *@${m.sender.split("@")[0]}*

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
            menuText += `\n\n╭━─〔 *${k.toUpperCase()}* 〕──`;
            const cmds = category[k].filter(c => c.pattern).sort((a, b) => a.pattern.localeCompare(b.pattern));
            cmds.forEach((cmd) => {
                const usage = cmd.pattern.split('|')[0];
                menuText += `\n┃ ⬡ ${config.PREFIX}${usage}`;
            });
            menuText += `\n╰──────────────❒`;
        }

        // Image avec thumbnail uniquement
        const imageUrl = 'https://files.catbox.moe/rful77.jpg';
        const thumb = await getBuffer(imageUrl);

        await conn.sendMessage(from, {
            image: { url: imageUrl },
            caption: menuText,
            contextInfo: {
                mentionedJid: [m.sender],
                externalAdReply: {
                    title: "𝐌𝐄𝐆𝐀𝐋𝐎𝐃𝐎𝐍-𝐌𝐃 ",
                    body: "*ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅʏʙʏ ᴛᴇᴄʜ*",
                    thumbnail: thumb,
                    mediaType: 1,
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
