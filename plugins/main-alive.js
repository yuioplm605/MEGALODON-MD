const { cmd } = require('../command');
const os = require("os");
const axios = require("axios");
const moment = require("moment-timezone");
const { runtime } = require('../lib/functions');
const config = require('../config');
const fs = require('fs');

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

        // Charger l'image en buffer pour envoyer en thumbnail et image
        let imageBuffer;
        try {
            // Tu peux aussi mettre un chemin local ici, ex: fs.readFileSync('./alive.jpg')
            const response = await axios.get('https://files.catbox.moe/vmqovi.jpg', {
                responseType: 'arraybuffer'
            });
            imageBuffer = Buffer.from(response.data);
        } catch (err) {
            console.warn("Image could not be loaded.", err.message);
            return reply("Impossible de charger l'image d'alive.");
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

        await conn.sendMessage(from, {
            image: {
                mimetype: 'image/jpeg',
                data: imageBuffer,
            },
            caption: caption,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363401051937059@newsletter',
                    newsletterName: '𝐌𝐄𝐆𝐀𝐋𝐎𝐃𝐎𝐍-𝐌𝐃',
                    serverMessageId: 143
                },
                externalAdReply: {
                    title: "𝐌𝐄𝐆𝐀𝐋𝐎𝐃𝐎𝐍-𝐌𝐃",
                    body: "ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅʏʙʏ ᴛᴇᴄʜ",
                    mediaType: 1,
                    previewType: "PHOTO",
                    renderLargerThumbnail: true,
                    mediaUrl: "https://wa.me/" + config.OWNER_NUMBER,
                    sourceUrl: "https://wa.me/" + config.OWNER_NUMBER,
                    thumbnail: imageBuffer
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Alive Error:", e);
        reply(`An error occurred: ${e.message}`);
    }
});
