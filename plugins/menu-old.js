const config = require('../config');
const { cmd } = require('../command');
const { runtime } = require('../lib/functions');
const os = require("os");
const axios = require('axios');

cmd({
    pattern: "menu2",
    desc: "menu the bot",
    category: "menu2",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, sender, pushname, reply }) => {
    try {
        const dec = `╭━〔 𝐌𝐄𝐆𝐀𝐋𝐎𝐃𝐎𝐍-𝐌𝐃 〕━╮
┃ ✨ *Owner:* ${config.OWNER_NAME}
┃ ⚙️ *Mode:* ${config.MODE}
┃ 📡 *Platform:* Heroku
┃ 🧠 *Type:* NodeJs (Multi Device)
┃ ⌨️ *Prefix:* ${config.PREFIX}
┃ 🧾 *Version:* 1.0.0 Beta
╰━━━━━━━━━━━━━━━━━━━━╯

╭━━〔 🧩 *Command Categories* 〕━╮
┃ ⭐️ Repormenu
┃ 📖 Quranmenu
┃ 🕋 Prayertime
┃ 🤖 Aimenu
┃ 🎭 Anmiemenu
┃ 😹 Reactions
┃ 🔁 Convertmenu
┃ 🎉 Funmenu
┃ ⬇️ Dlmenu
┃ ⚒️ Listcmd
┃ 🏠 Mainmenu
┃ 👥 Groupmenu
┃ 📜 Allmenu
┃ 👑 Ownermenu
┃ 🧩 Othermenu
┃ 🖌️ Logo
┃ 📦 Repo
╰━━━━━━━━━━━━━━━━━━━━━━╯
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅʏʙʏ ᴛᴇᴄʜ*
`;

        await conn.sendMessage(
            from,
            {
                image: { url: `https://files.catbox.moe/rful77.jpg` },
                caption: dec,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363401051937059@newsletter',
                        newsletterName: '𝗠𝗘𝗚𝗔𝗟𝗢𝗗𝗢𝗡',
                        serverMessageId: 143
                    }
                }
            },
            { quoted: mek }
        );

        

    } catch (e) {
        console.error(e);
        reply(`❌ Error:\n${e}`);
    }
});

cmd({
    pattern: "logo",
    alias: ["logomenu"],
    desc: "menu the bot",
    category: "menu",
    react: "🧃",
    filename: __filename
}, 
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        let dec = `╭┈──────────────────
│  🎨 𝐋𝐎𝐆𝐎 𝐌𝐄𝐍𝐔
╭┈──────────────────
│  ◦  ɴᴇᴏɴʟɪɢʜᴛ
│  ◦  ʙʟᴀᴄᴋᴘɪɴᴋ
│  ◦  ᴅʀᴀɢᴏɴʙᴀʟʟ
│  ◦  𝟹ᴅᴄᴏᴍɪᴄ
│  ◦  ᴀᴍᴇʀɪᴄᴀ
│  ◦  ɴᴀʀᴜᴛᴏ
│  ◦  sᴀᴅɢɪʀʟ
│  ◦  ᴄʟᴏᴜᴅs
│  ◦  ғᴜᴛᴜʀɪsᴛɪᴄ
│  ◦  𝟹ᴅᴘᴀᴘᴇʀ
│  ◦  ᴇʀᴀsᴇʀ
│  ◦  sᴜɴsᴇᴛ
│  ◦  ʟᴇᴀғ
│  ◦  ɢᴀʟᴀxʏ
│  ◦  sᴀɴs
│  ◦  ʙᴏᴏᴍ
│  ◦  ʜᴀᴄᴋᴇʀ
│  ◦  ᴅᴇᴠɪʟᴡɪɴɢs
│  ◦  ɴɪɢᴇʀɪᴀ
│  ◦  ʙᴜʟʙ
│  ◦  ᴀɴɢᴇʟᴡɪɴɢs
│  ◦  ᴢᴏᴅɪᴀᴄ
│  ◦  ʟᴜxᴜʀʏ
│  ◦  ᴘᴀɪɴᴛ
│  ◦  ғʀᴏᴢᴇɴ
│  ◦  ᴄᴀsᴛʟᴇ
│  ◦  ᴛᴀᴛᴏᴏ
│  ◦  ᴠᴀʟᴏʀᴀɴᴛ
│  ◦  ʙᴇᴀʀ
│  ◦  ᴛʏᴘᴏɢʀᴀᴘʜʏ
│  ◦  ʙɪʀᴛʜᴅᴀʏ
╰┈────────────────•
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅʏʙʏ ᴛᴇᴄʜ*`;

        await conn.sendMessage(
            from,
            {
                image: { url: `https://files.catbox.moe/rful77.jpg` },
                caption: dec,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363372853772240@newsletter',
                        newsletterName: "𝗠𝗘𝗚𝗔𝗟𝗢𝗗𝗢𝗡",
                        serverMessageId: 143
                    }
                }
            },
            { quoted: mek }
        );

    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});

