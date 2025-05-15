const { cmd, commands } = require('../command');
const axios = require('axios');

// Commande .pair
cmd({
    pattern: "pair",
    alias: ["getpair", "clonebot"],
    react: "✅",
    desc: "Get pairing code for MEGALODON-MD bot",
    category: "download",
    use: ".pair +509xxxxx",
    filename: __filename
}, async (conn, mek, m, { q, senderNumber, reply }) => {
    try {
        const phoneNumber = q ? q.trim() : senderNumber;

        if (!phoneNumber || !phoneNumber.match(/^\+?\d{10,15}$/)) {
            return await reply("❌ Please provide a valid phone number with country code\nExample: .pair +509xxxxx");
        }

        // NOUVEAU LIEN UTILISÉ ICI
        const response = await axios.get(`https://mega-session-pair.onrender.com/?number=${encodeURIComponent(phoneNumber)}`);

        if (!response.data || !response.data.code) {
            return await reply("❌ Failed to retrieve pairing code. Please try again later.");
        }

        const pairingCode = response.data.code;
        const doneMessage = "> *MEGALODON-MD PAIRING COMPLETED*";

        await reply(`${doneMessage}\n\n*Your pairing code is:* ${pairingCode}`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        await reply(`${pairingCode}`);
    } catch (error) {
        console.error("Pair command error:", error);
        await reply("❌ An error occurred while getting pairing code. Please try again later.");
    }
});

// Commande .pair2
cmd({
    pattern: "pair2",
    alias: ["getpair2", "clonebot2"],
    react: "✅",
    desc: "Get pairing code for MEGALODON-MD bot",
    category: "download",
    use: ".pair +509xxxxx",
    filename: __filename
}, async (conn, mek, m, { q, senderNumber, reply }) => {
    try {
        const phoneNumber = q ? q.trim() : senderNumber;

        if (!phoneNumber || !phoneNumber.match(/^\+?\d{10,15}$/)) {
            return await reply("❌ Please provide a valid phone number with country code\nExample: .pair2 +509xxxxx");
        }

        // NOUVEAU LIEN UTILISÉ ICI AUSSI
        const response = await axios.get(`https://mega-session-pair.onrender.com/?number=${encodeURIComponent(phoneNumber)}`);

        if (!response.data || !response.data.code) {
            return await reply("❌ Failed to retrieve pairing code. Please try again later.");
        }

        const pairingCode = response.data.code;
        const doneMessage = "> *MEGALODON-MD PAIRING COMPLETED*";

        await reply(`${doneMessage}\n\n*Your pairing code is:* ${pairingCode}`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        await reply(`${pairingCode}`);
    } catch (error) {
        console.error("Pair2 command error:", error);
        await reply("❌ An error occurred while getting pairing code. Please try again later.");
    }
});
