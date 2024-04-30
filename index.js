
// setup pieces
/**
 * The first piece, placed when there is no piece in the cell
 */
var Level1 = jsboard.piece({ text: "1", textIndent: "-9999px", background: "#E63D30", width: "60px", height: "60px", margin: "0 auto", "border-radius": "50%" });

/**
 * The second piece, placed when there is a Level1 piece in the cell
 */
var Level2 = jsboard.piece({ text: "2", textIndent: "-9999px", background: "#F7F052", width: "60px", height: "60px", margin: "0 auto", "border-radius": "50%" });

/**
 * The third piece, placed when there is a Level2 piece in the cell
 */
var Level3 = jsboard.piece({ text: "3", textIndent: "-9999px", background: "#039963", width: "60px", height: "60px", margin: "0 auto", "border-radius": "50%" });

// variables for turns, piece to move and its locs
/**
 * The game turn (True = P1, False = P2)
 */
var turn = true;

/**
 * If the game started
 */
var started = false;

/**
 * If someone won the game
 */
var win = false;

/**
 * If CPU is enabled
 */
var CPU = false;


/**
 * Reset the board by removing all pieces
 */
function resetBoard() {

    started = false;
    win = false;

    for (var r = 0; r < b.rows(); r++) {
        for (var c = 0; c < b.cols(); c++) {
            b.cell([r,c]).style({ background: "#d3d3d3"});
            b.cell([r,c]).rid()
            b.cell([r,c]).on("click", updateCell);
        }
    }   
    

    turn = true;
}

/**
 * Update the cell with the piece
 * If empty -> Piece 1
 * If Piece 1 -> Piece 2
 * If Piece 2 -> Piece 3
 * You can't interact with a Piece 3
 * 
 */
function updateCell() {
    if (win) return;

    //Get the piece that's on the cell
    var cell = b.cell(b.cell(this).where())
    var piece = cell.get();

    switch (piece) {
        case null:
            cell.place(Level1.clone());
            break;
        case "1":
            cell.rid();
            cell.place(Level2.clone());
            break;
        case "2":
            cell.rid();
            cell.place(Level3.clone());
            break;
        default:
            return;
    }
    winCheck();
    if (!win) {
        turn = !turn;
        document.getElementById("turn").innerHTML = "It's Player " + (turn ? "1" : "2") + "'s turn!";
    }
}
/**
 * Aux function to get the gameboard
 * 
 * @returns {Array} Gameboard, 0 = empty, 1 = P1, 2 = P2, 3 = CO
 */
function getGameboard() {

    game = b.matrix()

    game.forEach((row, index) => {
        row.forEach((col, index2) => {
            switch (col) {
                case null:
                    game[index][index2] = "0";
                    break;
                case "1":
                    game[index][index2] = "1";
                    break;
                case "2":
                    game[index][index2] = "2";
                    break;
                case "3":
                    game[index][index2] = "3";
                    break;
            }
        });
    });

    //console.log("GAMEBOARD DONE: " + game)

    return game
}


/**
 * Check if someone has won
 * If gamemode is true, P1 wins if he reaches the P2 side
 */
