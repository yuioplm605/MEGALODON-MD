class TicTacToe {
  constructor(playerX) {
    this.board = Array.from({ length: 9 }, (_, i) => (i + 1).toString());
    this.playerX = playerX;
    this.playerO = '';
    this.currentTurn = playerX;
    this.winner = '';
    this.turns = 0;
  }

  render() {
    return this.board;
  }

  turn(playerO, index) {
    if (this.board[index] === 'X' || this.board[index] === 'O') return false;
    const symbol = playerO ? 'O' : 'X';
    const currentPlayer = playerO ? this.playerO : this.playerX;
    if (this.currentTurn !== currentPlayer) return false;

    this.board[index] = symbol;
    this.turns += 1;
    this.checkWin(symbol);
    if (!this.winner) {
      this.currentTurn = this.currentTurn === this.playerX ? this.playerO : this.playerX;
    }
    return true;
  }

  checkWin(symbol) {
    const winPatterns = [
      [0,1,2], [3,4,5], [6,7,8],
      [0,3,6], [1,4,7], [2,5,8],
      [0,4,8], [2,4,6],
    ];
    for (const pattern of winPatterns) {
      if (pattern.every(i => this.board[i] === symbol)) {
        this.winner = symbol === 'X' ? this.playerX : this.playerO;
      }
    }
  }
}

module.exports = TicTacToe;
