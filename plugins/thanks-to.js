const { cmd } = require('../command');
const config = require('../config');

cmd({
    pattern: "thanks",
    alias: ["thanksto", "dev"],
    desc: "thanks to dev for helping",
    category: "main",
    react: "👨‍💻",
    filename: __filename
},
async (conn, mek, m, { from }) => {
    try {
        const message = `
╭─❏ *THANKS TO :*
│
│👨‍💻 WASI TECH ★
│👨‍💻 STEEVY TECH ★
│👨‍💻 SIRIUS TECH ★
│───────────────────────
│🛠️ *BOT NAME:* MEGALODON MD
│───────────────────────
│🙋‍♂️ HELLO @${m.sender.split("@")[0]}
│
╰─────────────────────❏
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅʏʙʏ ᴛᴇᴄʜ*`;

        await conn.sendMessage(from, {
            image: { url: 'https://files.catbox.moe/e65j50.jpeg' },
            caption: message,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 1000,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363401051937059@newsletter', // remplace avec ton vrai newsletterJid si besoin
                    newsletterName: '𝐌𝐄𝐆𝐀𝐋𝐎𝐃𝐎𝐍-𝐌𝐃',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (err) {
        console.error("ThanksTo Error:", err);
        await conn.sendMessage(from, { text: `Error: ${err.message}` }, { quoted: mek });
    }
});
