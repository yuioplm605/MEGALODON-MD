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
        // Heure & date locale
        const time = moment().tz("America/Port-au-Prince").format("HH:mm:ss");
        const date = moment().tz("America/Port-au-Prince").format("DD/MM/YYYY");

        // Chargement de l'image (avec fallback)
        let thumbnailBuffer = null;
        try {
            thumbnailBuffer = (await axios.get('https://files.catbox.moe/frns4k.jpg', {
                responseType: 'arraybuffer'
            })).data;
        } catch (err) {
            console.warn("Thumbnail could not be loaded.");
        }

        const caption = 
╭──〔 *𝐌𝐄𝐆𝐀𝐋𝐎𝐃𝐎𝐍-𝐌𝐃 𝗦𝘁𝗮𝘁𝘂𝘀* 〕─◉
│✅ *Online & Running!*
│👤 *Dev:* ᴅʏʙʏ ᴛᴇᴄʜ
│📦 *Version:* 1.0.0
│📍 *Prefix:* [${config.PREFIX}]
│📡 *Mode:* [${config.MODE}]
│🖥️ *Host:* ${os.hostname()}
│🕐 *Uptime:* ${runtime(process.uptime())}
│📅 *Date:* ${date}
│⏰ *Time:* ${time}
╰────────────────────◉
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅʏʙʏ ᴛᴇᴄʜ*
        .trim();

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
