const { cmd } = require('../command');

cmd({
    pattern: "broadcast",
    alias: ["bc", "bcast"],
    use: '.broadcast [text]',
    desc: "Broadcast a message to all private chats and groups",
    category: "owner",
    filename: __filename,
    owner: true
}, async (conn, mek, m, { q, reply, sender }) => {
    try {
        if (!q) return reply("Please provide a message to broadcast.");

        const allChats = await conn.chats.all();

        const groupChats = allChats.filter(c => c.id.endsWith("@g.us"));
        const privateChats = allChats.filter(c => c.id.endsWith("@s.whatsapp.net"));

        let countPrivate = 0, countGroup = 0;

        // Texte du broadcast
        const message = {
            text: `📢 *Broadcast from MEGALODON-MD:*\n\n${q}`,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363401051937059@newsletter',
                    newsletterName: "𝐌𝐄𝐆𝐀𝐋𝐎𝐃𝐎𝐍-𝐌𝐃",
                    serverMessageId: 143
                }
            }
        };

        // Broadcast aux privés
        for (const chat of privateChats) {
            try {
                await conn.sendMessage(chat.id, message);
                countPrivate++;
                await new Promise(r => setTimeout(r, 100));
            } catch (e) {
                console.log(`Failed to send to ${chat.id}:`, e.message);
            }
        }

        // Broadcast aux groupes
        for (const chat of groupChats) {
            try {
                await conn.sendMessage(chat.id, message);
                countGroup++;
                await new Promise(r => setTimeout(r, 150));
            } catch (e) {
                console.log(`Failed to send to group ${chat.id}:`, e.message);
            }
        }

        // Confirmation à l'utilisateur
        await conn.sendMessage(m.chat, {
            text: `✅ Broadcast sent to:\n• ${countPrivate} private chats\n• ${countGroup} groups.`,
            quoted: mek
        });

    } catch (err) {
        console.error("Broadcast error:", err);
        reply("An error occurred while broadcasting.");
    }
});
