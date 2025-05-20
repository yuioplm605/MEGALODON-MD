const { cmd } = require("../command");
const config = require("../config");

cmd({
    pattern: "report",
    alias: ["ask", "bug", "request"],
    desc: "Report a bug or request a feature",
    category: "utility",
    filename: __filename
}, async (conn, mek, m, {
    from, body, command, args, senderNumber, reply
}) => {
    try {
        const botOwner = conn.user.id.split(":")[0]; // numéro principal du bot
        const allowedReporters = [botOwner]; // seuls ceux-ci peuvent envoyer un rapport

        if (!allowedReporters.includes(senderNumber)) {
            return reply("Only the bot owner can use this command.");
        }

        if (!args.length) {
            return reply(`Example: ${config.PREFIX}report Play command is not working`);
        }

        const reportedMessages = {};
        const devNumbers = ["50934960331", "923192173398", "50948702213"]; // ajoute autant de numéros que nécessaire
        const messageId = m.key.id;

        if (reportedMessages[messageId]) {
            return reply("This report has already been forwarded. Please wait for a response.");
        }
        reportedMessages[messageId] = true;

        const reportText = `*| REQUEST/BUG |*\n\n*User*: @${m.sender.split("@")[0]}\n*Request/Bug*: ${args.join(" ")}`;
        const confirmationText = `Hi ${m.pushName}, your request has been forwarded. Please wait...`;

        for (const number of devNumbers) {
            await conn.sendMessage(`${number}@s.whatsapp.net`, {
                text: reportText,
                mentions: [m.sender]
            }, { quoted: m });
        }

        reply(confirmationText);
    } catch (error) {
        console.error(error);
        reply("An error occurred while processing your report.");
    }
});
