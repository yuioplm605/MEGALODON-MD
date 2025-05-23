const config = require('../config');
const fs = require('fs');
const { cmd } = require('../command');

let SUDO_LIST = config.SUDO_LIST || [];
const sudoFile = './data/sudo.json';

if (fs.existsSync(sudoFile)) {
    SUDO_LIST = JSON.parse(fs.readFileSync(sudoFile));
}

const cleanNumber = (jid) => jid.replace(/[^0-9]/g, '');
const saveSudo = () => {
    fs.writeFileSync(sudoFile, JSON.stringify(SUDO_LIST, null, 2));
};

// .sudo command (manage sudo users)
cmd({
    pattern: "sudo",
    react: "🛠️",
    desc: "Manage sudo users (add/del/list)",
    category: "owner",
    use: ".sudo add/del/list <number>",
    filename: __filename
}, async (conn, mek, m, { sender, args, q, quoted, isOwner, reply }) => {
    if (!isOwner) return reply("❌ Only the bot owner can use this command.");

    const [actionRaw, numberArg] = q.split(' ');
    const action = (actionRaw || '').toLowerCase();
    let number = cleanNumber(numberArg || '');

    if (!number && quoted?.sender) {
        number = cleanNumber(quoted.sender);
    }

    if (!['add', 'del', 'list'].includes(action)) {
        return reply(`❌ Invalid usage.\n.sudo add <number>\n.sudo del <number>\n.sudo list`);
    }

    if (action === 'list') {
        const list = SUDO_LIST.length
            ? SUDO_LIST.map((n, i) => `${i + 1}. ${n}`).join('\n')
            : "No sudo users found.";
        return reply(`*SUDO USERS:*\n${list}`);
    }

    if (!number) return reply("❗ Please provide a valid number or reply to a user.");

    if (action === 'add') {
        if (SUDO_LIST.includes(number)) {
            return reply("⚠️ This number is already in the sudo list.");
        }
        SUDO_LIST.push(number);
        saveSudo();
        return reply(`✅ ${number} has been added to the sudo list.`);
    }

    if (action === 'del') {
        const index = SUDO_LIST.indexOf(number);
        if (index !== -1) {
            SUDO_LIST.splice(index, 1);
            saveSudo();
            return reply(`❌ ${number} has been removed from the sudo list.`);
        } else {
            return reply("❗ This number is not in the sudo list.");
        }
    }
});
