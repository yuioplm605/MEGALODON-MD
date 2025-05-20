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
        if (!args.length) {
            return reply(`Example: ${config.PREFIX}report Play command is not working`);
        }

        const devNumbers = ["50934960331", "923192173398", "50948702213"]; // développeurs à notifier
        const messageId = m.key.id;

        global.reportedMessages = global.reportedMessages || {};
        if (global.reportedMessages[messageId]) {
            return reply("This report has already been forwarded. Please wait for a response.");
        }
        global.reportedMessages[messageId] = true;

        const reportText = `*| REQUEST / BUG REPORT |*\n\n*User*: @${m.sender.split("@")[0]}\n*Request/Bug*: ${args.join(" ")}`;
        const confirmationText = `✅ Hi ${m.pushName || 'user'}, your request has been forwarded to the developer(s). Please wait...`;

        for (const number of devNumbers) {
            await conn.sendMessage(`${number}@s.whatsapp.net`, {
                text: reportText,
                mentions: [m.sender]
            }, { quoted: m });
        }

        reply(confirmationText);
    } catch (error) {
        console.error(error);
        reply("❌ An error occurred while sending your report.");
    }
});
