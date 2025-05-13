const { cmd } = require('../command');
const axios = require('axios');

cmd({
  pattern: "bible",
  alias: ["verse", "bibleverse", "biblia", "chapter", "search"],
  desc: "Get a Bible verse or chapter in English (King James Version)",
  category: "search",
  filename: __filename
}, async (conn, mek, m, { args, reply }) => {
  try {
    if (args.length === 0) {
      return reply("❎ Please provide a reference or keyword. Example: `bible John 3:16` or `bible John 3` for a chapter.");
    }

    const query = args.join(" ");
    
    // Check if the user is searching for a specific verse or a chapter
    let apiUrl = "";
    if (query.includes(":")) {
      // If the reference contains ":", it's a specific verse
      apiUrl = `https://bible-api.com/${encodeURIComponent(query)}?translation=kjv`;
    } else {
      // Otherwise, search by chapter (e.g., "John 3" for chapter 3 of John)
      apiUrl = `https://bible-api.com/${encodeURIComponent(query)}?translation=kjv`;
    }

    const res = await axios.get(apiUrl);

    if (!res.data || !res.data.text) {
      return reply("❎ Reference not found. Please check your input.");
    }

    const text = res.data.text.trim();
    const reference = res.data.reference;

    let response = `╭━━〔 📖 *BIBLE* 〕━━

 *${reference}*

 ${text}

╰━━POWERED BY MEGALODON-MD━━━`;

    if (query.includes(":")) {
      // If it's a verse, return the specific verse
      reply(response);
    } else {
      // If it's a chapter, return the beginning of the chapter
      response = `╭━━〔 📖 *CHAPTER* 〕━━

 *${reference}* (Full Chapter)

 ${text.split("\n")[0]}... [See full chapter]

╰━━━POWERED BY MEGALODON-MD━━━`;
      reply(response);
    }
  } catch (err) {
    console.error(err);
    reply("❎ An error occurred. Please try again later.");
  }
});
