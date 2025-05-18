const { cmd } = require('../command');
const { sleep } = require('../lib/functions2');

cmd({
  pattern: "broadcast",
  alias: ["bcgroup", "bc"],
  category: "owner",
  desc: "Send a text/media broadcast to all groups and newsletter",
  filename: __filename,
  use: "<text or reply to a media>"
}, async (conn, message, m, { q, isCreator, reply }) => {
  try {
    if (!isCreator) return reply("❌ Only the *bot owner* can use this command.");
    if (!q && !message.quoted) return reply("❌ Provide a text or reply to an image/video!");

    const groupsData = await conn.groupFetchAllParticipating();
    const groupIds = Object.keys(groupsData);
    const failed = [];

    reply(`📣 Broadcasting to *${groupIds.length}* groups and channel...\n⏳ Please wait.`);

    // === SEND TO NEWSLETTER (CHANNEL) FIRST ===
    try {
      const options = {
        contextInfo: {
          mentionedJid: [message.sender],
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363401051937059@newsletter',
            newsletterName: "𝐌𝐄𝐆𝐀𝐋𝐎𝐃𝐎𝐍-𝐌𝐃",
            serverMessageId: 143
          }
        }
      };

      if (message.quoted?.mtype?.includes('image')) {
        const buffer = await message.quoted.download();
        await conn.sendMessage(message.chat, {
          image: buffer,
          caption: q || '',
          ...options
        }, { quoted: message });
      } else if (message.quoted?.mtype?.includes('video')) {
        const buffer = await message.quoted.download();
        await conn.sendMessage(message.chat, {
          video: buffer,
          caption: q || '',
          ...options
        }, { quoted: message });
      } else {
        await conn.sendMessage(message.chat, {
          text: q,
          ...options
        }, { quoted: message });
      }
    } catch (e) {
      console.error("❌ Failed to send to newsletter:", e.message);
    }

    // === BROADCAST TO GROUPS ===
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
        console.error(`❌ Error with ${groupId}:`, err.message);
      }
    }

    reply(`✅ Broadcast finished.\n\n*Success:* ${groupIds.length - failed.length}\n*Failed:* ${failed.length}${failed.length > 0 ? `\n\nFailed groups:\n${failed.join("\n")}` : ""}`);

  } catch (err) {
    console.error("Broadcast Error:", err);
    await m.error(`❌ Error: ${err.message}`, err);
  }
});


const { cmd } = require('../command');
const { sleep } = require('../lib/functions2');

cmd({
  pattern: "broadcastpm",
  alias: ["bcpv", "bcperson"],
  category: "owner",
  desc: "Broadcast a private message to all users and newsletter",
  filename: __filename,
  use: "<text or reply to media>"
}, async (conn, message, m, { q, isCreator, reply }) => {
  try {
    if (!isCreator) return reply("❌ Only the *bot owner* can use this command.");
    if (!q && !message.quoted) return reply("❌ Please provide text or reply to an image/video!");

    const allChats = await conn.chats.all();
    const users = allChats
      .filter(chat => chat.id.endsWith("@s.whatsapp.net"))
      .map(chat => chat.id);

    const failed = [];

    reply(`📬 Sending private messages to *${users.length}* users and to the channel...`);

    // === SEND TO NEWSLETTER (CHANNEL) FIRST ===
    try {
      const options = {
        contextInfo: {
          mentionedJid: [message.sender],
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363401051937059@newsletter',
            newsletterName: "𝐌𝐄𝐆𝐀𝐋𝐎𝐃𝐎𝐍-𝐌𝐃",
            serverMessageId: 143
          }
        }
      };

      if (message.quoted?.mtype?.includes('image')) {
        const buffer = await message.quoted.download();
        await conn.sendMessage(message.chat, {
          image: buffer,
          caption: q || '',
          ...options
        }, { quoted: message });
      } else if (message.quoted?.mtype?.includes('video')) {
        const buffer = await message.quoted.download();
        await conn.sendMessage(message.chat, {
          video: buffer,
          caption: q || '',
          ...options
        }, { quoted: message });
      } else {
        await conn.sendMessage(message.chat, {
          text: q,
          ...options
        }, { quoted: message });
      }
    } catch (e) {
      console.error("❌ Failed to send to newsletter:", e.message);
    }

    // === THEN BROADCAST TO PRIVATE USERS ===
    for (const user of users) {
      try {
        await sleep(1500);

        if (message.quoted && message.quoted.mtype?.includes("image")) {
          const buffer = await message.quoted.download();
          await conn.sendMessage(user, {
            image: buffer,
            caption: q || ''
          });
        } else if (message.quoted && message.quoted.mtype?.includes("video")) {
          const buffer = await message.quoted.download();
          await conn.sendMessage(user, {
            video: buffer,
            caption: q || ''
          });
        } else {
          await conn.sendMessage(user, {
            text: `*📢 Message from the owner:*\n\n${q}`
          });
        }

      } catch (err) {
        failed.push(user);
        console.error(`❌ Failed to send to ${user}:`, err.message);
      }
    }

    reply(`✅ Broadcast completed.\n\n*Success:* ${users.length - failed.length}\n*Failed:* ${failed.length}${failed.length > 0 ? `\n\nFailed users:\n${failed.join("\n")}` : ""}`);

  } catch (err) {
    console.error("BroadcastPM Error:", err);
    await m.error(`❌ Error: ${err.message}`, err);
  }
});
