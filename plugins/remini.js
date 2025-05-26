const axios = require("axios");
const { cmd } = require("../command");

cmd({
  pattern: "remini",
  react: "🖼️",
  desc: "Améliore la qualité d'une image",
  category: "tools",
  filename: __filename
}, async (conn, m, store, { from, quoted, mime, reply }) => {
  try {
    const img = quoted && /image/.test(mime) ? quoted : /image/.test(mime) ? m : false;
    if (!img) return reply("❎ Veuillez répondre à une image avec la commande `.remini`");

    reply("♻️ *Traitement de l'image en cours...*");

    const media = await conn.downloadAndSaveMediaMessage(img);
    const form = new FormData();
    form.append("image", require("fs").createReadStream(media));

    const response = await axios.post("https://api.hardianto.xyz/ai/remini", form, {
      headers: {
        ...form.getHeaders(),
        'apikey': 'hardianto' // Change avec ta propre clé si nécessaire
      }
    });

    if (!response.data || !response.data.status) {
      return reply("❌ Erreur lors du traitement de l'image.");
    }

    await conn.sendMessage(from, { image: { url: response.data.result }, caption: "✅ Image améliorée avec succès !" }, { quoted: m });

  } catch (err) {
    console.error("Erreur remini:", err);
    reply("❌ Une erreur est survenue lors du traitement.");
  }
});
