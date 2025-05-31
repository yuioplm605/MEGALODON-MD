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

    const firstSpaceIndex = body.indexOf(" ");
    const groupName = body.slice(0, firstSpaceIndex).trim();
    const numbersRaw = body.slice(firstSpaceIndex + 1).trim();

    // Nettoyage des numéros (digits only)
    const numberList = numbersRaw.split(",")
      .map(n => n.trim().replace(/\D/g, ''))
      .filter(n => n.length >= 10);

    if (!groupName) return reply("❌ Please provide a group name.");
    if (groupName.length > 30) return reply("❌ Group name too long (max 30 chars).");
    if (numberList.length === 0) return reply("❌ Provide at least one valid phone number (digits only).");

    console.log("GroupName:", groupName);
    console.log("Number list:", numberList);

    // Créer le groupe avec le premier numéro (ou le sender s'il existe)
    const firstParticipant = numberList[0] + "@s.whatsapp.net";

    const group = await conn.groupCreate(groupName, [firstParticipant]);

    // Ajouter les autres membres un par un
    const failedAdds = [];
    for (let i = 1; i < numberList.length; i++) {
      const jid = numberList[i] + "@s.whatsapp.net";
      try {
        await conn.groupParticipantsUpdate(group.id, [jid], "add");
      } catch (err) {
        console.log(`Failed to add ${jid}:`, err.message);
        failedAdds.push(numberList[i]);
      }
    }

    await conn.groupUpdateDescription(group.id, `Group created by @${sender.split('@')[0]}`);

    await conn.sendMessage(group.id, {
      text: `👋 *Welcome to ${groupName}!* Group created by @${sender.split('@')[0]}`,
      mentions: [sender]
    });

    let response = `╭━━━〔 *✅ GROUP CREATED SUCCESSFULLY* 〕━━⬣
┃📛 *Group name:* ${groupName}
┃👥 *Members added:* ${numberList.length - failedAdds.length}
┃
┃📎 *Invitation link:*
┃https://chat.whatsapp.com/${await conn.groupInviteCode(group.id)}
╰━━━━━━━━━━━━━━━━━━━━⬣

✨ The group is now ready!
👤 You are the founder.
🚀 Invite more people with the link above.
`;

    if (failedAdds.length) {
      response += `\n⚠️ Failed to add these numbers:\n${failedAdds.join(", ")}`;
    }

    return reply(response);

  } catch (e) {
    console.error(e);
    return reply(`❌ *Erreur lors de la création du groupe !*\n\n*Détail:* ${e.message}`);
  }
});
