const axios = require('axios');
const cheerio = require('cheerio');
const { cmd } = require('../command');

// Genius API Key
const GENIUS_API_KEY = 'XOxelFDJbxYpjeS154VLIHx0bcEzrCzF1ZVUHN7fqOohg0_2zVuoiE9kyLzqXWip';

cmd({
    pattern: "lyrics",
    alias: ["lyric"],
    desc: "Fetch the lyrics of a song by artist and title.",
    react: "🎵",
    category: "utility",
    use: ".lyrics <artist> - <title>",
    filename: __filename,
}, async (conn, mek, m, { args, reply }) => {
    try {
        const query = args.join(' ').split(' - ');
        if (query.length !== 2) return reply("❌ Invalid format. Example: `.lyrics Ed Sheeran - Shape of You`");

        const [artist, title] = query.map(s => s.trim());
        reply(`🎵 Searching for lyrics of *${title}* by *${artist}*...`);

        // 1. Search song on Genius
        const searchUrl = `https://api.genius.com/search?q=${encodeURIComponent(artist + " " + title)}`;
        const searchRes = await axios.get(searchUrl, {
            headers: {
                Authorization: `Bearer ${GENIUS_API_KEY}`,
            }
        });

        const hits = searchRes.data.response.hits;
        if (!hits.length) return reply(`❌ No results found for "${title}" by ${artist}.`);

        const song = hits[0].result;
        const songTitle = song.title;
        const songArtist = song.primary_artist.name;
        const songUrl = song.url;

        // 2. Scrape lyrics from Genius HTML page
        const pageRes = await axios.get(songUrl);
        const $ = cheerio.load(pageRes.data);
        const lyrics = $('.lyrics').text().trim() || $('div[class^="Lyrics__Container"]').text().trim();

        if (!lyrics) return reply(`❌ Lyrics not found for "${title}" on Genius.`);

        // 3. Split lyrics if too long
        const chunks = lyrics.match(/[\s\S]{1,4000}/g) || [];

        for (let i = 0; i < chunks.length; i++) {
            await reply(`🎶 *${songTitle}* - *${songArtist}*\n\n${chunks[i]}`);
        }

    } catch (err) {
        console.error("Lyrics Error:", err.message);
        reply("❌ An error occurred while fetching lyrics. Please try again later.");
    }
});
