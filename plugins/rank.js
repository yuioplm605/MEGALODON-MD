const { cmd } = require('../command');
const axios = require('axios');
const config = require('../config');

const userLevels = {};
const calculateLevel = (xp) => Math.floor(0.1 * Math.sqrt(xp));

cmd({
  pattern: "rank",
  desc: "Check the level of a user.",
  react: "📊",
  category: "utility",
  use: ".rank [@mention or reply]",
  filename: __filename,
}, async (conn, mek, m, { reply, mentionedJid }) => {
  try {
    let target;

    if (mentionedJid?.length > 0) {
      target = mentionedJid[0];
    } else if (m.quoted?.sender) {
      target = m.quoted.sender;
    } else {
      target = m.sender;
    }

    if (!target) return reply("❌ Please mention or reply to a user.");

    if (!userLevels[target]) userLevels[target] = { experience: 0, messages: 0 };

    const userData = userLevels[target];
    userData.messages += 1;
    userData.experience += Math.floor(Math.random() * 10) + 5;

    const level = calculateLevel(userData.experience);
    const nextLevelXP = Math.pow((level + 1) / 0.1, 2);
    const currentLevelXP = Math.pow(level / 0.1, 2);
    const progressPercent = Math.floor(
      ((userData.experience - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100
    );
    const clampedProgress = Math.min(100, Math.max(0, progressPercent));
    const progressBar = "⭐".repeat(clampedProgress / 10) + "⚪".repeat(10 - clampedProgress / 10);

    const caption = `👑 *Rank Information*\n\n*Level*: ${level}\n*XP*: ${userData.experience}\n*Progress*: ${clampedProgress}%\n${progressBar}\n*Messages Sent*: ${userData.messages}`;

    // Get thumbnail as buffer
    const thumbnail = await axios.get("https://files.catbox.moe/xc6eca.jpg", {
      responseType: "arraybuffer",
    });

    // Send only the caption with clickable thumbnail
    await conn.sendMessage(
      m.chat,
      {
        text: caption,
        contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 999,
          isForwarded: true,
          externalAdReply: {
            title: "ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅʏʙʏ ᴛᴇᴄʜ",
            body: config.BOT_NAME || "𝐌𝐄𝐆𝐀𝐋𝐎𝐃𝐎𝐍-𝐌𝐃",
            mediaType: 1,
            thumbnail: Buffer.from(thumbnail.data),
            renderLargerThumbnail: true,
            sourceUrl: "https://example.com" // Tu peux changer ce lien
          }
        }
      },
      { quoted: mek }
    );

  } catch (e) {
    console.error("Erreur dans .rank :", e.stack || e.message || e);
    reply(`❌ An error occurred: ${e.message}`);
  }
});