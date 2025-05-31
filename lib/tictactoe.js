class TicTacToe {
  constructor(playerX) {
    this.board = Array(9).fill(null);
    this.playerX = playerX;
    this.playerO = null;
    this.currentTurn = playerX;
    this.winner = null;
    this.turns = 0;
  }

  turn(isPlayerO, index) {
    if (this.winner) return false;
    if (index < 0 || index > 8) return false;
    if (this.board[index] !== null) return false;

    const player = isPlayerO ? 'O' : 'X';
    if ((player === 'X' && this.currentTurn !== this.playerX) ||
      (player === 'O' && this.currentTurn !== this.playerO)) {
      return false;
    }

    this.board[index] = player;
    this.turns++;

    // Vérifier victoire
    if (this.checkWin(player)) {
      this.winner = this.currentTurn;
    } else if (this.turns === 9) {
      this.winner = null; // match nul
    } else {
      // Changer de joueur
      this.currentTurn = player === 'X' ? this.playerO : this.playerX;
    }

    return true;
  }

  checkWin(player) {
    const b = this.board;
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // lignes
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // colonnes
      [0, 4, 8], [2, 4, 6]             // diagonales
    ];

    return lines.some(([a, b1, c]) =>
      b[a] === player && b[b1] === player && b[c] === player
    );
  }

  render() {
    return this.board.map(cell => cell || (this.board.indexOf(cell) + 1).toString());
  }
}

module.exports = TicTacToe;
