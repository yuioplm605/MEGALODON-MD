const axios = require("axios");
const { cmd } = require("../command");

const API_URL = "https://www.dark-yasiya-api.site/other/font";

// .fancy → Affiche les styles dans un menu déroulant
cmd({
  pattern: "fancy",
  alias: ["font", "style"],
  react: "✍️",
  desc: "Convert text into various fonts (selectable).",
  category: "tools",
  filename: __filename
}, async (conn, m, store, { from, quoted, q, reply }) => {
  try {
    if (!q) {
      return reply("❎ Please provide text to convert into fancy fonts.\n\n*Example:* .fancy Hello");
    }

    const response = await axios.get(`${API_URL}?text=${encodeURIComponent(q)}`);
    const fonts = response.data.result;

    if (!response.data.status || !Array.isArray(fonts)) {
      return reply("❌ Error fetching fonts. Please try again later.");
    }

    // Création du menu déroulant
    const sections = [{
      title: "Available Fancy Styles",
      rows: fonts.map((item, i) => ({
        title: `${i + 1}. ${item.name}`,
        rowId: `.fancy2 ${i + 1} ${q}`,
        description: item.result
      }))
    }];

    const listMessage = {
      text: `✨ *Fancy Fonts Converter*\n\nSelect a style from the list below.`,
      footer: "*ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴍᴇɢᴀʟᴏᴅᴏɴ ᴍᴅ*",
      title: "Fancy Fonts List",
      buttonText: "Choose a Fancy Style",
      sections
    };

    await conn.sendMessage(from, listMessage, { quoted: m });

  } catch (error) {
    console.error("❌ Error in .fancy:", error);
    reply("⚠️ An error occurred while building the list.");
  }
});

// .fancy2 → Retourne un seul style selon le numéro
cmd({
  pattern: "fancy2",
  react: "✍️",
  desc: "Get a specific fancy font style by number.",
  category: "tools",
  filename: __filename
}, async (conn, m, store, { from, quoted, args, reply }) => {
  try {
    if (args.length < 2) {
      return reply("❎ Usage: .fancy2 [style_number] [text]\n\n*Example:* .fancy2 5 Hello");
    }

    const styleNumber = parseInt(args[0]);
    const text = args.slice(1).join(" ");

    if (isNaN(styleNumber)) {
      return reply("❌ The first argument must be a number representing the style.");
    }

    const response = await axios.get(`${API_URL}?text=${encodeURIComponent(text)}`);

    if (!response.data.status || !Array.isArray(response.data.result)) {
      return reply("❌ Failed to fetch fonts from the API.");
    }

    const fonts = response.data.result;
    const selected = fonts[styleNumber - 1];

    if (!selected) {
      return reply(`❌ Style number ${styleNumber} does not exist. There are only ${fonts.length} styles.`);
    }

    const resultText = `✨ *Fancy Style #${styleNumber} (${selected.name})*\n\n${selected.result}\n\n> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴍᴇɢᴀʟᴏᴅᴏɴ ᴍᴅ*`;

    await conn.sendMessage(from, { text: resultText }, { quoted: m });
  } catch (error) {
    console.error("❌ Error in .fancy2:", error);
    reply("⚠️ An error occurred while selecting the font style.");
  }
});
