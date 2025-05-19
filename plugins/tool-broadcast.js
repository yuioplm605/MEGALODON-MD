const { cmd } = require('../command');

cmd({
    pattern: "broadcast",
    alias: ["bc", "bcast"],
    use: '.broadcast [message]',
    desc: "Test broadcast command",
    category: "owner",
    filename: __filename,
    owner: true
}, async (conn, mek, m, { q, reply }) => {
    console.log("Broadcast command triggered");
    if (!q) return reply("Please provide a message to broadcast.");

    // Répond juste avec le message reçu, pour test
    reply(`Broadcast message received:\n\n${q}`);
});