cmd({
    pattern: "reactions",
    desc: "Shows the reaction commands",
    category: "menu",
    react: "💫",
    filename: __filename
}, 
async (conn, mek, m, { from, quoted, reply }) => {
    try {
        let dec = `╭┈──────────────────
│  🎭 𝐑𝐄𝐀𝐂𝐓𝐈𝐎𝐍𝐒 𝐌𝐄𝐍𝐔
╭┈──────────────────
│  ◦  ʙᴜʟʟʏ @ᴛᴀɢ
│  ◦  ᴄᴜᴅᴅʟᴇ @ᴛᴀɢ
│  ◦  ᴄʀʏ @ᴛᴀɢ
│  ◦  ʜᴜɢ @ᴛᴀɢ
│  ◦  ᴀᴡᴏᴏ @ᴛᴀɢ
│  ◦  ᴋɪss @ᴛᴀɢ
│  ◦  ʟɪᴄᴋ @ᴛᴀɢ
│  ◦  ᴘᴀᴛ @ᴛᴀɢ
│  ◦  sᴍᴜɢ @ᴛᴀɢ
│  ◦  ʙᴏɴᴋ @ᴛᴀɢ
│  ◦  ʏᴇᴇᴛ @ᴛᴀɢ
│  ◦  ʙʟᴜsʜ @ᴛᴀɢ
│  ◦  sᴍɪʟᴇ @ᴛᴀɢ
│  ◦  ᴡᴀᴠᴇ @ᴛᴀɢ
│  ◦  ʜɪɢʜғɪᴠᴇ @ᴛᴀɢ
│  ◦  ʜᴀɴᴅʜᴏʟᴅ @ᴛᴀɢ
│  ◦  ɴᴏᴍ @ᴛᴀɢ
│  ◦  ʙɪᴛᴇ @ᴛᴀɢ
│  ◦  ɢʟᴏᴍᴘ @ᴛᴀɢ
│  ◦  sʟᴀᴘ @ᴛᴀɢ
│  ◦  ᴋɪʟʟ @ᴛᴀɢ
│  ◦  ʜᴀᴘᴘʏ @ᴛᴀɢ
│  ◦  ᴡɪɴᴋ @ᴛᴀɢ
│  ◦  ᴘᴏᴋᴇ @ᴛᴀɢ
│  ◦  ᴅᴀɴᴄᴇ @ᴛᴀɢ
│  ◦  ᴄʀɪɴɢᴇ @ᴛᴀɢ
╰┈────────────────•
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅʏʙʏ ᴛᴇᴄʜ*`;

        await conn.sendMessage(
            from,
            {
                image: { url: `https://files.catbox.moe/rful77.jpg` },
                caption: dec,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363372853772240@newsletter',
                        newsletterName: '𝗠𝗘𝗚𝗔𝗟𝗢𝗗𝗢𝗡',
                        serverMessageId: 144
                    }
                }
            },
            { quoted: mek }
        );

    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});


