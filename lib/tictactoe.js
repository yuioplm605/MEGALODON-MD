class TicTacToe {
  constructor(playerX, playerO = "") {
    this.board = Array(9).fill(null).map((_, i) => (i + 1).toString());
    this.playerX = playerX;
    this.playerO = playerO;
    this.currentTurn = playerX;
    this.winner = null;
    this.turns = 0;
  }

  render() {
    return this.board;
  }

  turn(player, position) {
    if (this.winner || position < 0 || position > 8 || ["X", "O"].includes(this.board[position])) {
      return false;
    }

    const symbol = player === this.playerX ? "X" : "O";

    if (this.currentTurn !== player) return false;

    this.board[position] = symbol;
    this.turns++;
    this.checkWin(symbol);

    this.currentTurn = this.currentTurn === this.playerX ? this.playerO : this.playerX;
    return true;
  }

  checkWin(symbol) {
    const winCombos = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // lignes
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // colonnes
      [0, 4, 8], [2, 4, 6]             // diagonales
    ];

    for (const [a, b, c] of winCombos) {
      if (this.board[a] === symbol && this.board[b] === symbol && this.board[c] === symbol) {
        this.winner = symbol === "X" ? this.playerX : this.playerO;
        break;
      }
    }
  }
}

module.exports = TicTacToe;
