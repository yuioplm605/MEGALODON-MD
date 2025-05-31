const { cmd } = require("../command");

cmd({
  pattern: "tictactoe",
  alias: ["xo", "ttt"],
  react: "🎮",
  desc: "Jouer au jeu du Tic Tac Toe.",
  category: "game",
  filename: __filename,
}, async (conn, mek, m, {
  from,
  sender,
  reply
}) => {
  let board = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];
  let currentPlayer = "❌";
  let gameActive = true;
  let turns = 0;

  const renderBoard = () => {
    return `
🎮 *Tic Tac Toe*
${board[0]} | ${board[1]} | ${board[2]}
${board[3]} | ${board[4]} | ${board[5]}
${board[6]} | ${board[7]} | ${board[8]}

*Tour de:* ${currentPlayer}
Réponds avec un chiffre (1-9) pour jouer. ⏳
`;
  };

  const checkWin = () => {
    const winPatterns = [
      [0,1,2], [3,4,5], [6,7,8], // rows
      [0,3,6], [1,4,7], [2,5,8], // columns
      [0,4,8], [2,4,6],          // diagonals
    ];
    return winPatterns.some(([a,b,c]) =>
      board[a] === currentPlayer && board[b] === currentPlayer && board[c] === currentPlayer
    );
  };

  const sent = await conn.sendMessage(from, {
    text: renderBoard()
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
    const senderID = msg.key.remoteJid;
    const isReplyToGame = msg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;

    if (isReplyToGame && senderID === from) {
      const move = parseInt(text.trim());
      if (isNaN(move) || move < 1 || move > 9 || !/^\d$/.test(text.trim())) {
        return conn.sendMessage(from, { text: "❎ Choix invalide. Envoie un chiffre de 1 à 9." }, { quoted: msg });
      }

      const index = move - 1;
      if (board[index] === "❌" || board[index] === "⭕") {
        return conn.sendMessage(from, { text: "❎ Case déjà prise. Choisis une autre." }, { quoted: msg });
      }

      board[index] = currentPlayer;
      turns++;

      if (checkWin()) {
        gameActive = false;
        clearTimeout(timeout);
        conn.ev.off("messages.upsert", gameHandler);
        return conn.sendMessage(from, {
          text: `🎉 *${currentPlayer} gagne !*\n\n${renderBoard()}`
        }, { quoted: msg });
      }

      if (turns === 9) {
        gameActive = false;
        clearTimeout(timeout);
        conn.ev.off("messages.upsert", gameHandler);
        return conn.sendMessage(from, {
          text: `🤝 *Match nul !*\n\n${renderBoard()}`
        }, { quoted: msg });
      }

      // Changer de joueur
      currentPlayer = currentPlayer === "❌" ? "⭕" : "❌";
      conn.sendMessage(from, {
        text: renderBoard()
      }, { quoted: msg });
    }
  };

  conn.ev.on("messages.upsert", gameHandler);
});
