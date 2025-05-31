const { cmd } = require("../command");
const TicTacToe = require("../lib/tictactoe");

const games = {};

cmd({
  pattern: "ttt",
  alias: ["tictactoe"],
  desc: "Jouer au jeu du morpion",
  category: "game",
  filename: __filename
}, async (conn, mek, m, { from, sender, args, reply }) => {
  const text = args.join(" ");

  if (Object.values(games).find(room => room.id.startsWith("tictactoe") && [room.game.playerX, room.game.playerO].includes(sender))) {
    return reply("❌ Tu es déjà dans une partie. Tape *surrender* pour abandonner.");
  }

  let room = Object.values(games).find(room => room.state === "WAITING" && (text ? room.name === text : true));

  if (room) {
    room.o = from;
    room.game.playerO = sender;
    room.state = "PLAYING";

    const arr = room.game.render().map(v => ({
      "X": "❎", "O": "⭕",
      "1": "1️⃣", "2": "2️⃣", "3": "3️⃣",
      "4": "4️⃣", "5": "5️⃣", "6": "6️⃣",
      "7": "7️⃣", "8": "8️⃣", "9": "9️⃣"
    }[v]));

    const board = `${arr.slice(0, 3).join("")}\n${arr.slice(3, 6).join("")}\n${arr.slice(6).join("")}`;

    const str = `🎮 *TicTacToe lancé !*\nTour de @${room.game.currentTurn.split("@")[0]}\n\n${board}\n\n📥 *Réponds avec un chiffre (1-9)* ou tape *surrender* pour abandonner.`;

    const sentMsg = await conn.sendMessage(from, { text: str, mentions: [room.game.playerX, room.game.playerO] }, { quoted: m });
    const messageID = sentMsg.key.id;

    const handler = async (msgData) => {
      const msg = msgData.messages?.[0];
      if (!msg || !msg.message) return;

      const body = msg.message.conversation || msg.message.extendedTextMessage?.text;
      const isReply = msg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;
      const user = msg.key.participant || msg.key.remoteJid;

      if (!isReply || ![room.game.playerX, room.game.playerO].includes(user)) return;

      const isSurrender = /^(surrender|give up)$/i.test(body);
      const isPlayerO = user === room.game.playerO;

      if (!isSurrender && user !== room.game.currentTurn) {
        return conn.sendMessage(from, { text: "❌ Ce n’est pas ton tour.", quoted: msg });
      }

      const validMove = isSurrender || room.game.turn(isPlayerO, parseInt(body) - 1);
      if (!validMove && !isSurrender) {
        return conn.sendMessage(from, { text: "❌ Case déjà prise.", quoted: msg });
      }

      let winner = room.game.winner;
      const isTie = room.game.turns === 9;
      const arr = room.game.render().map(v => ({
        "X": "❎", "O": "⭕",
        "1": "1️⃣", "2": "2️⃣", "3": "3️⃣",
        "4": "4️⃣", "5": "5️⃣", "6": "6️⃣",
        "7": "7️⃣", "8": "8️⃣", "9": "9️⃣"
      }[v]));
      const board = `${arr.slice(0, 3).join("")}\n${arr.slice(3, 6).join("")}\n${arr.slice(6).join("")}`;

      let status = "";
      if (isSurrender) {
        winner = user === room.game.playerX ? room.game.playerO : room.game.playerX;
        status = `🏳️ @${user.split("@")[0]} a abandonné ! @${winner.split("@")[0]} gagne !`;
      } else if (winner) {
        status = `🎉 @${winner.split("@")[0]} gagne la partie !`;
      } else if (isTie) {
        status = `🤝 Match nul !`;
      } else {
        status = `🎲 Tour de @${room.game.currentTurn.split("@")[0]}`;
      }

      const finalMsg = `🎮 *TicTacToe*\n\n${status}\n\n${board}\n\n▢ ❎ : @${room.game.playerX.split("@")[0]}\n▢ ⭕ : @${room.game.playerO.split("@")[0]}\n\n${!winner && !isTie ? '📝 Réponds avec 1-9 ou *surrender*' : ''}`;

      for (const jid of [room.x, room.o]) {
        if (jid) {
          await conn.sendMessage(jid, {
            text: finalMsg,
            mentions: [room.game.playerX, room.game.playerO, ...(winner ? [winner] : [])]
          });
        }
      }

      if (winner || isTie || isSurrender) {
        delete games[room.id];
        conn.ev.off("messages.upsert", handler);
      }
    };

    conn.ev.on("messages.upsert", handler);
  } else {
    room = {
      id: "tictactoe-" + Date.now(),
      x: from,
      o: "",
      game: new TicTacToe(sender),
      state: "WAITING"
    };
    if (text) room.name = text;
    games[room.id] = room;
    return reply(`⏳ En attente d'un adversaire...\nTape *.ttt ${text || ''}* pour rejoindre.`);
  }
});
