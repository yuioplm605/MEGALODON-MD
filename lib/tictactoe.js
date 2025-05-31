class TicTacToe {
  constructor(playerX) {
    this.playerX = playerX;
    this.playerO = null;
    this.currentTurn = playerX;
    this.board = Array(9).fill(null);
    this.winner = null;
    this.turns = 0;
  }

  turn(isPlayerO, position) {
    if (this.winner) return false;
    if ((isPlayerO && this.currentTurn !== this.playerO) || (!isPlayerO && this.currentTurn !== this.playerX)) {
      return false; // Pas au tour du joueur
    }
    if (position < 0 || position > 8 || this.board[position]) {
      return false; // Case prise ou invalide
    }
    this.board[position] = isPlayerO ? 'O' : 'X';
    this.turns++;
    this.checkWinner();
    this.currentTurn = this.currentTurn === this.playerX ? this.playerO : this.playerX;
    return true;
  }

  checkWinner() {
    const b = this.board;
    const lines = [
      [0,1,2],[3,4,5],[6,7,8],  // lignes
      [0,3,6],[1,4,7],[2,5,8],  // colonnes
      [0,4,8],[2,4,6]           // diagonales
    ];
    for (const [a,bIndex,c] of lines) {
      if (b[a] && b[a] === b[bIndex] && b[a] === b[c]) {
        this.winner = b[a];
        break;
      }
    }
  }

  render() {
    return this.board.map((cell, i) => cell || (i + 1).toString());
  }
}

module.exports = TicTacToe;
