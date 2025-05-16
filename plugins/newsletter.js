const { cmd } = require('../command');

cmd({
    pattern: "newsletter ?(.*)",
    desc: "Displays the @newsletter ID from a WhatsApp channel link",
    category: "tools",
    react: "📰",
    filename: __filename
}, async (conn, mek, m, { match }) => {
    let input = match || '';
    let newsletterJid = m.chat;

    // Cas 1 : Lien de canal fourni
    const channelLinkRegex = /https?:\/\/whatsapp\.com\/channel\/([a-zA-Z0-9]+)/;
    const matchLink = input.match(channelLinkRegex);

    if (matchLink) {
        const channelCode = matchLink[1];
        // Affiche juste le code, car pas de méthode directe pour JID
        return conn.sendMessage(newsletterJid, {
            text: `Channel link detected:\n\n*${matchLink[0]}*\n\nChannel code:\n*${channelCode}*\n\nNote: I can't get the full JID unless I'm inside that channel.`
        }, { quoted: mek });
    }

    // Cas 2 : Commande exécutée dans un canal
    if (!newsletterJid.endsWith("@newsletter")) {
        return conn.sendMessage(newsletterJid, {
            text: "Please provide a WhatsApp Channel link or run this command inside a WhatsApp channel."
        }, { quoted: mek });
    }

    // Suite normale
    const now = new Date().toLocaleString("en-US", { timeZone: "UTC", hour12: true });

    await conn.sendMessage(newsletterJid, {
        text: `Channel JID:\n\n*${newsletterJid}*\n\n🕵️ Executed on: ${now}`
    }, { quoted: mek });
});
