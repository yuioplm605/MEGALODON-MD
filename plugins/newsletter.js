const { cmd } = require('../command');

cmd({
    pattern: "newsletter",
    desc: "Displays the @newsletter ID of the current channel",
    category: "tools",
    react: "📰",
    filename: __filename
},
async (conn, mek, m) => {
    const newsletterJid = m.chat;

    if (!newsletterJid.endsWith("@newsletter")) {
        return conn.sendMessage(newsletterJid, {
            text: "This command must be used inside a WhatsApp channel (@newsletter)."
        }, { quoted: mek });
    }

    // Send the channel ID
    await conn.sendMessage(newsletterJid, {
        text: `Channel ID:\n\n*${newsletterJid}*`
    }, { quoted: mek });

    // Simulate a forwarded message from another newsletter
    const fakeNewsletterJid = '120363372853772240@newsletter';
    const fakeNewsletterName = 'Dybytech News'; // Updated name
    const serverMessageId = 101;
    const message = "This is an example of a message forwarded from a channel.";

    await conn.sendMessage(
        newsletterJid,
        {
            text: message,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: fakeNewsletterJid,
                    newsletterName: fakeNewsletterName,
                    serverMessageId: serverMessageId
                }
            }
        },
        { quoted: mek }
    );
});
