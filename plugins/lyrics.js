const { cmd } = require('../command');
const axios = require('axios');
const cheerio = require('cheerio');

// Your Genius API Key (already registered for you)
const GENIUS_API_KEY = 'XOxelFDJbxYpjeS154VLIHx0bcEzrCzF1ZVUHN7fqOohg0_2zVuoiE9kyLzqXWip';

cmd({
    pattern: "lyrics",
    alias: ["lyric", "paroles"],
    desc: "Get song lyrics using Genius",
    category: "music",
    react: "🎤",
    filename: __filename
},
async (conn, mek, m, { from, q, reply, react }) => {
    try {
        if (!q) return reply("Usage: `.lyrics artist - song` or `.lyrics song`\nExample: `.lyrics Adele - Hello` or `.lyrics Hello`");

        await react("⏳");

        // Search for the song
        const searchUrl = `https://api.genius.com/search?q=${encodeURIComponent(q)}`;
        const searchRes = await axios.get(searchUrl, {
            headers: {
                Authorization: `Bearer ${GENIUS_API_KEY}`
            }
        });

        const hits = searchRes.data.response.hits;
        if (!hits || hits.length === 0) {
            await react("❌");
            return reply(`No results found for *${q}*.`);
        }

        const songData = hits[0].result;
        const songTitle = songData.title;
        const artistName = songData.primary_artist.name;
        const songUrl = songData.url;
        const thumbnail = songData.song_art_image_thumbnail_url;

        // Scrape the lyrics from Genius page
        const html = await axios.get(songUrl);
        const $ = cheerio.load(html.data);
        const lyrics = $('div[data-lyrics-container="true"]').text().trim();

        if (!lyrics) {
            await react("❌");
            return reply(`Lyrics not found for *${q}*.`);
        }

        const caption = `🎵 *${songTitle}* by *${artistName}*\n\n` +
                        `${lyrics.length > 4000 ? lyrics.slice(0, 4000) + "\n\n[Truncated lyrics]" : lyrics}\n\n` +
                        `🔗 *Genius Link:* ${songUrl}`;

        await conn.sendMessage(from, {
            image: { url: thumbnail },
            caption,
            contextInfo: { mentionedJid: [m.sender] }
        }, { quoted: mek });

        await react("✅");
    } catch (e) {
        console.error("Error in lyrics plugin:", e);
        await react("❌");
        reply("An error occurred while fetching the lyrics.");
    }
});
