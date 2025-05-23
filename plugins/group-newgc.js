//---------------------------------------------------------------------------
 //           MEGALODON-MD 
 //---------------------------------------------------------------------------
 //  ⚠️ DO NOT MODIFY THIS FILE ⚠️
 //---------------------------------------------------------------------------
const { cmd } = require('../command');
const config = require('../config');
const prefix = config.PREFIX;
const { isUrl } = require('../lib/functions2');

cmd({
  pattern: "newgc",
  category: "group",
  desc: "Create a new group and add participants.",
  filename: __filename,
  use: `${prefix}newgc group_name;number1,number2,...`,
  owner: true, // <- restriction au propriétaire
}, async (conn, mek, m, { from, isGroup, body, sender, isOwner, reply }) => {
  try {
    if (!isOwner) return reply("❌ *Only the bot owner can use this command.*");

    if (!body) {
      return reply(`Usage: ${prefix}newgc group_name;number1,number2,...`);
    }

    const [groupName, numbersString] = body.split(";");

    if (!groupName || !numbersString) {
      return reply(`Usage: ${prefix}newgc group_name;number1,number2,...`);
    }

    const participantNumbers = numbersString
      .split(",")
      .map(n => n.trim())
      .filter(n => /^\d{7,15}$/.test(n))
      .map(n => `${n}@s.whatsapp.net`);

    if (participantNumbers.length === 0) {
      return reply("Please provide at least one valid phone number.");
    }

    const group = await conn.groupCreate(groupName, participantNumbers);
    const inviteCode = await conn.groupInviteCode(group.id);

    await conn.sendMessage(group.id, {
      text: `*Welcome to ${groupName}!* 🎉\n\nThis group was created by @${sender.split("@")[0]}`,
      mentions: [sender]
    });

    reply(`✅ Group *${groupName}* created successfully!\n\nInvite link: https://chat.whatsapp.com/${inviteCode}`);

  } catch (e) {
    console.error(e);
    return reply(`❌ *An error occurred while creating the group.*\n\nError: ${e.message}`);
  }
});
