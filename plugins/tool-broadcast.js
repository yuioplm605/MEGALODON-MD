const { cmd, isOwner } = require('../command.js');

const delay = ms => new Promise(res => setTimeout(res, ms));

cmd({
  pattern: 'broadcast',
  desc: 'Sends a message to all groups',
  category: 'owner',
  filename: __filename,
  react: '🚀',
  owner: true
}, async (conn, mek, m, { q, reply }) => {
  if (!isOwner(m.sender)) return reply('❌ Only the owner can use this command.');

  if (!q) return reply('❌ Please provide a message to send.');

  const allChats = Array.from(conn.store.chats.values());
  const groupChats = allChats.filter(c => c.id.endsWith('@g.us'));

  await reply(`⚡ Sending message to ${groupChats.length} groups with a 90-second delay between each.`);

  for (const group of groupChats) {
    try {
      await conn.sendMessage(group.id, { text: q });
      await delay(90000);
    } catch (e) {
      console.error(`Error sending to group ${group.id}:`, e.message);
    }
  }

  await reply('✅ Message sending completed.');
});

// === BROADCAST TO PRIVATE USERS ===
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
