const { cmd } = require('../command');
const os = require("os");
const axios = require("axios");
const moment = require("moment-timezone");
const { runtime } = require('../lib/functions');
const config = require('../config');

cmd({
    pattern: "alive",
    alias: ["bot", "live"],
    desc: "Check bot is alive or not",
    category: "main",
    react: ["🤍", "🌟", "🗿", "🥋", "💫", "☠", "🤍"][Math.floor(Math.random() * 7)],
    filename: __filename
},
async (conn, mek, m, { from, sender, reply }) => {
    try {
        const time = moment().tz("Africa/Port-au-Prince").format("HH:mm:ss");
        const date = moment().tz("Africa/Port-au-Prince").format("DD/MM/YYYY");

        let thumbnailBuffer = null;
        try {
            thumbnailBuffer = (await axios.get(config.ALIVE_IMG || 'https://files.catbox.moe/frns4k.jpg', {
                responseType: 'arraybuffer'
            })).data;
        } catch (err) {
            console.warn("Thumbnail could not be loaded.");
        }

        const caption = 
╭──〔 *ALIVE STATUS* 〕─◉
│✅ *Online & Running!*
│👤 *Dev:* ${config.OWNER_NAME}
│📦 *Version:* 1.0.0
│📍 *Prefix:* [${config.PREFIX}]
│📡 *Mode:* [${config.MODE}]
│🖥️ *Host:* ${os.hostname()}
│🕐 *Uptime:* ${runtime(process.uptime())}
│📅 *Date:* ${date}
│⏰ *Time:* ${time}
╰────────────────────◉
> ${config.DESCRIPTION}
        .trim();

        await conn.sendMessage(from, {
            text: caption,
            contextInfo: {
                externalAdReply: {
                    title: config.BOT_NAME || "𝐌𝐄𝐆𝐀𝐋𝐎𝐃𝐎𝐍-𝐌𝐃",
                    body: config.DESCRIPTION || "ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅʏʙʏ ᴛᴇᴄʜ",
                    mediaType: 1,
                    previewType: "PHOTO",
                    renderLargerThumbnail: true,
                    thumbnail: thumbnailBuffer,
                    mediaUrl: "https://wa.me/" + config.OWNER_NUMBER,
                    sourceUrl: "https://wa.me/" + config.OWNER_NUMBER
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Alive Error:", e);
        reply(An error occurred: ${e.message});
    }
});
