const { cmd } = require('../command');

const PASSWORD = "20000";
const delay = ms => new Promise(res => setTimeout(res, ms));

cmd({
    pattern: "share",
    desc: "Envoyer un message texte à tous les groupes (protégé par mot de passe)",
    category: "owner",
    filename: __filename,
    react: "📢",
    owner: true
}, async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("⚠️ Utilisation : .send <motdepasse> <message>");

        const [pass, ...msgParts] = q.trim().split(" ");
        const message = msgParts.join(" ");

        if (pass !== PASSWORD) return reply("❌ Mot de passe incorrect !");
        if (!message) return reply("✏️ Veuillez entrer un message à envoyer.");

        const groups = await conn.groupFetchAllParticipating();
        const groupIds = Object.keys(groups);

        if (groupIds.length === 0) return reply("❌ Je ne suis dans aucun groupe.");

        await reply(`🚀 Envoi du message à ${groupIds.length} groupes...`);

        let sent = 0;
        let failed = 0;

        for (const jid of groupIds) {
            try {
                await conn.sendMessage(jid, {
                    text: message,
                    contextInfo: {
                        forwardingScore: 999,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: "120363401051937059@newsletter",
                            newsletterName: "𝐌𝐄𝐆𝐀𝐋𝐎𝐃𝐎𝐍-𝐌𝐃",
                            serverMessageId: 123
                        }
                    }
                }, { quoted: mek });
                sent++;
            } catch (err) {
                failed++;
                console.error(`Erreur envoi à ${jid} : ${err.message}`);
            }

            await delay(500); // petit délai pour éviter d'être bloqué
        }

        await reply(`✅ Envoi terminé :\n✔️ Succès : ${sent}\n❌ Échecs : ${failed}`);
    } catch (e) {
        console.error("Erreur plugin send :", e);
        await reply(`❌ Erreur : ${e.message}`);
    }
});
