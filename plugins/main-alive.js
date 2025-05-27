const { cmd } = require('../command');
const os = require("os");
const axios = require("axios");
const { runtime } = require('../lib/functions');
const config = require('../config');

cmd({
    pattern: "alive",
    alias: ["bot", "live"],
    desc: "Check bot is alive or not",
    category: "main",
    react: "🤍",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply }) => {
    try {
        const caption = `
╭──〔 *STATUS ALIVE* 〕─◉
│✨ *Bot is Active & Online!*
│🧠 *Dev:* ᴅʏʙʏ ᴛᴇᴄʜ
│⚡ *Version:* 1.0.0
│📝 *Prefix:* [${config.PREFIX}]
│📳 *Mode:* [${config.MODE}]
│🖥️ *Host:* ${os.hostname()}
│⌛ *Uptime:* ${runtime(process.uptime())}
╰────────────────────◉
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅʏʙʏ ᴛᴇᴄʜ*
        `.trim();

        const thumbnailBuffer = await axios.get('https://files.catbox.moe/frns4k.jpg', { responseType: 'arraybuffer' }).then(res => res.data);

        await conn.sendMessage(from, {
            text: caption,
            contextInfo: {
                externalAdReply: {
                    title: "𝐌𝐄𝐆𝐀𝐋𝐎𝐃𝐎𝐍-𝐌𝐃",
                    body: "© ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅʏʙʏ ᴛᴇᴄʜ",
                    mediaType: 1,
                    previewType: "PHOTO",
                    renderLargerThumbnail: true,
                    thumbnail: thumbnailBuffer,
                    mediaUrl: "https://wa.me/message/yourself",
                    sourceUrl: "https://wa.me/message/yourself"
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Alive Error:", e);
        reply(`An error occurred: ${e.message}`);
    }
});
