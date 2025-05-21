// plugin by DybyTech 
// don't copy m'y plugin 

const fs = require('fs');
const path = require('path');
const { cmd } = require('../command');

const filePath = path.join(__dirname, '../data/password.json');

function setPassword(newPass) {
    fs.writeFileSync(filePath, JSON.stringify({ send_password: newPass }, null, 2));
}

cmd({
    pattern: "setpassword",
    desc: "Changer le mot de passe pour .send",
    category: "owner",
    filename: __filename,
    react: "🔐",
    owner: true
}, async (conn, mek, m, { q, reply }) => {
    if (!q || q.trim().length < 4) {
        return reply("❗ Utilisation : .setpassword <nouveau_mot_de_passe> (min 4 caractères)");
    }

    try {
        setPassword(q.trim());
        reply(`✅ Nouveau mot de passe enregistré : *${q.trim()}*`);
    } catch (e) {
        console.error(e);
        reply("❌ Erreur lors de l'enregistrement.");
    }
});

// send by DybyTech 

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

            await delay(200); // petit délai pour éviter d'être bloqué
        }

        await reply(`✅ Envoi terminé :\n✔️ Succès : ${sent}\n❌ Échecs : ${failed}`);
    } catch (e) {
        console.error("Erreur plugin send :", e);
        await reply(`❌ Erreur : ${e.message}`);
    }
});


// vuew  mdps


cmd({
    pattern: "viewpassword",
    desc: "Voir le mot de passe actuel",
    category: "owner",
    filename: __filename,
    react: "🛡️",
    owner: true
}, async (conn, mek, m, { reply }) => {
    try {
        const filePath = path.join(__dirname, '../data/password.json');
        if (!fs.existsSync(filePath)) return reply("❌ Aucun mot de passe trouvé.");
        const data = JSON.parse(fs.readFileSync(filePath));
        reply(`🔐 Mot de passe actuel : *${data.send_password}*`);
    } catch (e) {
        console.error(e);
        reply("❌ Erreur lors de la lecture.");
    }
});

// *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅʏʙʏ ᴛᴇᴄʜ*
