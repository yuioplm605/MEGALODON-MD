const { cmd } = require('../command');

// .broadcast rapide sans pause
cmd({
  pattern: "broadcast",
  category: "owner",
  react: "📢",
  filename: __filename
}, async (conn, mek, m, { isOwner, args, reply }) => {
  if (!isOwner) return;
  if (!args.length) return reply("Écris le message à envoyer.");
  const msg = args.join(' ');
  const groups = Object.keys(await conn.groupFetchAllParticipating());
  if (!groups.length) return reply("Aucun groupe trouvé.");
  for (const jid of groups) {
    conn.sendMessage(jid, { text: msg }, { quoted: mek }).catch(() => {});
  }
  reply(`Message envoyé à ${groups.length} groupes.`);
});

