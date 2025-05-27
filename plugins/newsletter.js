const { cmd } = require('../command');

cmd({
  pattern: "channelinfo",
  alias: ["idch", "idchannel", "nwt", "newsletter"],
  desc: "Get WhatsApp Channel information by link or from inside a channel",
  category: "tools",
  react: "🧾",
  filename: __filename
}, async (conn, m, store, { args, reply }) => {
  const input = args.join(" ").trim();
  const currentJid = m.chat;

  const channelLinkRegex = /https?:\/\/whatsapp\.com\/channel\/([a-zA-Z0-9]+)/;
  const linkMatch = input.match(channelLinkRegex);

  // Case 1: Link detected
  if (linkMatch) {
    const channelCode = linkMatch[1];
    const jid = `${channelCode}@newsletter`;

    try {
      const res = await conn.query({
        tag: "iq",
        attrs: {
          to: jid,
          type: "get",
          xmlns: "w:newsletter"
        },
        content: [{ tag: "newsletter", attrs: {} }]
      });

      const metadata = res?.content?.[0]?.attrs;
      if (!metadata) return reply("❌ Failed to fetch channel metadata.");

      const message = `
✅ *Channel Info:*
• *ID:* ${jid}
• *Name:* ${metadata.name || 'Unknown'}
• *Owner:* ${metadata.creator || 'Unavailable'}
• *Description:* ${metadata.description || 'None'}
• *Created on:* ${metadata.creation || 'Unknown'}

© Plugin by *DybyTech*
      `.trim();

      return reply(message);
    } catch (error) {
      console.error("Metadata fetch error:", error);
      return reply("❌ An error occurred while fetching channel metadata.");
    }
  }

  // Case 2: Command used inside a WhatsApp channel
  if (currentJid.endsWith("@newsletter")) {
    const now = new Date().toLocaleString("en-US", { timeZone: "UTC" });

    await conn.sendMessage(currentJid, {
      text: `🆔 *Channel ID:*\n\n*${currentJid}*\n\n🕒 Executed on: ${now}\n\n© DybyTech`
    }, { quoted: m });

    const fakeNewsletterJid = '120363312841480579@newsletter';
    const fakeNewsletterName = '𝑵𝒆𝒘𝒔𝒍𝒆𝒕𝒕𝒆𝒓 𝑿';
    const serverMessageId = 101;

    return conn.sendMessage(currentJid, {
      text: `📨 *Forwarded from another newsletter:*\n\n*${currentJid}*`,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: fakeNewsletterJid,
          newsletterName: fakeNewsletterName,
          serverMessageId: serverMessageId
        }
      }
    }, { quoted: m });
  }

  // Case 3: Neither link nor inside channel
  return reply("❌ Please provide a WhatsApp *channel link* or use this command *inside a WhatsApp Channel*.");
});
