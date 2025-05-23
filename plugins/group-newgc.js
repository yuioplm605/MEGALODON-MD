//---------------------------------------------------------------------------
 //        MEGALODON-MD - newgc Plugin (image from URL - English)
 //---------------------------------------------------------------------------
const { cmd } = require('../command');
const config = require('../config');
const prefix = config.PREFIX;
const axios = require('axios');

cmd({
  pattern: "newgc",
  category: "group",
  desc: "Create a WhatsApp group with profile picture and no initial members.",
  filename: __filename,
  use: `${prefix}newgc GroupName|Description`,
  owner: true,
}, async (conn, mek, m, { body, sender, isOwner, reply }) => {
  try {
    if (!isOwner) return reply("❌ Only the bot owner can use this command.");
    if (!body.includes("|")) return reply(`Usage: ${prefix}newgc GroupName|Description`);

    const [groupName, groupDesc] = body.split("|");
    if (!groupName) return reply("❌ Group name is required.");

    const group = await conn.groupCreate(groupName, [`${sender}`]);
    const inviteCode = await conn.groupInviteCode(group.id);

    if (groupDesc) {
      await conn.groupUpdateDescription(group.id, groupDesc);
    }

    // Fetch image from URL
    const imageUrl = 'https://files.catbox.moe/rl8ii3.jpg';
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imageBuffer = response.data;

    // Set group profile picture
    await conn.updateProfilePicture(group.id, { jpegThumbnail: imageBuffer });

    // Welcome message in group
    await conn.sendMessage(group.id, {
      text: `👋 *Welcome to ${groupName}!* This group was created by @${sender.split("@")[0]}`,
      mentions: [sender]
    });

    // Stylish private confirmation message
    return reply(`╭━━━〔 *✅ GROUP CREATED SUCCESSFULLY* 〕━━⬣
┃📛 *Group name:* ${groupName}
┃📝 *Description:*
┃${groupDesc || "No description provided"}
┃
┃📎 *Invitation link:*
┃https://chat.whatsapp.com/${inviteCode}
╰━━━━━━━━━━━━━━━━━━━━⬣

✨ Your group is now ready!
👤 You’ve been added as the founder.
🚀 Start inviting people to join!`);

  } catch (e) {
    console.error(e);
    return reply(`❌ An error occurred while creating the group.\n\n_Error:_ ${e.message}`);
  }
});
