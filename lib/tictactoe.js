class TicTacToe {
  constructor(playerX, playerO) {
    this.board = Array(9).fill('1️⃣');
    this.playerX = playerX;
    this.playerO = playerO;
    this.currentTurn = playerX;
    this.winner = null;
    this.turns = 0;
  }

  turn(player, move) {
    if (this.winner) return false;
    if (player !== this.currentTurn) return false;
    if (typeof this.board[move] !== 'string' || !'1️⃣'.includes(this.board[move])) return false;

    this.board[move] = player === this.playerX ? '❌' : '⭕';
    this.turns++;

    if (this.checkWin()) {
      this.winner = this.board[move];
    } else {
      this.currentTurn = player === this.playerX ? this.playerO : this.playerX;
    }
    return true;
  }

  checkWin() {
    const b = this.board;
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    return lines.some(([a, b2, c]) =>
      b[a] !== '1️⃣' && b[a] === b[b2] && b[a] === b[c]
    );
  }

  render() {
    const b = this.board;
    return `${b[0]}${b[1]}${b[2]}\n${b[3]}${b[4]}${b[5]}\n${b[6]}${b[7]}${b[8]}`;
  }
}

module.exports = TicTacToe;
