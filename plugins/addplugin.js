const fs = require('fs')
const path = require('path')
const { cmd } = require('../command')

cmd({
    pattern: "addplugin",
    react: "📦",
    desc: "Dynamically add a plugin",
    category: "owner",
    use: ".addplugin name + js_code",
    filename: __filename
},
async (conn, mek, m, { text, isOwner, reply }) => {
    if (!isOwner) return reply("❌ Only the owner can use this command.")
    if (!text.includes('+')) return reply("❌ Usage: .addplugin name + code")

    const [rawName, ...codeParts] = text.split('+')
    const name = rawName.trim().replace(/[^a-zA-Z0-9_-]/g, '')
    const code = codeParts.join('+').trim()

    if (!name || !code) return reply("❌ Missing plugin name or code.")

    const filePath = path.join(__dirname, name + '.js')

    try {
        fs.writeFileSync(filePath, code)
        reply(`✅ Plugin *${name}.js* added successfully.`)
    } catch (err) {
        console.error(err)
        reply(`❌ Error while creating the plugin:\n${err}`)
    }
})