function winCheck() {
    var game = getGameboard();

    // Check horizontal combinations
    for (var r = 0; r < game.length; r++) {
        for (var c = 0; c < game[r].length - 2; c++) {
            if (game[r][c] !== "0" && game[r][c + 1] !== "0" && game[r][c + 2] !== "0" &&
                game[r][c] !== game[r][c + 1] && 
                game[r][c] !== game[r][c + 2] &&
                game[r][c + 1] !== game[r][c + 2]
            ) {
                win = true;
                document.getElementById("turn").innerHTML = "Player " + (turn ? "1" : "2") + " wins horizontally!";
                b.cell([r,c]).style({ background: "#F0F0F0"});
                b.cell([r,c+1]).style({ background: "#F0F0F0"});
                b.cell([r,c+2]).style({ background: "#F0F0F0"});
                return;
            }
        }
    }

    // Check vertical combinations
    for (var r = 0; r < game.length - 2; r++) {
        for (var c = 0; c < game[r].length; c++) {
            if (game[r][c] !== "0" && game[r + 1][c] !== "0" && game[r + 2][c] !== "0" &&
                game[r][c] !== game[r + 1][c] && 
                game[r][c] !== game[r + 2][c] &&
                game[r + 1][c] !== game[r + 2][c]
            ) {
                win = true;
                document.getElementById("turn").innerHTML = "Player " + (turn ? "1" : "2") + " wins vertically!";
                b.cell([r,c]).style({ background: "#F0F0F0"});
                b.cell([r+1,c]).style({ background: "#F0F0F0"});
                b.cell([r+2,c]).style({ background: "#F0F0F0"});
                return;
            }
        }
    }

    // Check diagonal combinations (top-left to bottom-right)
    for (var r = 0; r < game.length - 2; r++) {
        for (var c = 0; c < game[r].length - 2; c++) {
            if (game[r][c] !== "0" && game[r + 1][c + 1] !== "0" && game[r + 2][c + 2] !== "0" &&
                game[r][c] !== game[r + 1][c + 1] && 
                game[r][c] !== game[r + 2][c + 2] &&
                game[r + 1][c + 1] !== game[r + 2][c + 2]
            ) {
                win = true;
                document.getElementById("turn").innerHTML = "Player " + (turn ? "1" : "2") + " wins diagonally!";
                b.cell([r,c]).style({ background: "#F0F0F0"});
                b.cell([r+1,c+1]).style({ background: "#F0F0F0"});
                b.cell([r+2,c+2]).style({ background: "#F0F0F0"});
                return;
            }
        }
    }

    // Check diagonal combinations (top-right to bottom-left)
    for (var r = 0; r < game.length - 2; r++) {
        for (var c = 2; c < game[r].length; c++) {
            if (game[r][c] !== "0" && game[r + 1][c - 1] !== "0" && game[r + 2][c - 2] !== "0" &&
                game[r][c] !== game[r + 1][c - 1] && 
                game[r][c] !== game[r + 2][c - 2] &&
                game[r + 1][c - 1] !== game[r + 2][c - 2]
            ) {
                win = true;
                document.getElementById("turn").innerHTML = "Player " + (turn ? "1" : "2") + " wins diagonally!";
                b.cell([r,c]).style({ background: "#F0F0F0"});
                b.cell([r+1,c-1]).style({ background: "#F0F0F0"});
                b.cell([r+2,c-2]).style({ background: "#F0F0F0"});
                return;
            }
        }
    }
   
}

/**
 * Init table to an Empty table
 * @param {int} size Size of the table (Default 5)
 */
function initTable(size = 5) {
    var table = document.getElementById("game");
    while (table.rows.length > 0) {
        table.deleteRow(0);
    }

    b = jsboard.board({ attach: "game", size: `${size}x${size}` });
    b.cell("each").style({ width: "65px", height: "65px" });
    started = false;
    resetBoard();

}


//Listeners for UI buttons
document.getElementById("reset").addEventListener("click", function () { resetBoard(); });
document.getElementById("gamemodeN").addEventListener("click", function () {
    gamemode = false;
    resetBoard();
    this.disabled = true;
    document.getElementById("gamemodeI").disabled = false;

});
document.getElementById("gamemodeI").addEventListener("click", function () {
    gamemode = true;
    resetBoard();
    this.disabled = true;
    document.getElementById("gamemodeN").disabled = false;
});
document.getElementById("size5").addEventListener("click", function () {
    initTable();
    this.disabled = true;
    document.getElementById("size7").disabled = false;
});
document.getElementById("size7").addEventListener("click", function () {
    initTable(7);
    this.disabled = true;
    document.getElementById("size5").disabled = false;
});
document.getElementById("CPU").addEventListener("click", function () {
    CPU = true;
    this.disabled = true;
    document.getElementById("2P").disabled = false;
});
document.getElementById("2P").addEventListener("click", function () {
    CPU = false;
    this.disabled = true;
    document.getElementById("CPU").disabled = false;
});
// create board
initTable();  // 5x5 board
