const { cmd } = require("../command");

cmd({
  pattern: "vv",
  alias: ["viewonce", "vv2"],
  react: "🐳",
  desc: "Owner Only - Retrieve view-once media",
  category: "owner",
  filename: __filename
}, async (client, message, match, { from, isCreator }) => {
  try {
    if (!isCreator) {
      return await client.sendMessage(from, {
        text: "*📛 This is an owner-only command.*"
      }, { quoted: message });
    }

    const quoted = message.quoted;
    if (!quoted || !quoted.isViewOnce) {
      return await client.sendMessage(from, {
        text: "*🍁 Please reply to a view-once message!*"
      }, { quoted: message });
    }

    // Supprimer le flag viewOnce
    const viewOnceMsg = quoted.message?.viewOnceMessage?.message || quoted.message?.viewOnceMessageV2?.message;
    if (!viewOnceMsg) {
      return await client.sendMessage(from, {
        text: "❌ Could not extract media from view-once message."
      }, { quoted: message });
    }

    // Reconstruire le message sans le flag viewOnce
    const type = Object.keys(viewOnceMsg)[0]; // "imageMessage", "videoMessage", etc.
    const fakeQuoted = {
      key: quoted.key,
      message: {
        [type]: {
          ...viewOnceMsg[type],
          viewOnce: false
        }
      }
    };

    // Télécharger le média
    const buffer = await client.downloadMediaMessage(fakeQuoted);
    const caption = viewOnceMsg[type]?.caption || '';
    const mimetype = viewOnceMsg[type]?.mimetype;

    // Envoyer le média
    let content = {};
    if (type === "imageMessage") {
      content = { image: buffer, caption, mimetype };
    } else if (type === "videoMessage") {
      content = { video: buffer, caption, mimetype };
    } else {
      return await client.sendMessage(from, {
        text: "❌ Only image and video view-once messages are supported."
      }, { quoted: message });
    }

    await client.sendMessage(from, content, { quoted: message });

  } catch (error) {
    console.error("vv error:", error);
    await client.sendMessage(from, {
      text: "❌ Error retrieving view-once message:\n" + error.message
    }, { quoted: message });
  }
});
