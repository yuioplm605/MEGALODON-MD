const games = {};
const { cmd } = require("../command");

const getBoard = (b) => {
  return `
${b[0]} | ${b[1]} | ${b[2]}
---------
${b[3]} | ${b[4]} | ${b[5]}
---------
${b[6]} | ${b[7]} | ${b[8]}
`.trim();
};

const checkWin = (b, sym) => {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return wins.some(([a,b1,c]) => b[a] === sym && b[b1] === sym && b[c] === sym);
};

const isFull = (b) => b.every(x => x === "❌" || x === "⭕");

cmd({
  pattern: "tictactoe",
  alias: ["ttt"],
  desc: "Start a Tic Tac Toe game",
  category: "game",
  filename: __filename
}, async (conn, m, store, { args, from, reply, mentionByTag }) => {
  if (games[from]) return reply("❎ A game is already ongoing in this group.");
  const playerX = m.sender;
  const playerO = mentionByTag[0];

  if (!playerO) return reply("❎ Mention a player to start.\n*Example:* .tictactoe @user");

  games[from] = {
    board: ["1","2","3","4","5","6","7","8","9"],
    players: { X: playerX, O: playerO },
    turn: "X"
  };

  const boardText = getBoard(games[from].board);
  await conn.sendMessage(from, {
    text: `🎮 *Tic Tac Toe*\n\n${boardText}\n\nIt's @${games[from].players.X.split("@")[0]}'s (❌) turn.\nReply with *.play [1-9]*`,
    mentions: [playerX, playerO]
  }, { quoted: m });
});

cmd({
  pattern: "delttt",
  desc: "Make a move in Tic Tac Toe",
  category: "game",
  filename: __filename
}, async (conn, m, store, { args, from, reply }) => {
  const game = games[from];
  if (!game) return reply("❎ No game in progress. Start a game with .tictactoe @player");

  const position = parseInt(args[0]) - 1;
  if (isNaN(position) || position < 0 || position > 8) return reply("❎ Choose a position between 1 and 9.");

  const symbol = game.turn;
  const player = game.players[symbol];

  if (m.sender !== player) return reply("❎ It's not your turn.");

  if (game.board[position] === "❌" || game.board[position] === "⭕")
    return reply("❎ This spot is already taken.");

  game.board[position] = symbol === "X" ? "❌" : "⭕";

  const boardText = getBoard(game.board);

  if (checkWin(game.board, game.board[position])) {
    await conn.sendMessage(from, {
      text: `🎉 *Victory!*\n\n${boardText}\n\nWinner: @${m.sender.split("@")[0]}`,
      mentions: [m.sender]
    }, { quoted: m });
    delete games[from];
    return;
  }

  if (isFull(game.board)) {
    await conn.sendMessage(from, {
      text: `🤝 *Draw!*\n\n${boardText}`,
    }, { quoted: m });
    delete games[from];
    return;
  }

  game.turn = symbol === "X" ? "O" : "X";
  const nextPlayer = game.players[game.turn];
  await conn.sendMessage(from, {
    text: `🎮 *Tic Tac Toe*\n\n${boardText}\n\nIt's @${nextPlayer.split("@")[0]}'s turn (${game.turn === "X" ? "❌" : "⭕"}).`,
    mentions: [nextPlayer]
  }, { quoted: m });
});
