const { cmd } = require('../command');
const TicTacToe = require('../lib/tictactoe');

const games = {};

cmd({
  pattern: "ttt",
  alias: ["tictactoe"],
  desc: "Jouer au jeu du morpion",
  category: "game",
  filename: __filename,
  react: "🎮",
}, async (conn, mek, m, { from, sender, args, reply }) => {
  const text = args.join(' ');

  // Vérifie si le joueur est déjà dans une partie
  if (Object.values(games).find(room => room.id.startsWith('tictactoe') &&
    [room.game.playerX, room.game.playerO].includes(sender))) {
    return reply('❌ Tu es déjà dans une partie. Tape *surrender* ou *.tttstop* pour abandonner.');
  }

  // Recherche une salle en attente ou crée une nouvelle
  let room = Object.values(games).find(room =>
    room.state === 'WAITING' && (text ? room.name === text : true)
  );

  if (room) {
    // Rejoindre la partie
    room.o = from;
    room.game.playerO = sender;
    room.state = 'PLAYING';

    await sendBoard(conn, room, from, '🎮 *Jeu TicTacToe lancé !*');

  } else {
    // Créer une nouvelle salle
    room = {
      id: 'tictactoe-' + Date.now(),
      x: from,
      o: '',
      game: new TicTacToe(sender),
      state: 'WAITING',
      name: text || ''
    };

    games[room.id] = room;

    return reply(`⏳ En attente d'un adversaire...\nTape *.ttt ${text || ''}* pour rejoindre.`);
  }
});

cmd({
  pattern: "tttstop",
  desc: "Abandonner la partie TicTacToe en cours",
  category: "game",
  filename: __filename,
  react: "🏳️",
}, async (conn, mek, m, { sender, from, reply }) => {
  const room = Object.values(games).find(room =>
    room.id.startsWith('tictactoe') &&
    [room.game.playerX, room.game.playerO].includes(sender) &&
    room.state === 'PLAYING'
  );
  if (!room) return reply('❌ Tu n\'es dans aucune partie.');

  const winner = sender === room.game.playerX ? room.game.playerO : room.game.playerX;

  await conn.sendMessage(from, {
    text: `🏳️ @${sender.split('@')[0]} a abandonné la partie !\n🎉 @${winner.split('@')[0]} gagne !`,
    mentions: [sender, winner]
  });

  delete games[room.id];
});

// Actions pendant la partie, sans préfixe (chiffre ou surrender)
cmd({
  custom: true,
  desc: "Jouer au TicTacToe ou abandonner",
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
    return reply('❌ Case déjà prise ou mouvement invalide.');
  }

  if (isSurrender) {
    const winner = sender === room.game.playerX ? room.game.playerO : room.game.playerX;
    await conn.sendMessage(from, {
      text: `🏳️ @${sender.split('@')[0]} a abandonné la partie !\n🎉 @${winner.split('@')[0]} gagne !`,
      mentions: [sender, winner]
    });
    delete games[room.id];
    return;
  }

  const winnerMark = room.game.winner;
  const isTie = room.game.turns === 9 && !winnerMark;

  let status;
  if (winnerMark) {
    const winnerId = winnerMark === 'X' ? room.game.playerX : room.game.playerO;
    status = `🎉 @${winnerId.split('@')[0]} gagne la partie !`;
  } else if (isTie) {
    status = `🤝 Match nul !`;
  } else {
    status = `🎲 Tour de @${room.game.currentTurn.split('@')[0]}...`;
  }

  await sendBoard(conn, room, from, `🎮 *TicTacToe*\n\n${status}`);

  if (winnerMark || isTie) {
    delete games[room.id];
  }
});

// Fonction d'affichage de la grille et message aux joueurs
async function sendBoard(conn, room, to, title) {
  const arr = room.game.render().map(v => ({
    'X': '❎',
    'O': '⭕',
    '1': '1️⃣', '2': '2️⃣', '3': '3️⃣',
    '4': '4️⃣', '5': '5️⃣', '6': '6️⃣',
    '7': '7️⃣', '8': '8️⃣', '9': '9️⃣',
  }[v]));

  const str = `
${title}

Tour de @${room.game.currentTurn.split('@')[0]}...

${arr.slice(0, 3).join('')}
${arr.slice(3, 6).join('')}
${arr.slice(6).join('')}

▢ Tape un nombre (1-9) pour jouer
▢ Tape *surrender* ou *.tttstop* pour abandonner
`;

  for (const jid of [room.x, room.o]) {
    if (jid) {
      await conn.sendMessage(jid, {
        text: str,
        mentions: [room.game.playerX, room.game.playerO]
      });
    }
  }
                                         }
