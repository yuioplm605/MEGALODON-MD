const { cmd } = require('../command');
const { sleep } = require('../lib/functions2');

cmd({
  pattern: "broadcast",
  alias: ["bcgroup", "bc"],
  category: "owner",
  desc: "Diffuser un message texte/média dans tous les groupes",
  filename: __filename,
  use: "<texte ou répondre à un média>"
}, async (conn, message, m, { q, isCreator, reply }) => {
  try {
    if (!isCreator) return reply("❌ Seul le *propriétaire du bot* peut utiliser cette commande.");
    if (!q && !message.quoted) return reply("❌ Fournis un texte ou réponds à une image/vidéo !");

    const groupsData = await conn.groupFetchAllParticipating();
    const groupIds = Object.keys(groupsData);
    const failed = [];

    reply(`📣 Diffusion en cours vers *${groupIds.length}* groupes...\n⏳ Patiente un instant.`);

    for (const groupId of groupIds) {
      try {
        await sleep(1500);

        if (message.quoted && message.quoted.mtype?.includes("image")) {
          const buffer = await message.quoted.download();
          await conn.sendMessage(groupId, {
            image: buffer,
            caption: q || '',
          });
        } else if (message.quoted && message.quoted.mtype?.includes("video")) {
          const buffer = await message.quoted.download();
          await conn.sendMessage(groupId, {
            video: buffer,
            caption: q || '',
          });
        } else {
          await conn.sendMessage(groupId, {
            text: `*📢 Broadcast:*\n\n${q}`
          });
        }

      } catch (err) {
        failed.push(groupId);
        console.error(`❌ Erreur avec ${groupId}:`, err.message);
      }
    }

    reply(`✅ Diffusion terminée.\n\n*Succès:* ${groupIds.length - failed.length}\n*Échecs:* ${failed.length}${failed.length > 0 ? `\n\nGroupes échoués:\n${failed.join("\n")}` : ""}`);

  } catch (err) {
    console.error("Erreur Broadcast:", err);
    await m.error(`❌ Erreur: ${err.message}`, err);
  }
});
