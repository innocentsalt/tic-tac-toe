const gameBoard = (() => {
    
    let _board = new Array(3).fill(new Array(3).fill(''))

    const clearBoard = () => { _board = new Array(3).fill(new Array(3).fill('')) }

    const isFull = () => _board.every((row) => row.every((element) => element !== ''))

    const placeMarker = (marker, row, col) => { _board[row][col] = marker }

    const checkWinner = () => {
        /** CHECK ROWS */
        for (let row = 0; row < _board.length; row++) {
            if (_board[row][0] !== '' && _board[row][0] === _board[row][1] && _board[row][1] === _board[row][2]) {
                return _board[row][0]
            }
        }

        /** CHECK COLUMNS */
        for (let col = 0; col < _board.length; col++) {
            if (_board[0][col] !== '' && _board[0][col] === _board[1][col] && _board[1][col] === _board[2][col]) {
                return _board[0][col]
            }
        }

        /** CHECK LEFT DIAGONAL */
        if (_board[0][0] !== '' && _board[0][0] === _board[1][1] && _board[1][1] === _board[2][2]) {
            return _board[0][0]
        }

        /** CHECK RIGHT DIAGONAL */
        if (_board[2][0] !== '' && _board[0][2] === _board[1][1] && _board[1][1] === _board[2][0]) {
            return _board[0][2]
        }

        return false
    }

    return { clearBoard, isFull, placeMarker, checkWinner }
})()
