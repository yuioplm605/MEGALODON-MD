const {
  cmd
} = require("../command");
const fetch = require("node-fetch");
cmd({
  'pattern': 'ss',
  'alias': ['ssweb'],
  'react': '🚀',
  'desc': "Download screenshot of a given link.",
  'category': "other",
  'use': ".ss <link>",
  'filename': __filename
}, async (_0x52bc95, _0x383ec4, _0x1aa466, {
  from: _0x583811,
  reply: _0x323267,
  q: _0x439dca
}) => {
  if (!_0x439dca) {
    return _0x323267("Please provide a URL to capture a screenshot.");
  }
  if (!/^https?:\/\//.test(_0x439dca)) {
    return _0x323267("❗ Please provide a valid URL starting with http:// or https://");
  }
  const _0x32aee6 = async _0x5c08e5 => {
    return await _0x52bc95.sendMessage(_0x583811, {
      'image': _0x5c08e5,
      'caption': "*📸 Screenshot Tool*\n\n🌐 *URL:* " + _0x439dca + "\n\n> _*© ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅʏʙʏ ᴛᴇᴄʜ*_",
      'contextInfo': {
        'mentionedJid': [_0x1aa466.sender],
        'forwardingScore': 0x3e7,
        'isForwarded': true,
        'forwardedNewsletterMessageInfo': {
          'newsletterJid': "120363401051937059@newsletter",
          'newsletterName': "𝐌𝐄𝐆𝐀𝐋𝐎𝐃𝐎𝐍-𝐌𝐃",
          'serverMessageId': 0x8f
        }
      }
    }, {
      'quoted': _0x1aa466
    });
  };
  try {
    const _0x43c8ed = "https://zenz.biz.id/tools/ssweb?url=" + encodeURIComponent(_0x439dca);
    const _0x332fa9 = await fetch(_0x43c8ed);
    const _0x4cf262 = _0x332fa9.headers.get("content-type");
    if (_0x4cf262 && _0x4cf262.startsWith("image/")) {
      const _0x546e46 = await _0x332fa9.buffer();
      return await _0x32aee6(_0x546e46);
    }
    const _0x1dff52 = await _0x332fa9.json();
    if (!_0x1dff52.status || !_0x1dff52.result) {
      throw new Error("Failed to get screenshot");
    }
    const _0x388545 = await fetch(_0x1dff52.result).then(_0x3ac4eb => _0x3ac4eb.buffer());
    return await _0x32aee6(_0x388545);
  } catch (_0x3207f1) {
    console.error(_0x3207f1);
    _0x323267("❌ Failed to capture the screenshot. Please try again later.");
  }
});
