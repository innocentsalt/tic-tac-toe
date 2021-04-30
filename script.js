const gameBoard = (() => {
    
    let _board = new Array(3).fill(new Array(3).fill(''))

    const clearBoard = () => { _board = new Array(3).fill(new Array(3).fill('')) }

    const isFull = () => _board.every((row) => row.every((element) => element !== ''))

    const placeMarker = (marker, row, col) => { _board[row][col] = marker }

    const checkWinner = () => {
        /** CHECK ROWS */
        /** CHECK COLUMNS */
        /** CHECK LEFT DIAGONAL */
        /** CHECK RIGHT DIAGONAL */
    }
})()