cmd({
    pattern: "reportmenu",
    desc: "Shows the report commands",
    category: "menu",
    react: "⭐️",
    filename: __filename
}, 
async (conn, mek, m, { from, quoted, reply }) => {
    try {
        let dec = `╭┈──────────────────
│ ⭐️ 𝐑𝐄𝐏𝐎𝐑𝐓 𝐌𝐄𝐍𝐔
╭┈──────────────────
│  ◦  ʀᴇᴘᴏʀᴛ <text>
│  ◦  ʀᴇᴘᴏʀᴛʟɪsᴛ
│  ◦  ᴅᴇʟʀᴇᴘᴏʀᴛ
╰┈────────────────•
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅʏʙʏ ᴛᴇᴄʜ*`;

        await conn.sendMessage(
            from,
            {
                image: { url: `https://files.catbox.moe/rful77.jpg` },
                caption: dec,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363372853772240@newsletter',
                        newsletterName: '𝗠𝗘𝗚𝗔𝗟𝗢𝗗𝗢𝗡',
                        serverMessageId: 144
                    }
                }
            },
            { quoted: mek }
        );

    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});

// dlmenu

cmd({
    pattern: "dlmenu",
    desc: "menu the bot",
    category: "menu",
    react: "⤵️",
    filename: __filename
}, 
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        let dec = `╭┈──────────────────
│  📥 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃 𝐌𝐄𝐍𝐔
╭┈──────────────────
│  ◦  ғᴀᴄᴇʙᴏᴏᴋ
│  ◦  ᴍᴇᴅɪᴀғɪʀᴇ
│  ◦  ᴛɪᴋᴛᴏᴋ
│  ◦  ᴛᴡɪᴛᴛᴇʀ
│  ◦  ɪɴsᴛᴀ
│  ◦  ᴀᴘᴋ
│  ◦  ɪᴍɢ
│  ◦  ᴛᴛ𝟸
│  ◦  ᴘɪɴs
│  ◦  ᴀᴘᴋ𝟸
│  ◦  ғʙ𝟸
│  ◦  ᴘɪɴᴛᴇʀᴇsᴛ
│  ◦  sᴘᴏᴛɪғʏ
│  ◦  ᴘʟᴀʏ
│  ◦  ᴘʟᴀʏ𝟸
│  ◦  ᴀᴜᴅɪᴏ
│  ◦  ᴠɪᴅᴇᴏ
│  ◦  ᴠɪᴅᴇᴏ𝟸
│  ◦  ʏᴛᴍᴘ𝟹
│  ◦  ʏᴛᴍᴘ𝟺
│  ◦  sᴏɴɢ
│  ◦  ᴅᴀʀᴀᴍᴀ
│  ◦  ɢᴅʀɪᴠᴇ
│  ◦  ssᴡᴇʙ
│  ◦  ᴛɪᴋs
╰┈────────────────•
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅʏʙʏ ᴛᴇᴄʜ*`;

        await conn.sendMessage(
            from,
            {
                image: { url: `https://files.catbox.moe/rful77.jpg` },
                caption: dec,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363372853772240@newsletter',
                        newsletterName: '𝗠𝗘𝗚𝗔𝗟𝗢𝗗𝗢𝗡',
                        serverMessageId: 143
                    }
                }
            },
            { quoted: mek }
        );

    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});

// group menu

