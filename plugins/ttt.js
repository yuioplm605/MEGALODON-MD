const { cmd } = require("../command");
const TicTacToe = require("../lib/tictactoe");

const games = {};

cmd({
  pattern: "ttt",
  desc: "Lance un jeu de TicTacToe",
  category: "game",
  filename: __filename
}, async (conn, m, { sender, from, reply }) => {
  const opponent = m.mentionedJid?.[0];
  if (!opponent) return reply("❎ Mentionne un joueur pour commencer (ex: .ttt @user)");

  const id = from;
  if (games[id]) return reply("⚠️ Une partie est déjà en cours ici.");

  const game = new TicTacToe(sender, opponent);
  const board = game.render();
  const text = `🎮 *Jeu TicTacToe lancé !*\n\nTour de @${sender.split('@')[0]}\n\n${board}\n\n▢ Tape un chiffre (1-9) pour jouer\n▢ Tape *surrender* ou *.tttstop* pour abandonner`;
  const sent = await conn.sendMessage(from, { text, mentions: [sender, opponent] }, { quoted: m });

  games[id] = {
    id,
    game,
    messageId: sent.key.id,
    players: [sender, opponent],
    quotedMsg: sent
  };
});

cmd({
  pattern: "tttstop",
  desc: "Arrête la partie TicTacToe",
  category: "game",
  filename: __filename
}, async (conn, m, { from, sender, reply }) => {
  const room = games[from];
  if (!room) return reply("❌ Aucune partie en cours ici.");
  if (!room.players.includes(sender)) return reply("⛔ Tu ne fais pas partie de cette partie.");

  delete games[from];
  reply("🛑 Partie arrêtée.");
});

cmd({
  custom: true
}, async (conn, m, { from, sender, body, quoted }) => {
  const room = games[from];
  if (!room || room.game.winner) return;
  if (!quoted || quoted.key.id !== room.messageId) return;

  const game = room.game;

  if (/^(surrender|give up)$/i.test(body.trim())) {
    const opponent = sender === game.playerX ? game.playerO : game.playerX;
    await conn.sendMessage(from, {
      text: `🏳️ @${sender.split('@')[0]} abandonne ! @${opponent.split('@')[0]} gagne !`,
      mentions: [sender, opponent]
    });
    delete games[from];
    return;
  }

  const choice = parseInt(body.trim());
  if (isNaN(choice) || choice < 1 || choice > 9) return;

  if (sender !== game.currentTurn) return conn.sendMessage(from, { text: `⏳ Ce n'est pas ton tour.`, quoted: m });

  const moveSuccess = game.turn(sender, choice - 1);
  if (!moveSuccess) return conn.sendMessage(from, { text: `❌ Coup invalide ou case déjà prise.`, quoted: m });

  const board = game.render();

  if (game.winner) {
    await conn.sendMessage(from, {
      text: `🎉 @${sender.split('@')[0]} remporte la partie !\n\n${board}`,
      mentions: [sender]
    });
    delete games[from];
  } else if (game.turns >= 9) {
    await conn.sendMessage(from, {
      text: `🤝 Match nul !\n\n${board}`
    });
    delete games[from];
  } else {
    const turn = game.currentTurn;
    await conn.sendMessage(from, {
      text: `🎮 *TicTacToe*\n\nTour de @${turn.split('@')[0]}\n\n${board}`,
      mentions: [turn]
    });
  }
});
