class TicTacToe {
  constructor(playerX, playerO) {
    this.board = Array.from({ length: 9 }, (_, i) => `${i + 1}`);
    this.playerX = playerX;
    this.playerO = playerO;
    this.currentTurn = playerX;
    this.winner = null;
    this.turns = 0;
  }

  turn(player, pos) {
    if (this.winner) return false;
    if (player !== this.currentTurn) return false;
    if (!/^[0-8]$/.test(pos) || isNaN(pos)) return false;
    if (this.board[pos] === '❌' || this.board[pos] === '⭕') return false;

    this.board[pos] = player === this.playerX ? '❌' : '⭕';
    this.turns++;

    if (this.checkWin()) {
      this.winner = player;
    } else {
      this.currentTurn = player === this.playerX ? this.playerO : this.playerX;
    }
    return true;
  }

  checkWin() {
    const b = this.board;
    const wins = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    return wins.some(([a, b1, c]) => b[a] === b[b1] && b[a] === b[c]);
  }

  render() {
    const emojiMap = {
      '1': '1️⃣', '2': '2️⃣', '3': '3️⃣',
      '4': '4️⃣', '5': '5️⃣', '6': '6️⃣',
      '7': '7️⃣', '8': '8️⃣', '9': '9️⃣',
      '❌': '❌', '⭕': '⭕'
    };
    return `${emojiMap[this.board[0]]}${emojiMap[this.board[1]]}${emojiMap[this.board[2]]}\n` +
           `${emojiMap[this.board[3]]}${emojiMap[this.board[4]]}${emojiMap[this.board[5]]}\n` +
           `${emojiMap[this.board[6]]}${emojiMap[this.board[7]]}${emojiMap[this.board[8]]}`;
  }
}

module.exports = TicTacToe;