cmd({
    pattern: "groupmenu",
    desc: "menu the bot",
    category: "menu",
    react: "⤵️",
    filename: __filename
}, 
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try
       {
        let dec = `╭┈──────────────────
│  👥 𝐆𝐑𝐎𝐔𝐏 𝐌𝐄𝐍𝐔
╭┈──────────────────
│  ◦   ɢʀᴏᴜᴘʟɪɴᴋ
│  ◦   ᴋɪᴄᴋᴀʟʟ
│  ◦   ᴋɪᴄᴋᴀʟʟ𝟸
│  ◦   ᴋɪᴄᴋᴀʟʟ𝟹
│  ◦   ᴀᴅᴅ
│  ◦   ʀᴇᴍᴏᴠᴇ
│  ◦   ᴋɪᴄᴋ
│  ◦   ᴘʀᴏᴍᴏᴛᴇ
│  ◦   ᴅᴇᴍᴏᴛᴇ
│  ◦   ᴅɪsᴍɪss
│  ◦   ʀᴇᴠᴏᴋᴇ
│  ◦   sᴇᴛɢᴏᴏᴅʙʏᴇ
│  ◦   sᴇᴛᴡᴇʟᴄᴏᴍᴇ
│  ◦   ᴅᴇʟᴇᴛᴇ
│  ◦   ɢᴇᴛᴘɪᴄ
│  ◦   ɢɪɴғᴏ
│  ◦   ᴅɪsᴀᴘᴘᴇᴀʀ ᴏɴ
│  ◦   ᴅɪsᴀᴘᴘᴇᴀʀ ᴏғғ
│  ◦   ᴅɪsᴀᴘᴘᴇᴀʀ 𝟽ᴅ,𝟸𝟺ʜ
│  ◦   ᴀʟʟʀᴇǫ
│  ◦   ᴜᴘᴅᴀᴛᴇɢɴᴀᴍᴇ
│  ◦   ᴜᴘᴅᴀᴛᴇɢᴅᴇsᴄ
│  ◦   ᴊᴏɪɴʀᴇǫᴜᴇsᴛs
│  ◦   sᴇɴᴅᴅᴍ
│  ◦   ɴɪᴋᴀʟ
│  ◦   ᴍᴜᴛᴇ
│  ◦   ᴜɴᴍᴜᴛᴇ
│  ◦   ʟᴏᴄᴋɢᴄ
│  ◦   ᴜɴʟᴏᴄᴋɢᴄ
│  ◦   ɪɴᴠɪᴛᴇ
│  ◦   ᴛᴀɢ
│  ◦   ʜɪᴅᴇᴛᴀɢ
│  ◦   ᴛᴀɢᴀʟʟ
│  ◦   ᴛᴀɢᴀᴅᴍɪɴs
╰┈────────────────•
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅʏʙʏ ᴛᴇᴄʜ*`;

        await conn.sendMessage(
            from,
            {
                image: { url: `https://files.catbox.moe/rful77.jpg` },
                caption: dec,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363372853772240@newsletter',
                        newsletterName: '𝗠𝗘𝗚𝗔𝗟𝗢𝗗𝗢𝗡',
                        serverMessageId: 143
                    }
                }
            },
            { quoted: mek }
        );

    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});

// fun menu

cmd({
    pattern: "funmenu",
    desc: "menu the bot",
    category: "menu",
    react: "😎",
    filename: __filename
}, 
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {

        let dec = `╭┈──────────────────
│  🎮 𝐅𝐔𝐍 𝐌𝐄𝐍𝐔
╭┈──────────────────
│  ◦  sʜᴀᴘᴀʀ
│  ◦  ʀᴀᴛᴇ
│  ◦  ɪɴsᴜʟᴛ
│  ◦  ʜᴀᴄᴋ
│  ◦  sʜɪᴘ
│  ◦  ᴄʜᴀʀᴀᴄᴛᴇʀ
│  ◦  ᴘɪᴄᴋᴜᴘ
│  ◦  ᴊᴏᴋᴇ
│  ◦  ʜʀᴛ
│  ◦  ʜᴘʏ
│  ◦  sʏᴅ
│  ◦  ᴀɴɢᴇʀ
│  ◦  sʜʏ
│  ◦  ᴋɪss
│  ◦  ᴍᴏɴ
│  ◦  ᴄᴜɴғᴜᴢᴇᴅ
│  ◦  sᴇᴛᴘᴘ
│  ◦  ʜᴀɴᴅ
│  ◦  ɴɪᴋᴀʟ
│  ◦  ʜᴏʟᴅ
│  ◦  ʜᴜɢ
│  ◦  ɴɪᴋᴀʟ
│  ◦  ʜɪғɪ
│  ◦  ᴘᴏᴋᴇ
╰┈────────────────•
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅʏʙʏ ᴛᴇᴄʜ*`;

        await conn.sendMessage(
            from,
            {
                image: { url: `https://files.catbox.moe/rful77.jpg` },
                caption: dec,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363372853772240@newsletter',
                        newsletterName: '𝗠𝗘𝗚𝗔𝗟𝗢𝗗𝗢𝗡',
                        serverMessageId: 143
                    }
                }
            },
            { quoted: mek }
        );

    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});

