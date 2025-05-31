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

  // Vérifier si joueur est déjà dans une partie
  if (Object.values(games).find(room =>
    room.id.startsWith('tictactoe') &&
    [room.game.playerX, room.game.playerO].includes(sender))) {
    return reply('❌ Tu es déjà dans une partie. Tape *surrender* ou *.tttstop* pour abandonner.');
  }

  // Rejoindre une partie en attente ou en créer une nouvelle
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

// Gestion des coups & abandon via texte libre (sans préfixe)
cmd({
  custom: true,
  desc: "Action de jeu TicTacToe (jouer ou abandonner)",
  fromMe: false,
  type: "game",
}, async (conn, mek, m, { body, sender, from, reply }) => {
  // Si le message n'est pas un coup (1-9) ou abandon, on ignore
  if (!/^[1-9]$|^surrender$|^give up$|^\.tttstop$/i.test(body)) return;

  // Trouver la partie en cours pour ce joueur
  const room = Object.values(games).find(room =>
    room.id.startsWith('tictactoe') &&
    [room.game.playerX, room.game.playerO].includes(sender) &&
    room.state === 'PLAYING'
  );
  if (!room) return;

  const isSurrender = /^(surrender|give up)$/i.test(body);
  const isStopCmd = /^\.tttstop$/i.test(body);
  const isPlayerO = sender === room.game.playerO;

  if (isSurrender || isStopCmd) {
    // Abandon de la partie
    const opponent = sender === room.game.playerX ? room.game.playerO : room.game.playerX;

    await conn.sendMessage(from, {
      text: `🏳️ @${sender.split('@')[0]} a abandonné la partie. @${opponent.split('@')[0]} gagne !`,
      mentions: [sender, opponent]
    });

    delete games[room.id];
    return;
  }

  // Vérifier que c’est bien le tour du joueur
  if (sender !== room.game.currentTurn) {
    return reply('❌ Ce n’est pas ton tour.');
  }

  // Essayer de jouer le coup
  let ok = room.game.turn(isPlayerO, parseInt(body) - 1);
  if (!ok) {
    return reply('❌ Case déjà prise.');
  }

  // Vérifier victoire ou match nul
  let winner = room.game.winner;
  const isTie = room.game.turns === 9;

  const arr = room.game.render().map(v => ({
    'X': '❎', 'O': '⭕',
    '1': '1️⃣', '2': '2️⃣', '3': '3️⃣',
    '4': '4️⃣', '5': '5️⃣', '6': '6️⃣',
    '7': '7️⃣', '8': '8️⃣', '9': '9️⃣',
  }[v]));

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

${!winner && !isTie ? 'Tape un chiffre (1-9) ou *surrender* ou *.tttstop*' : ''}
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
