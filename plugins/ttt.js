const { cmd } = require("../command");

cmd({
  pattern: "tictactoe",
  alias: ["xo", "ttt"],
  react: "🎮",
  desc: "Jouer à Tic Tac Toe à 2 joueurs.",
  category: "game",
  filename: __filename,
}, async (conn, mek, m, {
  from,
  sender,
  participants,
  reply,
  args
}) => {
  if (!m.mentionedJid || m.mentionedJid.length < 1) {
    return reply("👥 Mentionne un joueur pour démarrer.\n\n*Exemple:* .tictactoe @user");
  }

  const playerX = sender;
  const playerO = m.mentionedJid[0];

  if (playerX === playerO) return reply("❎ Tu ne peux pas jouer contre toi-même.");

  let board = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];
  let currentPlayer = "❌";
  let currentID = playerX;
  let turns = 0;
  let gameActive = true;

  const renderBoard = () => {
    return `
🎮 *Tic Tac Toe 2 Joueurs*

${board[0]} | ${board[1]} | ${board[2]}
${board[3]} | ${board[4]} | ${board[5]}
${board[6]} | ${board[7]} | ${board[8]}

*Tour de:* ${currentPlayer === "❌" ? "@user1" : "@user2"} (${currentPlayer})
Réponds avec un chiffre (1-9) pour jouer.
`.replace("@user1", "@" + playerX.split("@")[0])
 .replace("@user2", "@" + playerO.split("@")[0]);
  };

  const checkWin = () => {
    const winPatterns = [
      [0,1,2], [3,4,5], [6,7,8],
      [0,3,6], [1,4,7], [2,5,8],
      [0,4,8], [2,4,6]
    ];
    return winPatterns.some(([a,b,c]) =>
      board[a] === currentPlayer && board[b] === currentPlayer && board[c] === currentPlayer
    );
  };

  const sent = await conn.sendMessage(from, {
    text: renderBoard(),
    mentions: [playerX, playerO]
  }, { quoted: m });

  const messageID = sent.key.id;

  const timeout = setTimeout(() => {
    gameActive = false;
    conn.ev.off("messages.upsert", gameHandler);
    reply("⌛ Temps écoulé. Partie annulée !");
  }, 180000); // 3 minutes

  const gameHandler = async (msgData) => {
    if (!gameActive) return;

    const msg = msgData.messages?.[0];
    if (!msg || !msg.message) return;

    const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
    const senderID = msg.key.participant || msg.key.remoteJid;
    const isReplyToGame = msg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;

    if (isReplyToGame && senderID === currentID) {
      const move = parseInt(text.trim());
      if (isNaN(move) || move < 1 || move > 9) {
        return conn.sendMessage(from, { text: "❎ Choix invalide. Envoie un chiffre de 1 à 9." }, { quoted: msg });
      }

      const index = move - 1;
      if (board[index] === "❌" || board[index] === "⭕") {
        return conn.sendMessage(from, { text: "❎ Cette case est déjà prise." }, { quoted: msg });
      }

      board[index] = currentPlayer;
      turns++;

      if (checkWin()) {
        gameActive = false;
        clearTimeout(timeout);
        conn.ev.off("messages.upsert", gameHandler);
        return conn.sendMessage(from, {
          text: `🎉 *${currentPlayer} gagne la partie !*\n\n${renderBoard()}`,
          mentions: [playerX, playerO]
        }, { quoted: msg });
      }

      if (turns === 9) {
        gameActive = false;
        clearTimeout(timeout);
        conn.ev.off("messages.upsert", gameHandler);
        return conn.sendMessage(from, {
          text: `🤝 *Match nul !*\n\n${renderBoard()}`,
          mentions: [playerX, playerO]
        }, { quoted: msg });
      }

      // Changer de joueur
      currentPlayer = currentPlayer === "❌" ? "⭕" : "❌";
      currentID = currentID === playerX ? playerO : playerX;

      conn.sendMessage(from, {
        text: renderBoard(),
        mentions: [playerX, playerO]
      }, { quoted: msg });
    }
  };

  conn.ev.on("messages.upsert", gameHandler);
});
