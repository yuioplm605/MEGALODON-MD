//Give Me Credit If Using This File Give Me Credit On Your Channel ✅ 
//https://whatsapp.com/channel/0029VbAdcIXJP216dKW1253g
// Credits DybyTech - MEGALODON-MD 💜 

const { isJidGroup } = require('@whiskeysockets/baileys');
const config = require('../config');

const getContextInfo = (m) => ({
    mentionedJid: [m.sender],
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363401051937059@newsletter',
        newsletterName: '𝐌𝐄𝐆𝐀𝐋𝐎𝐃𝐎𝐍-𝐌𝐃',
        serverMessageId: 143,
    },
});

const fallbackPP = 'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png';

const GroupEvents = async (conn, update) => {
    try {
        if (!isJidGroup(update.id) || !Array.isArray(update.participants)) return;

        const metadata = await conn.groupMetadata(update.id);
        const participants = update.participants;
        const desc = metadata.desc || "No Description.";
        const groupMembersCount = metadata.participants.length;

        let ppUrl;
        try {
            ppUrl = await conn.profilePictureUrl(update.id, 'image');
        } catch {
            ppUrl = fallbackPP;
        }

        for (const num of participants) {
            const userName = num.split("@")[0];
            const timestamp = new Date().toLocaleString();

            if (update.action === "add" && config.WELCOME === "true") {
                const text = `╭──❍ *ᴍᴇɢᴀʟᴏᴅᴏɴ ᴡᴇʟᴄᴏᴍᴇ* ❍──╮\n` +
                             `│👋 Hey @${userName}\n` +
                             `│🏠 Welcome to *${metadata.subject}*\n` +
                             `│🧮 Member #${groupMembersCount}\n` +
                             `│⏰ Joined: *${timestamp}*\n` +
                             `│📜 Description:\n│ ${desc}\n` +
                             `╰─❍ *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅʏʙʏ ᴛᴇᴄʜ* ❍─╯`;

                await conn.sendMessage(update.id, {
                    image: { url: ppUrl },
                    caption: text,
                    mentions: [num],
                    contextInfo: getContextInfo({ sender: num }),
                });

            } else if (update.action === "remove" && config.WELCOME === "true") {
                const text = `╭──❍ *ᴍᴇɢᴀʟᴏᴅᴏɴ ɢᴏᴏᴅʙʏᴇ* ❍──╮\n` +
                             `│😢 Goodbye @${userName}\n` +
                             `│🚪 You left the group.\n` +
                             `│⏰ Time: *${timestamp}*\n` +
                             `│👥 Now ${groupMembersCount} members\n` +
                             `╰─❍ *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅʏʙʏ ᴛᴇᴄʜ* ❍─╯`;

                await conn.sendMessage(update.id, {
                    image: { url: ppUrl },
                    caption: text,
                    mentions: [num],
                    contextInfo: getContextInfo({ sender: num }),
                });

            } else if (update.action === "demote" && config.ADMIN_EVENTS === "true") {
                const demoter = update.author.split("@")[0];
                const text = `╭──❍ *ʀᴜɴᴛɪᴍᴇ ᴅᴇᴍᴏᴛᴇ* ❍──╮\n` +
                             `│🔻 @${demoter} demoted @${userName}\n` +
                             `│⏰ Time: *${timestamp}*\n` +
                             `│📛 Group: *${metadata.subject}*\n` +
                             `╰─❍ *ᴍᴇɢᴀʟᴏᴅᴏɴ-ᴍᴅ ɴᴏᴛɪғʏ* ❍─╯`;

                await conn.sendMessage(update.id, {
                    text,
                    mentions: [update.author, num],
                    contextInfo: getContextInfo({ sender: update.author }),
                });

            } else if (update.action === "promote" && config.ADMIN_EVENTS === "true") {
                const promoter = update.author.split("@")[0];
                const text = `╭──❍ *ᴍᴇɢᴀʟᴏᴅᴏɴ
 ᴘʀᴏᴍᴏᴛᴇ* ❍──╮\n` +
                             `│🔺 @${promoter} promoted @${userName}\n` +
                             `│⏰ Time: *${timestamp}*\n` +
                             `│📛 Group: *${metadata.subject}*\n` +
                             `╰─❍ *ᴍᴇɢᴀʟᴏᴅᴏɴ-ᴍᴅ
 ɴᴏᴛɪғʏ* ❍─╯`;

                await conn.sendMessage(update.id, {
                    text,
                    mentions: [update.author, num],
                    contextInfo: getContextInfo({ sender: update.author }),
                });
            }
        }
    } catch (err) {
        console.error('Group event error:', err);
    }
};

module.exports = GroupEvents;
