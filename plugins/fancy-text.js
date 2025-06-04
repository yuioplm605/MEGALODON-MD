const axios = require("axios");
const { cmd } = require("../command");

const activeFancySessions = {}; // pour suivre les sessions par chat

cmd({
  pattern: "fancy",
  alias: ["font", "style"],
  react: "✍️",
  desc: "Convert text into various fancy fonts.",
  category: "tools",
  filename: __filename
}, async (conn, mek, m, {
  from,
  body,
  args,
  q,
  reply
}) => {
  try {
    if (!q) return reply("❎ Please provide text to convert.\n\n*Example:* .fancy Hello");

    const apiUrl = `https://www.dark-yasiya-api.site/other/font?text=${encodeURIComponent(q)}`;
    const res = await axios.get(apiUrl);

    if (!res.data.status || !Array.isArray(res.data.result)) {
      return reply("❌ Error fetching fonts. Try again later.");
    }

    const fonts = res.data.result;
    const maxDisplay = 44;
    const displayList = fonts.slice(0, maxDisplay);

    let menuText = "╭──〔 *FANCY STYLES* 〕──⬣\n";
    displayList.forEach((f, i) => {
      menuText += `┃ ${i + 1}. ${f.result}\n`;
    });
    menuText += "╰──────────────⬣\n\n📌 *Reply with the number to select a font style for:*\n❝ " + q + " ❞";

    const sentMsg = await conn.sendMessage(from, { text: menuText }, { quoted: m });
    const messageID = sentMsg.key.id;

    // Enregistre la session
    activeFancySessions[from] = {
      originalText: q,
      fonts: displayList,
      messageID
    };

  } catch (error) {
    console.error("❌ Error in .fancy:", error);
    reply("⚠️ An error occurred while processing.");
  }
});

// Gestionnaire global
const { default: store } = require('../store'); // assure-toi que tu as un store si besoin

module.exports.messageHandler = async (msgData, conn) => {
  const receivedMsg = msgData.messages?.[0];
  if (!receivedMsg || !receivedMsg.message) return;

  const from = receivedMsg.key.remoteJid;
  const text = receivedMsg.message.conversation || receivedMsg.message.extendedTextMessage?.text;

  if (!activeFancySessions[from]) return;

  const session = activeFancySessions[from];
  const isReplyToFancy = receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === session.messageID;

  if (isReplyToFancy) {
    const number = parseInt(text.trim());
    if (isNaN(number) || number < 1 || number > session.fonts.length) {
      return conn.sendMessage(from, { text: `❎ Invalid selection. Reply with a number between 1 and ${session.fonts.length}.` }, { quoted: receivedMsg });
    }

    const chosen = session.fonts[number - 1];
    const finalText = `✨ *Your Text in ${chosen.name || 'Selected Style'}:*\n\n${chosen.result}\n\n> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅʏʙʏ ᴛᴇᴄʜ*`;

    await conn.sendMessage(from, { text: finalText }, { quoted: receivedMsg });
  }
};
