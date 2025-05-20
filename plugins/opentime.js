const config = require('../config');
const { cmd } = require('../command');

function parseDuration(value, unit) {
    const multipliers = {
        second: 1000,
        seconds: 1000,
        minute: 60000,
        minutes: 60000,
        hour: 3600000,
        hours: 3600000,
        day: 86400000,
        days: 86400000
    };
    if (isNaN(value)) return null;
    return multipliers[unit.toLowerCase()] ? parseInt(value) * multipliers[unit.toLowerCase()] : null;
}

cmd({
    pattern: "opentime",
    react: "🔖",
    desc: "To open group for a specific time",
    category: "group",
    use: ".opentime 10 minute",
    filename: __filename
}, async (conn, mek, m, { from, args, isGroup, isAdmins, reply }) => {
    try {
        if (!isGroup) return reply("Cette commande fonctionne uniquement dans les groupes.");
        if (!isAdmins) return reply("Seuls les administrateurs peuvent utiliser cette commande.");

        const timer = parseDuration(args[0], args[1]);
        if (!timer) return reply("*Choisissez une unité valide :*\nsecond(s), minute(s), hour(s), day(s)\n\n*Exemple :*\n10 minutes");

        reply(`*Le groupe sera ouvert pendant ${args[0]} ${args[1]}.*`);
        await conn.groupSettingUpdate(from, 'not_announcement');

        setTimeout(async () => {
            await conn.groupSettingUpdate(from, 'announcement');
            await conn.sendMessage(from, { text: `*⏱️ TEMPS ÉCOULÉ*\nLe groupe est maintenant fermé. Seuls les admins peuvent envoyer des messages. 🔐` });
        }, timer);

        await conn.sendMessage(from, { react: { text: `✅`, key: mek.key } });
    } catch (e) {
        reply("*Erreur lors de l'ouverture temporaire du groupe.*");
        console.error(e);
    }
});

cmd({
    pattern: "closetime",
    react: "🔖",
    desc: "To close group for a specific time",
    category: "group",
    use: ".closetime 10 minute",
    filename: __filename
}, async (conn, mek, m, { from, args, isGroup, isAdmins, reply }) => {
    try {
        if (!isGroup) return reply("Cette commande fonctionne uniquement dans les groupes.");
        if (!isAdmins) return reply("Seuls les administrateurs peuvent utiliser cette commande.");

        const timer = parseDuration(args[0], args[1]);
        if (!timer) return reply("*Choisissez une unité valide :*\nsecond(s), minute(s), hour(s), day(s)\n\n*Exemple :*\n10 minutes");

        reply(`*Le groupe sera fermé pendant ${args[0]} ${args[1]}.*`);
        await conn.groupSettingUpdate(from, 'announcement');

        setTimeout(async () => {
            await conn.groupSettingUpdate(from, 'not_announcement');
            await conn.sendMessage(from, { text: `*⏱️ TEMPS ÉCOULÉ*\nLe groupe est maintenant ouvert. Tous les membres peuvent envoyer des messages. 🔓` });
        }, timer);

        await conn.sendMessage(from, { react: { text: `✅`, key: mek.key } });
    } catch (e) {
        reply("*Erreur lors de la fermeture temporaire du groupe.*");
        console.error(e);
    }
});
