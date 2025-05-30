const axios = require("axios");
const { cmd } = require("../command");

cmd({
  pattern: "fancy",
  alias: ["font", "style"],
  react: "✍️",
  desc: "Convert text into various fancy fonts.",
  category: "tools",
  filename: __filename
}, async (conn, mek, m, {
  from,
  quoted,
  body,
  isCmd,
  command,
  args,
  q,
  isGroup,
  sender,
  reply
}) => {
  try {
    if (!q) return reply("❎ Please provide text to convert.\n\n*Example:* .fancy Hello");

    const apiUrl = `https://www.dark-yasiya-api.site/other/font?text=${encodeURIComponent(q)}`;
    const res = await axios.get(apiUrl);

    if (!res.data.status) return reply("❌ Error fetching fonts. Try again later.");

    const fonts = res.data.result;
    let menuText = "╭──〔 *FANCY FONT STYLES* 〕──⬣\n";
    fonts.forEach((f, i) => {
      menuText += `┃ ${i + 1}. ${f.name}\n`;
    });
    menuText += "╰──────────────⬣\n\n📌 *Reply with the number to select a font style for:*\n❝ " + q + " ❞";

    const sentMsg = await conn.sendMessage(from, {
      text: menuText
    }, { quoted: m });

    const messageID = sentMsg.key.id;
    let handlerActive = true;

    const handlerTimeout = setTimeout(() => {
      handlerActive = false;
      conn.ev.off("messages.upsert", messageHandler);
      reply("⌛ Fancy style selection timed out. Please try again.");
    }, 120000);

    const messageHandler = async (msgData) => {
      if (!handlerActive) return;
      const receivedMsg = msgData.messages[0];
      if (!receivedMsg || !receivedMsg.message) return;

      const receivedText = receivedMsg.message.conversation ||
        receivedMsg.message.extendedTextMessage?.text;

      const senderID = receivedMsg.key.remoteJid;
      const isReplyToBot = receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;

      if (isReplyToBot && senderID === from) {
        clearTimeout(handlerTimeout);
        conn.ev.off("messages.upsert", messageHandler);
        handlerActive = false;

        const selectedNumber = parseInt(receivedText.trim());
        if (isNaN(selectedNumber) || selectedNumber < 1 || selectedNumber > fonts.length) {
          return reply("❎ Invalid option. Please reply with a number from the list.");
        }

        const chosen = fonts[selectedNumber - 1];
        const finalText = `✨ *Your Text in ${chosen.name}:*\n\n${chosen.result}\n\n> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅʏʙʏ ᴛᴇᴄʜ*`;

        await conn.sendMessage(from, {
          text: finalText
        }, { quoted: receivedMsg });
      }
    };

    conn.ev.on("messages.upsert", messageHandler);
  } catch (error) {
    console.error("❌ Error in .fancy:", error);
    reply("⚠️ An error occurred while processing.");
  }
});

// powered by DybyTech*
