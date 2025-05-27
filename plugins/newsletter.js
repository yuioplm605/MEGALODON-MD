//PLUGIN CREATED BY DYBY TECH🤍


const { cmd } = require('../command');

cmd({
    pattern: "newsletter",
    alias: ["nwt"],
    desc: "Displays the @newsletter ID from a WhatsApp channel or link",
    category: "tools",
    react: "📰",
    filename: __filename
}, async (conn, mek, m, { args }) => {
    const input = args.join(" ").trim(); // ← corrige la récupération de l'argument
    const currentJid = m.chat;

    const channelLinkRegex = /https?:\/\/whatsapp\.com\/channel\/([a-zA-Z0-9]+)/;
    const linkMatch = input.match(channelLinkRegex);

    // Cas 1 : Lien détecté
    if (linkMatch) {
        const channelCode = linkMatch[1];
        return conn.sendMessage(currentJid, {
            text: `🔗 *Channel link detected!*\n\n*Link:* ${linkMatch[0]}\n*Channel Code:* \`${channelCode}\`\n\n⚠️ Can't resolve full JID unless I'm inside that channel.`
        }, { quoted: mek });
    }

    // Cas 2 : Utilisé dans un canal WhatsApp
    if (currentJid.endsWith("@newsletter")) {
        const now = new Date().toLocaleString("en-US", { timeZone: "UTC", hour12: true });
        await conn.sendMessage(currentJid, {
            text: `🆔 *Channel JID:*\n\n*${currentJid}*\n\n🕒 *Executed on:* ${now}`
        }, { quoted: mek });

        const fakeNewsletterJid = '120363312841480579@newsletter';
        const fakeNewsletterName = '𝑵𝒆𝒘𝒔𝒍𝒆𝒕𝒕𝒆𝒓 𝑿';
        const serverMessageId = 101;

        await conn.sendMessage(
            currentJid,
            {
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
            },
            { quoted: mek }
        );
        return;
    }

    // Cas 3 : Ni lien ni canal
    return conn.sendMessage(currentJid, {
        text: "❌ Please provide a WhatsApp *channel link* or use this command *inside a WhatsApp Channel*."
    }, { quoted: mek });
});

// 22222222 by DybyTech 

cmd({
  pattern: "idch",
  alias: ["idchannel"],
  desc: "Get WhatsApp Channel ID from the invite link",
  category: "tools",
  filename: __filename
}, async (conn, m, store, {
  args,
  reply
}) => {
  const text = args[0];

  if (!text) {
    return reply("❌ Missing link.\n\nExample:\n.idch https://whatsapp.com/channel/abc123XYZ");
  }

  const match = text.match(/^https:\/\/whatsapp\.com\/channel\/([A-Za-z0-9]+)$/);
  if (!match) {
    return reply("❌ Invalid link format.\nIt must look like:\nhttps://whatsapp.com/channel/abc123XYZ");
  }

  const channelCode = match[1];
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

    if (!metadata) {
      return reply("❌ Failed to fetch channel metadata.");
    }

    const message = `
✅ *Channel Metadata:*
*ID:* ${jid}
*Name:* ${metadata.name || 'Unknown'}
*Owner:* ${metadata.creator || 'Unavailable'}
*Description:* ${metadata.description || 'No description'}
*Creation Time:* ${metadata.creation || 'Unknown'}
    `.trim();

    return reply(message);
  } catch (error) {
    console.error("Metadata fetch error:", error);
    return reply("❌ An error occurred while fetching channel metadata.");
  }
});

//PLUGIN CREATED BY DYBY TECH
