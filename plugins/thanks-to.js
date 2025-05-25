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
>╭─❏ *𝐃𝐄𝐕𝐄𝐋𝐎𝐏𝐄𝐑𝐒 :*
> │👨‍💻 𝙳𝚈𝙱𝚈 𝚃𝙴𝙲𝙷 👨‍💻
> │👨‍💻 𝚆𝙰𝚂𝙸 𝚃𝙴𝙲𝙷 👨‍💻
> │👨‍💻 𝚂𝚃𝙴𝙴𝚅𝚈 𝚃𝙴𝙲𝙷 👨‍💻
> │👨‍💻 𝚂𝙸𝚁𝙸𝚄𝚂 𝚃𝙴𝙲𝙷 👨‍💻
> │👨‍💻𝙴𝙼𝙿𝙴𝚁𝙾𝚁 𝚂𝚄𝙺𝚄𝙽𝙰👨‍💻
> │ 🗑𝚂𝚞𝚙𝚛𝚎𝚖𝚎 𝙳.𝙳𝚎𝚜𝚝𝚛𝚞𝚌𝚝𝚘𝚛🗑
> │───────────────────────
> │🛠️ *𝙱𝙾𝚃 𝙽𝙰𝙼𝙴:* 𝙼𝙴𝙶𝙰𝙻𝙾𝙳𝙾𝙽 𝙼𝙳
> │───────────────────────
> │🙋‍♂️ 𝙷𝙴𝙻𝙻𝙾 @${m.sender.split("@")[0]}
> │
> ╰─────────────────────❏
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅʏʙʏ ᴛᴇᴄʜ*`;

        await conn.sendMessage(from, {
            image: { url: 'https://files.catbox.moe/frns4k.jpg' },
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
