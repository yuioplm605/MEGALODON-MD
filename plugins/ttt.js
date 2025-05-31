const { cmd } = require('../command');
const TicTacToe = require('../lib/tictactoe');
const games = {};

cmd({
  pattern: "ttt",
  alias: ["tictactoe"],
  desc: "Jouer au jeu du morpion",
  category: "game",
  filename: __filename,
}, async (conn, mek, m, { from, sender, args, reply }) => {
  const text = args.join(' ');

  if (Object.values(games).find(room => room.id.startsWith('tictactoe') &&
    [room.game.playerX, room.game.playerO].includes(sender))) {
    return reply('❌ Tu es déjà dans une partie. Tape *.tttstop* pour abandonner.');
  }

  let room = Object.values(games).find(room =>
    room.state === 'WAITING' && (text ? room.name === text : true));

  if (room) {
    room.o = from;
    room.game.playerO = sender;
    room.state = 'PLAYING';

    const arr = room.game.render().map(v => ({
      'X': '❎', 'O': '⭕',
      '1': '1️⃣', '2': '2️⃣', '3': '3️⃣',
      '4': '4️⃣', '5': '5️⃣', '6': '6️⃣',
      '7': '7️⃣', '8': '8️⃣', '9': '9️⃣',
    }[v]));

    const str = `
🎮 *Jeu TicTacToe lancé !*

Tour de @${room.game.currentTurn.split('@')[0]}...

${arr.slice(0, 3).join('')}
${arr.slice(3, 6).join('')}
${arr.slice(6).join('')}

▢ Tape un nombre (1-9) pour jouer
▢ Tape *surrender* ou *.tttstop* pour abandonner
`;

    await conn.sendMessage(from, {
      text: str,
      mentions: [room.game.playerX, room.game.playerO]
    });
  } else {
    room = {
      id: 'tictactoe-' + Date.now(),
      x: from,
      o: '',
      game: new TicTacToe(sender),
      state: 'WAITING'
    };

    if (text) room.name = text;
    games[room.id] = room;

    return reply(`⏳ En attente d'un adversaire...\nTape *.ttt ${text || ''}* pour rejoindre.`);
  }
});

// Surrender command
cmd({
  pattern: "tttstop",
  desc: "Arrêter la partie en cours",
  category: "game",
  filename: __filename,
}, async (conn, mek, m, { sender, reply }) => {
  const room = Object.values(games).find(room =>
    room.id.startsWith('tictactoe') &&
    [room.game.playerX, room.game.playerO].includes(sender) &&
    room.state === 'PLAYING'
  );

  if (!room) return reply('❌ Tu n’es pas dans une partie active.');

  const opponent = sender === room.game.playerX ? room.game.playerO : room.game.playerX;
  delete games[room.id];

  return conn.sendMessage(room.x, {
    text: `🏳️ @${sender.split('@')[0]} a abandonné la partie.`,
    mentions: [sender, opponent]
  });
});

// Input Handler
cmd({
  custom: true,
  fromMe: false,
  type: "game",
}, async (conn, mek, m, { body, sender, from, reply }) => {
  if (!/^[1-9]$|^surrender$|^give up$/i.test(body)) return;

  const room = Object.values(games).find(room =>
    room.id.startsWith('tictactoe') &&
    [room.game.playerX, room.game.playerO].includes(sender) &&
    room.state === 'PLAYING'
  );
  if (!room) return;

  const isSurrender = /^(surrender|give up)$/i.test(body);
  const isPlayerO = sender === room.game.playerO;

  if (!isSurrender && sender !== room.game.currentTurn) {
    return reply('❌ Ce n’est pas ton tour.');
  }

  let ok = isSurrender ? true : room.game.turn(isPlayerO, parseInt(body) - 1);
  if (!ok && !isSurrender) {
    return reply('❌ Case déjà prise.');
  }

  let winner = room.game.winner;
  const isTie = room.game.turns === 9;

  const arr = room.game.render().map(v => ({
    'X': '❎', 'O': '⭕',
    '1': '1️⃣', '2': '2️⃣', '3': '3️⃣',
    '4': '4️⃣', '5': '5️⃣', '6': '6️⃣',
    '7': '7️⃣', '8': '8️⃣', '9': '9️⃣',
  }[v]));

  if (isSurrender) {
    winner = sender === room.game.playerX ? room.game.playerO : room.game.playerX;
    await conn.sendMessage(from, {
      text: `🏳️ @${sender.split('@')[0]} a abandonné ! @${winner.split('@')[0]} gagne !`,
      mentions: [sender, winner]
    });
    delete games[room.id];
    return;
  }

  const status = winner
    ? `🎉 @${winner.split('@')[0]} gagne la partie !`
    : isTie
    ? `🤝 Match nul !`
    : `🎲 Tour de @${room.game.currentTurn.split('@')[0]}`;

  const str = `
🎮 *TicTacToe*

${status}

${arr.slice(0, 3).join('')}
${arr.slice(3, 6).join('')}
${arr.slice(6).join('')}

▢ ❎ : @${room.game.playerX.split('@')[0]}
▢ ⭕ : @${room.game.playerO.split('@')[0]}

${!winner && !isTie ? 'Tape un chiffre (1-9) ou *surrender*' : ''}
`;

  for (const jid of [room.x, room.o]) {
    if (jid) {
      await conn.sendMessage(jid, {
        text: str,
        mentions: [room.game.playerX, room.game.playerO, ...(winner ? [winner] : [])]
      });
    }
  }

  if (winner || isTie) {
    delete games[room.id];
  }
});
