class TicTacToe {
  constructor(playerX, playerO = null) {
    this.board = Array.from({ length: 9 }, (_, i) => (i + 1).toString());
    this.playerX = playerX;
    this.playerO = playerO;
    this.currentTurn = playerX;
    this.turns = 0;
    this.winner = null;
  }

  render() {
    return this.board;
  }

  turn(isPlayerO, position) {
    if (this.winner || position < 0 || position > 8 || ['X', 'O'].includes(this.board[position])) {
      return false;
    }

    const mark = isPlayerO ? 'O' : 'X';
    const expectedPlayer = isPlayerO ? this.playerO : this.playerX;

    if (this.currentTurn !== expectedPlayer) {
      return false;
    }

    this.board[position] = mark;
    this.turns++;
    this.checkWinner(mark);

    if (!this.winner && this.turns < 9) {
      this.currentTurn = isPlayerO ? this.playerX : this.playerO;
    }

    return true;
  }

  checkWinner(mark) {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    for (let [a, b, c] of winPatterns) {
      if (this.board[a] === mark && this.board[b] === mark && this.board[c] === mark) {
        this.winner = mark === 'X' ? this.playerX : this.playerO;
        break;
      }
    }
  }

  isTie() {
    return this.turns >= 9 && !this.winner;
  }

  reset() {
    this.board = Array.from({ length: 9 }, (_, i) => (i + 1).toString());
    this.currentTurn = this.playerX;
    this.turns = 0;
    this.winner = null;
  }
}

module.exports = TicTacToe;
