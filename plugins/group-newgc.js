const { cmd } = require('../command');
const config = require('../config');
const prefix = config.PREFIX;
const axios = require('axios');

cmd({
  pattern: "newgc",
  category: "group",
  desc: "Create a group with specified members and profile picture.",
  filename: __filename,
  use: `${prefix}newgc GroupName + 229XXXXXXXX,229YYYYYYYY`,
  owner: true,
}, async (conn, mek, m, { body, sender, isOwner, reply }) => {
  try {
    if (!isOwner) return reply("❌ Only the bot owner can use this command.");
    if (!body.includes("+")) return reply(`Usage: ${prefix}newgc GroupName + number1,number2`);

    const [groupNameRaw, numbersRaw] = body.split("+");
    const groupName = groupNameRaw.trim();
    const numberList = numbersRaw.split(",").map(n => n.trim());

    if (!groupName || numberList.length === 0) return reply("❌ Provide a group name and at least one number.");

    // Convert numbers to WhatsApp IDs
    const participants = numberList.map(n => (n.includes('@s.whatsapp.net') ? n : `${n}@s.whatsapp.net`));

    // Create group
    const group = await conn.groupCreate(groupName, participants);
    const inviteCode = await conn.groupInviteCode(group.id);

    // Description (optional)
    await conn.groupUpdateDescription(group.id, `Group created by @${sender.split('@')[0]}`);

    // Profile picture
    const imageUrl = 'https://files.catbox.moe/rl8ii3.jpg';
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    await conn.updateProfilePicture(group.id, { jpegThumbnail: response.data });

    // Welcome in group
    await conn.sendMessage(group.id, {
      text: `👋 *Welcome to ${groupName}!* Group created by @${sender.split('@')[0]}`,
      mentions: [sender]
    });

    // Confirmation
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
    return reply(`❌ An error occurred while creating the group.\n\n_Error:_ ${e.message}`);
  }
});
