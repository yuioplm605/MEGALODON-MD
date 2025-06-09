const { cmd } = require('../lib');
const fs = require('fs');
const config = require('../config');

cmd({
    pattern: 'setprefix',
    alias: ['prefix'],
    desc: 'Change the bot prefix dynamically',
    category: 'owner',
    react: '✏️',
    filename: __filename,
}, async (message, match, m, { isCreator }) => {
    if (!isCreator) return message.reply('_Only the bot owner can change the prefix._');

    if (!match) return message.reply(`_Usage: ${config.PREFIX}setprefix <new prefix>_`);

    const newPrefix = match.trim();

    // Update config.env file
    const envPath = './config.env';
    if (fs.existsSync(envPath)) {
        let envContent = fs.readFileSync(envPath, 'utf-8');
        if (envContent.includes('PREFIX=')) {
            envContent = envContent.replace(/PREFIX=.*/g, `PREFIX=${newPrefix}`);
        } else {
            envContent += `\nPREFIX=${newPrefix}`;
        }
        fs.writeFileSync(envPath, envContent);
    }

    // Update in-memory config
    config.PREFIX = newPrefix;

    await message.reply(`✅ Prefix has been updated to: *${newPrefix}*\n_The change has been applied immediately._`);
});
