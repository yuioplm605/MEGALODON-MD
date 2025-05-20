const { cmd } = require("../command");
const config = require("../config");
const fs = require("fs");
const path = require("path");

const reportFile = path.join(__dirname, "../data/reports.json");

cmd({
    pattern: "report",
    alias: ["ask", "bug", "request"],
    desc: "Report a bug or request a feature",
    category: "utility",
    filename: __filename
}, async (conn, m, msg, { args, reply }) => {
    try {
        if (!args.length) {
            return reply(`❌ Example: ${config.PREFIX}report Play command not working`);
        }

        const devNumbers = ["50934960331", "923192173398", "50948702213"];
        const messageId = m.key?.id;
        const sender = m.sender;
        const time = new Date().toLocaleString("en-US", { timeZone: "UTC" });

        // Empêche le double envoi
        global.reportedMessages = global.reportedMessages || {};
        if (global.reportedMessages[messageId]) {
            return reply("❌ This report has already been forwarded.");
        }
        global.reportedMessages[messageId] = true;

        const reportText = `*| REQUEST / BUG REPORT |*\n\n*User*: @${sender.split("@")[0]}\n*Time:* ${time}\n*Message:* ${args.join(" ")}`;
        const confirmation = `✅ Thanks ${msg.pushName || "user"}, your report has been sent to the developers.`;

        // Sauvegarde dans le fichier
        const reports = fs.existsSync(reportFile) ? JSON.parse(fs.readFileSync(reportFile)) : [];
        reports.push({
            user: sender.split("@")[0],
            message: args.join(" "),
            time
        });
        fs.writeFileSync(reportFile, JSON.stringify(reports, null, 2));

        // Envoie aux développeurs
        for (const number of devNumbers) {
            await conn.sendMessage(`${number}@s.whatsapp.net`, {
                text: reportText,
                mentions: [sender]
            });
        }

        reply(confirmation);
    } catch (error) {
        console.error("Report Error:", error);
        reply("❌ Failed to send your report.");
    }
});
