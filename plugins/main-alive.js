const { cmd } = require('../command');
const os = require("os");
const axios = require("axios");
const moment = require("moment-timezone");
const { runtime } = require('../lib/functions');
const config = require('../config');

cmd({
    pattern: "alive",
    alias: ["mega", "live"],
    desc: "Check bot is alive or not",
    category: "main",
    react: ["🤍", "🌟", "🗿", "🥋", "💫", "☠", "🤍"][Math.floor(Math.random() * 7)],
    filename: __filename
},
async (conn, mek, m, { from, sender, reply }) => {
    try {
        const time = moment().tz("America/Port-au-Prince").format("HH:mm:ss");
        const date = moment().tz("America/Port-au-Prince").format("DD/MM/YYYY");

        let thumbnailBuffer = null;
        try {
            const response = await axios.get('https://files.catbox.moe/frns4k.jpg', {
                responseType: 'arraybuffer'
            });
            if (response && response.data) {
                thumbnailBuffer = Buffer.from(response.data);
            }
        } catch (err) {
            console.warn("Thumbnail could not be loaded.", err.message);
        }

        const caption = 
`╭──〔 *ALIVE STATUS* 〕─◉
│✅ *Online & Running!*
│👤 *Dev:* ᴅʏʙʏ ᴛᴇᴄʜ*
│📦 *Version:* 1.0.0
│📍 *Prefix:* [${config.PREFIX}]
│📡 *Mode:* [${config.MODE}]
│🖥️ *Host:* ${os.hostname()}
│🕐 *Uptime:* ${runtime(process.uptime())}
│📅 *Date:* ${date}
│⏰ *Time:* ${time}
╰────────────────────◉
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅʏʙʏ ᴛᴇᴄʜ*`
        .trim();

        const contextInfo = {
            externalAdReply: {
                title: "𝐌𝐄𝐆𝐀𝐋𝐎𝐃𝐎𝐍-𝐌𝐃",
                body: "ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅʏʙʏ ᴛᴇᴄʜ",
                mediaType: 1,
                previewType: "PHOTO",
                renderLargerThumbnail: true,
                mediaUrl: "https://wa.me/" + config.OWNER_NUMBER,
                sourceUrl: "https://wa.me/" + config.OWNER_NUMBER,
                ...(thumbnailBuffer ? { thumbnail: thumbnailBuffer } : {})
            }
        };

        await conn.sendMessage(from, {
            text: caption,
            contextInfo
        }, { quoted: mek });

    } catch (e) {
        console.error("Alive Error:", e);
        reply(`An error occurred: ${e.message}`);
    }
});
