const { cmd } = require('../command');
const axios = require('axios');

// Commande AI utilisant la version classique de l'API GiftedTech (GPT-3.5 ou similaire)
cmd({
    pattern: "ai",
    alias: ["bot", "dj", "gpt"],
    desc: "Chat avec une IA (giftedtech - openai)",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { q, reply, react }) => {
    try {
        if (!q) return reply("Veuillez fournir un message pour l'IA.\nExemple : .ai Bonjour");

        const apiUrl = `https://api.giftedtech.web.id/api/ai/openai?apikey=gifted&q=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);

        if (!data || !data.message) {
            await react("❌");
            return reply("L'IA n'a pas pu répondre. Réessaie plus tard.");
        }

        await reply(`🤖 *Réponse IA:*\n\n${data.message}`);
        await react("✅");
    } catch (e) {
        console.error("Erreur dans la commande AI:", e);
        await react("❌");
        reply("Une erreur est survenue lors de la communication avec l'IA.");
    }
});

// Commande GPT-4o utilisant l'API GiftedTech GPT-4o
cmd({
    pattern: "gpt4o",
    alias: ["gpt-omni", "omni"],
    desc: "Chat avec GPT-4o (giftedtech)",
    category: "ai",
    react: "⚡",
    filename: __filename
}, async (conn, mek, m, { q, reply, react }) => {
    try {
        if (!q) return reply("Veuillez fournir un message pour GPT-4o.\nExemple : .gpt4o Bonjour");

        const apiUrl = `https://api.giftedtech.web.id/api/ai/gpt4o?apikey=gifted&q=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);

        if (!data || !data.message) {
            await react("❌");
            return reply("GPT-4o n'a pas pu répondre. Réessaie plus tard.");
        }

        await reply(`⚡ *GPT-4o:*\n\n${data.message}`);
        await react("✅");
    } catch (e) {
        console.error("Erreur dans la commande GPT-4o:", e);
        await react("❌");
        reply("Une erreur est survenue lors de la communication avec GPT-4o.");
    }
});

cmd({
    pattern: "deepseek",
    alias: ["deep", "seekai"],
    desc: "Chat with DeepSeek AI",
    category: "ai",
    react: "🧠",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a message for DeepSeek AI.\nExample: `.deepseek Hello`");

        const apiUrl = `https://api.ryzendesu.vip/api/ai/deepseek?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);

        if (!data || !data.answer) {
            await react("❌");
            return reply("DeepSeek AI failed to respond. Please try again later.");
        }

        await reply(`🧠 *DeepSeek AI Response:*\n\n${data.answer}`);
        await react("✅");
    } catch (e) {
        console.error("Error in DeepSeek AI command:", e);
        await react("❌");
        reply("An error occurred while communicating with DeepSeek AI.");
    }
});


