const { cmd } = require("../command");
const TicTacToe = require("../lib/tictactoe");

const games = {};

function sendBoard(conn, room, from, message) {
  const board = room.game.render();
  return conn.sendMessage(from, {
    text: `${message}\n\n${board}\n\n▢ Tape un nombre (1-9) pour jouer\n▢ Tape *surrender* ou *.tttstop* pour abandonner`,
    mentions: [room.game.playerX, room.game.playerO],
  }, { quoted: room.message });
}

cmd({
  pattern: "ttt",
  desc: "Lancer un jeu de TicTacToe",
  category: "game",
  filename: __filename
}, async (conn, m, { sender, args, reply, from }) => {
  const opponent = m.mentionedJid?.[0];
  if (!opponent) return reply("❎ Mentionne un joueur pour démarrer le jeu.");

  const roomId = `ttt-${from}`;
  if (games[roomId]) return reply("⚠️ Une partie est déjà en cours dans ce chat.");

  const game = new TicTacToe(sender, opponent);
  const msg = await sendBoard(conn, { game, message: m }, from, `🎮 *Jeu TicTacToe lancé !*\n\nTour de @${sender.split("@")[0]}...`);
  games[roomId] = { id: roomId, game, message: msg };
});

cmd({
  pattern: "tttstop",
  desc: "Arrêter la partie TicTacToe",
  category: "game",
  filename: __filename
}, async (conn, m, { sender, from, reply }) => {
  const roomId = `ttt-${from}`;
  const room = games[roomId];
  if (!room) return reply("❎ Il n’y a aucune partie en cours.");
  if (![room.game.playerX, room.game.playerO].includes(sender)) return reply("❌ Tu ne participes pas à cette partie.");

  delete games[roomId];
  reply("🛑 Partie arrêtée.");
});

cmd({
  custom: true,
  fromMe: false,
  type: "game"
}, async (conn, m, { sender, body, quoted, from, reply }) => {
  const room = games[`ttt-${from}`];
  if (!room || room.game.winner) return;

  const game = room.game;
  const move = parseInt(body.trim()) - 1;
  if (isNaN(move) && !/^surrender$/i.test(body)) return;

  const isTurn = sender === game.currentTurn;
  if (!isTurn && !/^surrender$/i.test(body)) return;

  if (/^surrender$/i.test(body)) {
    const opponent = sender === game.playerX ? game.playerO : game.playerX;
    await conn.sendMessage(from, {
      text: `🏳️ @${sender.split("@")[0]} abandonne la partie.\n🎉 @${opponent.split("@")[0]} gagne !`,
      mentions: [sender, opponent]
    });
    delete games[`ttt-${from}`];
    return;
  }

  const success = game.turn(sender, move);
  if (!success) return reply("❌ Coup invalide ou case déjà prise.");

  let status;
  if (game.winner) {
    status = `🎉 @${sender.split("@")[0]} gagne la partie !`;
  } else if (game.turns >= 9) {
    status = `🤝 Match nul !`;
  } else {
    status = `🎲 Tour de @${game.currentTurn.split("@")[0]}...`;
  }

  await sendBoard(conn, room, from, `🎮 *TicTacToe*\n\n${status}`);

  if (game.winner || game.turns >= 9) delete games[`ttt-${from}`];
});
