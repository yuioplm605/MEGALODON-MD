const { cmd } = require('../command');

const games = new Map();

cmd({
  pattern: "tictactoe",
  alias: ["xo", "ttt"],
  desc: "Start a game of Tic Tac Toe",
  category: "games",
  react: "❌",
  filename: __filename
}, async (conn, mek, m, { from }) => {
  const sender = m.sender;
  const mention = m.mentionedJid?.[0];

  if (!mention) {
    return conn.sendMessage(from, {
      text: "❎ Please mention your opponent!\n\nExample: *.tictactoe @user*"
    }, { quoted: mek });
  }

  if (mention === sender) {
    return conn.sendMessage(from, {
      text: "❎ You can't play against yourself!"
    }, { quoted: mek });
  }

  const gameId = `${from}:${mention}:${sender}`;
  if (games.has(from)) {
    return conn.sendMessage(from, {
      text: "⚠️ A game is already running in this chat!"
    }, { quoted: mek });
  }

  const board = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];
  const state = {
    board,
    players: [sender, mention],
    turn: 0
  };

  games.set(from, state);

  await conn.sendMessage(from, {
    text: renderBoard(board, sender, mention),
    contextInfo: {
      mentionedJid: [sender, mention]
    }
  }, { quoted: mek });
});

// Move commands: 1 to 9
for (let i = 1; i <= 9; i++) {
  cmd({
    pattern: String(i),
    desc: `Play move ${i} in Tic Tac Toe`,
    category: "games",
    filename: __filename
  }, async (conn, mek, m, { from }) => {
    const game = games.get(from);
    if (!game) return;

    const index = Number(m.body) - 1;
    const currentPlayer = game.players[game.turn % 2];

    if (m.sender !== currentPlayer) return;

    if (!["1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣"].includes(game.board[index])) {
      return conn.sendMessage(from, {
        text: "❌ That position is already taken!",
      }, { quoted: mek });
    }

    game.board[index] = game.turn % 2 === 0 ? "❌" : "⭕️";
    game.turn++;

    const winner = checkWinner(game.board);
    if (winner) {
      await conn.sendMessage(from, {
        text: `🎉 *Tic Tac Toe Game Over!*\n\nWinner: @${currentPlayer.split('@')[0]}\n\n${renderBoard(game.board)}\n\n*Powered by Megalodon-MD*`,
        contextInfo: { mentionedJid: [currentPlayer] }
      }, { quoted: mek });
      games.delete(from);
    } else if (game.turn >= 9) {
      await conn.sendMessage(from, {
        text: `🤝 *Draw!*\n\n${renderBoard(game.board)}\n\nNo winner this time.`,
      }, { quoted: mek });
      games.delete(from);
    } else {
      const next = game.players[game.turn % 2];
      await conn.sendMessage(from, {
        text: renderBoard(game.board, ...game.players) + `\n\nTurn: @${next.split('@')[0]}`,
        contextInfo: { mentionedJid: [next] }
      }, { quoted: mek });
    }
  });
}

// Helpers
function renderBoard(board, p1 = "Player 1", p2 = "Player 2") {
  return `🎮 *Tic Tac Toe*\n@${p1.split('@')[0]} ❌ vs @${p2.split('@')[0]} ⭕️\n\n${board.slice(0, 3).join(' ')}\n${board.slice(3, 6).join(' ')}\n${board.slice(6, 9).join(' ')}\n`;
}

function checkWinner(b) {
  const winCombos = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // columns
    [0,4,8], [2,4,6]           // diagonals
  ];
  for (let [a,b_,c] of winCombos) {
    if (b[a] === b[b_] && b[b_] === b[c]) return true;
  }
  return false;
}



cmd({
  pattern: 'delttt',
  alias: ['cancelttt', 'stopttt'],
  desc: 'Annule une partie de Tic Tac Toe en cours.',
  category: 'games',
  react: '🗑️',
  filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, reply }) => {
  if (!isGroup) return reply('❌ Cette commande ne peut être utilisée que dans les groupes.');
  if (!isAdmins) return reply('❌ Seuls les admins peuvent annuler une partie.');

  if (!games.has(from)) return reply('⚠️ Il n’y a aucune partie en cours dans ce groupe.');

  games.delete(from);
  reply('✅ Partie de *Tic Tac Toe* annulée avec succès.');
});
