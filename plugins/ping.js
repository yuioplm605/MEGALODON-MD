//POWERED BY DYBYTECH 
const config = require('../config');
const { cmd } = require('../command');
const axios = require('axios');

function formatUptime(seconds) {
    const pad = (s) => (s < 10 ? '0' : '') + s;
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${pad(hrs)}h ${pad(mins)}m ${pad(secs)}s`;
}

cmd({
    pattern: "ping",
    desc: "Check bot's response time.",
    category: "main",
    react: "🍂",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        const start = Date.now();
        const tempMsg = await conn.sendMessage(from, { text: '*🏓 Pinging...*' });
        const latency = Date.now() - start;
        const uptime = process.uptime();

        const imageUrl = "https://files.catbox.moe/upypnp.jpg";
        let imageBuffer;

        try {
            const res = await axios.get(imageUrl, {
                responseType: 'arraybuffer',
                timeout: 5000
            });
            imageBuffer = res.data;
        } catch (err) {
            console.error('Erreur image :', err?.response?.status, err.message);
            imageBuffer = null;
        }

        await conn.sendMessage(from, {
            document: imageBuffer,
            mimetype: 'image/jpeg',
            fileName: 'ping.jpg',
            jpegThumbnail: imageBuffer,
            caption: `> *⚡ ᴍᴇɢᴀʟᴏᴅᴏɴ-ᴍᴅ ᴘɪɴɢ ʀᴇsᴘᴏɴsᴇ*\n\n🍃 Speed: *${latency}ms*\n⏱️ Uptime: *${formatUptime(uptime)}*`
        }, { quoted: tempMsg });

    } catch (e) {
        console.error('Erreur Ping:', e?.response?.status, e.message);
        if (reply) reply(`❌ Erreur : ${e?.message}`);
    }
});

// Powered by DybyTech 