// other menu

cmd({
    pattern: "othermenu",
    desc: "menu the bot",
    category: "menu",
    react: "🤖",
    filename: __filename
}, 
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        let dec = `╭┈──────────────────
│  📦 𝐎𝐓𝐇𝐄𝐑 𝐌𝐄𝐍𝐔
╭┈──────────────────
│  ◦  ᴛɪᴍᴇɴᴏᴡ
│  ◦  ᴅᴀᴛᴇ
│  ◦  ᴄᴏᴜɴᴛ
│  ◦  ᴄᴀʟᴄᴜʟᴀᴛᴇ
│  ◦  ᴄᴏᴜɴᴛx
│  ◦  ғʟɪᴘ
│  ◦  ᴄᴏɪɴғʟɪᴘ
│  ◦  ʀᴄᴏʟᴏʀ
│  ◦  ʀᴏʟʟ
│  ◦  ғᴀᴄᴛ
│  ◦  ᴄᴘᴘ
│  ◦  ʀᴡ
│  ◦  ᴘᴀɪʀ
│  ◦  ᴘᴀɪʀ𝟸
│  ◦  ᴘᴀɪʀ𝟹
│  ◦  ғᴀɴᴄʏ
│  ◦  ʟᴏɢᴏ <ᴛᴇxᴛ>
│  ◦  ᴅᴇғɪɴᴇ
│  ◦  ɴᴇᴡs
│  ◦  ᴍᴏᴠɪᴇ
│  ◦  ᴡᴇᴀᴛʜᴇʀ
│  ◦  sʀᴇᴘᴏ
│  ◦  ɪɴsᴜʟᴛ
│  ◦  sᴀᴠᴇ
│  ◦  ᴡɪᴋɪᴘᴇᴅɪᴀ
│  ◦  ɢᴘᴀss
│  ◦  ɢɪᴛʜᴜʙsᴛᴀʟᴋ
│  ◦  ʏᴛs
│  ◦  ʏᴛᴠᴇ
╰┈────────────────•
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅʏʙʏ ᴛᴇᴄʜ*`;

        await conn.sendMessage(
            from,
            {
                image: { url: `https://files.catbox.moe/rful77.jpg` },
                caption: dec,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363372853772240@newsletter',
                        newsletterName: '𝗠𝗘𝗚𝗔𝗟𝗢𝗗𝗢𝗡',
                        serverMessageId: 143
                    }
                }
            },
            { quoted: mek }
        );

    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});

// main menu

cmd({
    pattern: "mainmenu",
    desc: "menu the bot",
    category: "menu",
    react: "🗿",
    filename: __filename
}, 
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        let dec = `╭┈──────────────────
│  🛠️ 𝐌𝐀𝐈𝐍 𝐌𝐄𝐍𝐔
╭┈──────────────────
│  ◦  ɴᴇᴡsʟᴇᴛᴛᴇʀ
│  ◦  ᴘɪɴɢ
│  ◦  ᴘɪɴɢ𝟸
│  ◦  sᴘᴇᴇᴅ
│  ◦  ʟɪᴠᴇ
│  ◦  ᴀʟɪᴠᴇ
│  ◦  ʀᴜɴᴛɪᴍᴇ
│  ◦  ᴜᴘᴛɪᴍᴇ
│  ◦  ʀᴇᴘᴏ
│  ◦  ᴏᴡɴᴇʀ
│  ◦  ᴍᴇɴᴜ
│  ◦  ᴍᴇɴᴜ𝟸
│  ◦  ʀᴇsᴛᴀʀᴛ
╰┈────────────────•
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅʏʙʏ ᴛᴇᴄʜ*`;

        await conn.sendMessage(
            from,
            {
                image: { url: `https://files.catbox.moe/rful77.jpg` },
                caption: dec,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363372853772240@newsletter',
                        newsletterName: '𝗠𝗘𝗚𝗔𝗟𝗢𝗗𝗢𝗡',
                        serverMessageId: 143
                    }
                }
            },
            { quoted: mek }
        );

    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});

