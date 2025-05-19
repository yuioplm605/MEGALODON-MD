const { cmd } = require('../command');

cmd({
    pattern: "broadcast",
    alias: ["bc", "bcast"],
    use: '.broadcast [message]',
    desc: "Test broadcast command",
    category: "owner",
    filename: __filename,
    owner: true
}, async (conn, mek, m, { q }) => {
    console.log("Broadcast command triggered");
    if (!q) return await conn.sendMessage(m.chat, { text: "Please provide a message to broadcast." }, { quoted: mek });

    // Répond avec conn.sendMessage pour être sûr que ça fonctionne
    await conn.sendMessage(m.chat, { text: `Broadcast message received:\n\n${q}` }, { quoted: mek });
});
