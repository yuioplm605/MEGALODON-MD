const axios = require('axios');
const { cmd } = require('../command');
const config = require('../config');

cmd({
    pattern: "patner",
    alias: ["thanks", "dev"],
    desc: "thanks to dev for helping",
    category: "main",
    react: "👨‍💻",
    filename: __filename
},
async (conn, mek, m, { from }) => {
    try {
        const message = `
╭─❏ *𝐃𝐄𝐕𝐄𝐋𝐎𝐏𝐄𝐑𝐒 :*
│👨‍💻 𝙸𝙽𝙲𝙾𝙽𝙽𝚄 𝙱𝙾𝚈 👨‍💻
│👨‍💻 𝚆𝙰𝚂𝙸 𝚃𝙴𝙲𝙷 👨‍💻
│👨‍💻 𝚂𝚃𝙴𝙴𝚅𝚈 𝚃𝙴𝙲𝙷 👨‍💻
│───────────────────────
│🤖 *𝙱𝙾𝚃 𝙽𝙰𝙼𝙴:* 𝙼𝙴𝙶𝙰𝙻𝙾𝙳𝙾𝙽 𝙼𝙳
│───────────────────────
│🙋‍♂️ 𝙷𝙴𝙻𝙻𝙾 @${m.sender.split("@")[0]}
╰─────────────────────❏
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅʏʙʏ ᴛᴇᴄʜ*`;

        await conn.sendMessage(from, {
            image: { url: `https://files.catbox.moe/vmqovi.jpg` },
            caption: message,
            contextInfo: { 
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363401051937059@newsletter',
                    newsletterName: '𝐌𝐄𝐆𝐀𝐋𝐎𝐃𝐎𝐍 𝐌𝐃',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });


    } catch (err) {
        console.error("ThanksTo Error:", err);
        await conn.sendMessage(from, { text: `Error: ${err.message}` }, { quoted: mek });
    }
});