// owner menu

cmd({
    pattern: "ownermenu",
    desc: "menu the bot",
    category: "menu",
    react: "🔰",
    filename: __filename
}, 
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        let dec = `╭┈──────────────────
│  👑 𝐎𝐖𝐍𝐄𝐑 𝐌𝐄𝐍𝐔
╭┈──────────────────
│  ◦  ᴏᴡɴᴇʀ
│  ◦  ᴍᴇɴᴜ
│  ◦  ᴍᴇɴᴜ𝟸
│  ◦  ᴠᴠ
│  ◦  ᴀʟʟᴍᴇɴᴜ
│  ◦  ʀᴇᴘᴏ
│  ◦  ʙʟᴏᴄᴋ
│  ◦  ᴜɴʙʟᴏᴄᴋ
│  ◦  ғᴜʟʟᴘᴘ
│  ◦  sᴇᴛᴘᴘ
│  ◦  ʀᴇsᴛᴀʀᴛ
│  ◦  sʜᴜᴛᴅᴏᴡɴ
│  ◦  ᴜᴘᴅᴀᴛᴇᴄᴍᴅ
│  ◦  ᴀʟɪᴠᴇ
│  ◦  ᴘɪɴɢ
│  ◦  ɢᴊɪᴅ
│  ◦  ᴊɪᴅ
╰┈────────────────•
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅʏʙʏ ᴛᴇᴄʜ*`;

        await conn.sendMessage(
            from,
            {
                image: { url: `https://files.catbox.moe/rful77.jpg` },
                caption: dec,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363372853772240@newsletter',
                        newsletterName: '𝗠𝗘𝗚𝗔𝗟𝗢𝗗𝗢𝗡',
                        serverMessageId: 143
                    }
                }
            },
            { quoted: mek }
        );

    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});

// convert menu

cmd({
    pattern: "convertmenu",
    desc: "menu the bot",
    category: "menu",
    react: "🥀",
    filename: __filename
}, 
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        let dec = `╭┈──────────────────
│  ♻️ 𝐂𝐎𝐍𝐕𝐄𝐑𝐓 𝐌𝐄𝐍𝐔
╭┈──────────────────
│  ◦  sᴛɪᴄᴋᴇʀ
│  ◦  sᴛɪᴄᴋᴇʀ𝟸
│  ◦  ᴇᴍᴏᴊɪᴍɪx
│  ◦  ғᴀɴᴄʏ
│  ◦  ᴛᴀᴋᴇ
│  ◦  ᴛᴏᴍᴘ𝟹
│  ◦  ᴛᴛs
│  ◦  ᴛʀᴛ
│  ◦  ʙᴀsᴇ𝟼𝟺
│  ◦  ᴜɴʙᴀsᴇ𝟼𝟺
│  ◦  ʙɪɴᴀʀʏ
│  ◦  ᴅʙɪɴᴀʀʏ
│  ◦  ᴛɪɴʏᴜʀʟ
│  ◦  ᴜʀʟᴅᴇᴄᴏᴅᴇ
│  ◦  ᴜʀʟᴇɴᴄᴏᴅᴇ
│  ◦  ᴜʀʟ
│  ◦  ʀᴇᴘᴇᴀᴛ
│  ◦  ᴀsᴋ
│  ◦  ʀᴇᴀᴅᴍᴏʀᴇ
╰┈────────────────•
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅʏʙʏ ᴛᴇᴄʜ*`;

        await conn.sendMessage(
            from,
            {
                image: { url: `https://files.catbox.moe/rful77.jpg` },
                caption: dec,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363372853772240@newsletter',
                        newsletterName: '𝗠𝗘𝗚𝗔𝗟𝗢𝗗𝗢𝗡',
                        serverMessageId: 143
                    }
                }
            },
            { quoted: mek }
        );

    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});


