const { cmd } = require('../command');

cmd({
    pattern: "broadcast",
    alias: ["bc", "bcast"],
    use: '.broadcast [message]',
    desc: "Test if bot can send messages",
    category: "owner",
    filename: __filename,
    owner: true
}, async (conn, mek) => {
    console.log("Broadcast command triggered");

    // Remplace ceci par ton propre numéro si besoin pour test
    const testChatId = mek.key.remoteJid;

    await conn.sendMessage(testChatId, { text: "This is a test broadcast reply." }, { quoted: mek });
});
