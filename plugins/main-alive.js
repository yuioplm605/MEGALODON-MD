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
        const status = `
> ╭──〔 *MEGALODON-MD ALIVE* 〕─◉
> │✨ *Bot is Active & Online!*
> │
> │🧠 *Dev:* ᴅʏʙʏ ᴛᴇᴄʜ
> │⚡ *Version:* 1.0.0
> │📝 *Prefix:* [${config.PREFIX}]
> │📳 *Mode:* [${config.MODE}]
> │🖥️ *Host:* ${os.hostname()}
> │⌛ *Uptime:* ${runtime(process.uptime())}
> ╰────────────────────◉
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅʏʙʏ ᴛᴇᴄʜ*`;

        const thumbnailBuffer = (await axios.get("https://files.catbox.moe/rful77.jpg", { responseType: "arraybuffer" })).data;

        await conn.sendMessage(from, {
            image: { url: `https://files.catbox.moe/frns4k.jpg` },
            caption: status,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 1000,
                isForwarded: true,
                externalAdReply: {
                    title: "MEGALODON-MD 🥀",
                    body: "> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅʏʙʏ ᴛᴇᴄʜ*",
                    mediaType: 1,
                    renderLargerThumbnail: true,
                    thumbnail: thumbnailBuffer,
                    mediaUrl: "https://files.catbox.moe/frns4k.jpg",
                    sourceUrl: "https://wa.me/message/yourself",
                    showAdAttribution: true
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Alive Error:", e);
        reply(`An error occurred: ${e.message}`);
    }
});
