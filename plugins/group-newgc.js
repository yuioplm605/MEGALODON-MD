const { cmd } = require('../command');
const config = require('../config');
const prefix = config.PREFIX;

cmd({
  pattern: "newgc",
  category: "group",
  desc: "Create a group with specified members.",
  filename: __filename,
  use: `${prefix}newgc GroupName number1,number2`,
  owner: true,
}, async (conn, mek, m, { body, sender, isOwner, reply }) => {
  try {
    if (!isOwner) return reply("❌ Only the bot owner can use this command.");
    if (!body.includes(" ")) return reply(`Usage: ${prefix}newgc GroupName number1,number2`);

    // Split body into groupName and numbersRaw (split on first space)
    const firstSpaceIndex = body.indexOf(" ");
    const groupName = body.slice(0, firstSpaceIndex).trim();
    const numbersRaw = body.slice(firstSpaceIndex + 1).trim();

    // Nettoyer les numéros : retirer tout sauf chiffres
    const numberList = numbersRaw.split(",")
      .map(n => n.trim().replace(/\D/g, ''))
      .filter(n => n.length >= 10); // minimum 10 chiffres (ajuste selon besoin)

    if (!groupName) return reply("❌ Please provide a group name.");
    if (numberList.length === 0) return reply("❌ Provide at least one valid phone number (digits only).");

    // Préparer les participants au format WhatsApp
    const participants = numberList.map(n => `${n}@s.whatsapp.net`);

    // Créer le groupe
    const group = await conn.groupCreate(groupName, participants);

    // Récupérer le code d'invitation
    const inviteCode = await conn.groupInviteCode(group.id);

    // Mettre à jour la description du groupe
    await conn.groupUpdateDescription(group.id, `Group created by @${sender.split('@')[0]}`);

    // Envoyer un message de bienvenue
    await conn.sendMessage(group.id, {
      text: `👋 *Welcome to ${groupName}!* Group created by @${sender.split('@')[0]}`,
      mentions: [sender]
    });

    // Répondre à l'utilisateur
    return reply(`╭━━━〔 *✅ GROUP CREATED SUCCESSFULLY* 〕━━⬣
┃📛 *Group name:* ${groupName}
┃👥 *Members added:* ${numberList.length}
┃
┃📎 *Invitation link:*
┃https://chat.whatsapp.com/${inviteCode}
╰━━━━━━━━━━━━━━━━━━━━⬣

✨ The group is now ready!
👤 You are the founder.
🚀 Invite more people with the link above.`);

  } catch (e) {
    console.error(e);
    return reply(`❌ *Erreur lors de la création du groupe !*\n\n*Détail:* ${e.message}`);
  }
});
