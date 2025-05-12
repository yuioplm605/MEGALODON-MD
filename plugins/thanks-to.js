const { cmd } = require('../command');

const config = require('../config');

cmd({

    pattern: "thanks",

    alias: ["thanks-to", "credit", "dev"],

    desc: "Display bot credits and thanks",

    category: "main",

    react: "👨‍💻",

    filename: __filename

},

async (conn, mek, m, { from }) => {

    try {

        const message = `

╭───❍ 🤝 *BIG THANKS TO* ❍───╮

│ HI  @${m.sender.split("@")[0]}

│• WASI_TECH ★

│• STEEVY TECH ★

│• SIRIUS ★

╰─────────────────────────╯

`;

        await conn.sendMessage(from, {

            image: { url: `https://files.catbox.moe/5qjcy5.jpg` },

            caption: message,

            contextInfo: {

                mentionedJid: [m.sender]

            }

        }, { quoted: mek });

    } catch (err) {

        console.error("ThanksTo Error:", err);

        await conn.sendMessage(from, { text: `An error occurred: ${err.message}` }, { quoted: mek });

    }

});