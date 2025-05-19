const { cmd } = require('../command');
const { sleep } = require('../lib/functions');

cmd({
    pattern: "broadcast",
    alias: ["bc", "bcast"],
    use: '.broadcast [message]',
    desc: "Send a message (text or media) to all groups.",
    category: "owner",
    filename: __filename,
    owner: true
}, async (conn, mek, m, { q, quoted, reply }) => {
    try {
        const groups = await conn.groupFetchAllParticipating();
        const groupIds = Object.keys(groups);

        if (!q && !quoted) return reply("✉️ *Please provide a message or reply to a media to broadcast.*");

        reply(`📣 Broadcasting to ${groupIds.length} groups...`);

        let sentTo = [];

        for (const groupId of groupIds) {
            const groupName = groups[groupId]?.subject || 'Unknown Group';

            try {
                if (quoted) {
                    let mime = quoted.mtype.includes('image') ? 'image'
                             : quoted.mtype.includes('video') ? 'video'
                             : quoted.mtype.includes('document') ? 'document'
                             : 'text';

                    await conn.sendMessage(groupId, {
                        [mime]: quoted[mime] || quoted,
                        caption: q || '',
                        contextInfo: {
                            mentionedJid: [m.sender],
                            forwardingScore: 999,
                            isForwarded: true,
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: '120363401051937059@newsletter',
                                newsletterName: "𝐌𝐄𝐆𝐀𝐋𝐎𝐃𝐎𝐍-𝐌𝐃",
                                serverMessageId: 143
                            }
                        }
                    });
                } else {
                    await conn.sendMessage(groupId, {
                        text: `📢 *Broadcast*\n\n${q}`,
                        contextInfo: {
                            mentionedJid: [m.sender],
                            forwardingScore: 999,
                            isForwarded: true,
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: '120363401051937059@newsletter',
                                newsletterName: "𝐌𝐄𝐆𝐀𝐋𝐎𝐃𝐎𝐍-𝐌𝐃",
                                serverMessageId: 143
                            }
                        }
                    });
                }

                sentTo.push(groupName);
                await sleep(1000); // Delay to prevent flooding

            } catch (err) {
                console.log(`Error sending to ${groupName} (${groupId})`, err);
            }
        }

        const summary = `✅ Broadcast completed to ${sentTo.length} groups:\n\n` + sentTo.map(name => `- ${name}`).join('\n');
        reply(summary);

    } catch (e) {
        console.log(e);
        reply('❌ Error during broadcast.');
    }
});
