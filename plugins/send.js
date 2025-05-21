const { cmd } = require('../command');

const PASSWORD = "20000";
const delay = ms => new Promise(res => setTimeout(res, ms));

cmd({
    pattern: "share",
    desc: "Envoyer un message texte à tous les groupes (protégé par mot de passe)",
    category: "owner",
    react: "📤",
    filename: __filename,
    owner: true
}, 
async (conn, mek, m, { q, reply, sender }) => {
    try {
        const args = q.trim().split(" ");
        const pass = args.shift();
        const message = args.join(" ");

        if (!q || !pass || !message) {
            return reply("⚠️ Utilisation : .send <motdepasse> <message>");
        }

        if (pass !== PASSWORD) {
            return reply("❌ Mot de passe incorrect !");
        }

        const groups = await conn.groupFetchAllParticipating();
        const groupIds = Object.keys(groups);
        if (groupIds.length === 0) return reply("❌ Je ne suis dans aucun groupe.");

        await reply(`🚀 Envoi à ${groupIds.length} groupes...`);

        let sent = 0;
        let failed = 0;

        for (const jid of groupIds) {
            try {
                await conn.sendMessage(jid, {
                    text: message,
                    contextInfo: {
                        mentionedJid: [sender],
                        forwardingScore: 999,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363401051937059@newsletter',
                            newsletterName: '𝐌𝐄𝐆𝐀𝐋𝐎𝐃𝐎𝐍-𝐌𝐃',
                            serverMessageId: 99
                        }
                    }
                }, { quoted: mek });
                sent++;
            } catch (e) {
                failed++;
                console.error(`[Erreur] ${jid} => ${e.message}`);
            }

            await delay(300);
            if (sent % 30 === 0) await delay(5000);
        }

        await reply(`✅ Fini !\n✔️ Envoyés : ${sent}\n❌ Échecs : ${failed}`);

    } catch (e) {
        console.error("Erreur .send :", e);
        reply("❌ Une erreur s'est produite : " + e.message);
    }
});
