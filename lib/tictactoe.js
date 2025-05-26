class TicTacToe {
    constructor(playerX, playerO = '') {
        this.playerX = playerX;
        this.playerO = playerO;
        this._currentTurn = true; // true = X, false = O
        this.board = Array(9).fill('');
        this.winner = null;
        this.turns = 0;
    }

    get currentTurn() {
        return this._currentTurn ? this.playerX : this.playerO;
    }

    turn(playerIsO, position) {
        const symbol = playerIsO ? 'O' : 'X';

        if (this.board[position] || this.winner) return false;

        this.board[position] = symbol;
        this.turns++;

        if (this.checkWin(symbol)) {
            this.winner = playerIsO ? this.playerO : this.playerX;
        } else {
            this._currentTurn = !this._currentTurn;
        }

        return true;
    }

    checkWin(symbol) {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
            [0, 4, 8], [2, 4, 6]             // diagonals
        ];

        return winPatterns.some(pattern =>
            pattern.every(index => this.board[index] === symbol)
        );
    }

    render() {
        return this.board.map((v, i) => v || String(i + 1));
    }
}

module.exports = TicTacToe;