// anmie menu 

cmd({
    pattern: "animemenu",
    desc: "menu the bot",
    category: "menu",
    react: "🧚",
    filename: __filename
}, 
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
          let dec = `╭┈──────────────────
│  🎎 𝐀𝐌𝐈𝐍𝐄 𝐌𝐄𝐍𝐔
╭┈──────────────────
│  ◦  ғᴀᴄᴋ
│  ◦  ᴛʀᴜᴛʜ
│  ◦  ᴅᴀʀᴇ
│  ◦  ᴅᴏɢ
│  ◦  ᴀᴡᴏᴏ
│  ◦  ɢᴀʀʟ
│  ◦  ᴡᴀɪғᴜ
│  ◦  ɴᴇᴋᴏ
│  ◦  ᴍᴇɢɴᴜᴍɪɴ
│  ◦  ɴᴇᴋᴏ
│  ◦  ᴍᴀɪᴅ
│  ◦  ʟᴏʟɪ
│  ◦  ᴀɴɪᴍᴇɢɪʀʟ
│  ◦  ᴀɴɪᴍᴇɢɪʀʟ𝟷
│  ◦  ᴀɴɪᴍᴇɢɪʀʟ𝟸
│  ◦  ᴀɴɪᴍᴇɢɪʀʟ𝟹
│  ◦  ᴀɴɪᴍᴇɢɪʀʟ𝟺
│  ◦  ᴀɴɪᴍᴇɢɪʀʟ𝟻
│  ◦  ᴀɴɪᴍᴇ𝟷
│  ◦  ᴀɴɪᴍᴇ𝟸
│  ◦  ᴀɴɪᴍᴇ𝟹
│  ◦  ᴀɴɪᴍᴇ𝟺
│  ◦  ᴀɴɪᴍᴇ𝟻
│  ◦  ᴀɴɪᴍᴇɴᴇᴡs
│  ◦  ғᴏxɢɪʀʟ
│  ◦  ɴᴀʀᴜᴛᴏ
╰┈────────────────•
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅʏʙʏ ᴛᴇᴄʜ*`;

        await conn.sendMessage(
            from,
            {
                image: { url: `https://files.catbox.moe/rful77.jpg` },
                caption: dec,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363372853772240@newsletter',
                        newsletterName: '𝗠𝗘𝗚𝗔𝗟𝗢𝗗𝗢𝗡',
                        serverMessageId: 143
                    }
                }
            },
            { quoted: mek }
        );

    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});


// ai menu 

cmd({
    pattern: "aimenu",
    desc: "menu the bot",
    category: "menu",
    react: "🤖",
    filename: __filename
}, 
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        let dec = `╭┈──────────────────
│  🤖 𝐀𝐈 𝐌𝐄𝐍𝐔
╭┈──────────────────
│  ◦  ᴀɪ
│  ◦  ɢᴘᴛ𝟹
│  ◦  ɢᴘᴛ𝟸
│  ◦  ɢᴘᴛᴍɪɴɪ
│  ◦  ɢᴘᴛ
│  ◦  ᴍᴇᴛᴀ
│  ◦  ʙʟᴀᴄᴋʙᴏx
│  ◦  ʟᴜᴍᴀ
│  ◦  ᴅᴊ
│  ◦  ɢᴘᴛ𝟺
│  ◦  ʙɪɴɢ
│  ◦  ɪᴍᴀɢɪɴᴇ
│  ◦  ɪᴍᴀɢɪɴᴇ𝟸
│  ◦  ᴄᴏᴘɪʟᴏᴛ
╰┈────────────────•
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅʏʙʏ ᴛᴇᴄʜ*`;

        await conn.sendMessage(
            from,
            {
                image: { url: `https://files.catbox.moe/rful77.jpg` },
                caption: dec,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363372853772240@newsletter',
                        newsletterName: '𝗠𝗘𝗚𝗔𝗟𝗢𝗗𝗢𝗡',
                        serverMessageId: 143
                    }
                }
            },
            { quoted: mek }
        );

    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});
