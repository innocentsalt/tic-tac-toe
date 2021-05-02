const gameBoard = (() => {
    
    let _board = Array.from({length:3}, e => Array(3).fill(''))

    const getBoard = () => JSON.parse(JSON.stringify(_board))

    const clearBoard = () => { _board = Array.from({length:3}, e => Array(3).fill('')) }

    const isFull = () => _board.every(row => row.every(element => element !== ''))

    const placeMarker = (marker, row, col) => {
        _board[row][col] = marker
    }

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

    return { getBoard, clearBoard, isFull, placeMarker, checkWinner }
})()

const ticTacToe = (() => {

    let botLevel = 'easy'

    const playerSymbol = 'X'
    const botSymbol = 'O'

    const playerScore = document.querySelector('.player-score')
    const botScore = document.querySelector('.bot-score')

    document.querySelector('.player-name').addEventListener('click', () => {
        const newName = prompt('enter your name!', 'PlayerName')
        playerName.textContent = newName
    })

    document.querySelector('.bot-level').addEventListener('change', (e) => {
        botLevel = document.getElementById('bot-level').value
        console.log(botLevel)
        playerScore.textContent = '0'
        botScore.textContent = '0'
        startGame()
    })

    const result = document.querySelector('.result')

    document.querySelector('.restart').addEventListener('click', () => {
        playerScore.textContent = '0'
        botScore.textContent = '0'
        playAgain.style.display = 'none'
        startGame()
    })

    const playAgain = document.querySelector('.play-again')
    playAgain.addEventListener('click', () => {
        startGame()
    })

    const _setUpBoard = () => {

        gameBoard.clearBoard()
        
        const grid = document.querySelector('.grid')
        grid.innerHTML = ''

        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const box = document.createElement('div')
                box.setAttribute('id', `${row}${col}`)
                box.classList.add('box')
                box.classList.add('unmarked')
                grid.appendChild(box)
            }
        }
    }

    const _easyBot = () => {
        const board = gameBoard.getBoard()
        const emptySpots = [];
        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board[row].length; col++) {
                if (board[row][col] === '') {
                    emptySpots.push([row, col])
                }
            }
        }
        return emptySpots[Math.floor(Math.random() * emptySpots.length)]
    }

    const count = (arr, item) => arr.reduce((total, x) => (x === item ? total + 1 : total), 0)

    const _getBlockingMove = (opponentSymbol) => {

        const board = gameBoard.getBoard()

        for (let i = 0; i < board.length; i++) {
            if (count(board[i], opponentSymbol) === 2 && count(board[i], '') === 1) {
                return [ i, board[i].indexOf('') ]
            }
        }
    
        let leftDiagonal = []
        for (let i = 0; i < board.length; i++) {
            leftDiagonal.push(board[i][i])
        }
        if (count(leftDiagonal, opponentSymbol) === 2 && count(leftDiagonal, '') === 1) {
            return [ leftDiagonal.indexOf(''), leftDiagonal.indexOf('') ]
        }
    
        let rightDiagonal = []
        for (let i = board.length - 1; i >= 0; i--) {
            rightDiagonal.push(board[i][board.length - 1 - i])
        }
        if (count(rightDiagonal, opponentSymbol) === 2 && count(rightDiagonal, '') === 1) {
            return [ board.length - 1 - rightDiagonal.indexOf(''), rightDiagonal.indexOf('') ]
        }
    
        let transposed = Array.from({ length:3 }, e => Array(3).fill(''))
        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board[row].length; col++ ) {
                transposed[col][row] = board[row][col]
            }
        }

        for (let i = 0; i < transposed.length; i++) {
            if (count(transposed[i], opponentSymbol) === 2 && count(transposed[i], '') === 1) {
                return [ transposed[i].indexOf(''), i ]
            }
        }

        return false
    }

    const _mediumBot = () => {

        /** First check if bot can win (by blocking it's own move) */
        if (_getBlockingMove(botSymbol)) {
            return _getBlockingMove(botSymbol)
        }

        /** If not try to block the player */
        if (_getBlockingMove(playerSymbol)) {
            return _getBlockingMove(playerSymbol)
        }

        /** Else just return a random empty spot */
        return _easyBot()
    }

    const _updateResults = (winner) => {
        if (winner === false) {
            result.textContent = 'tie!'
        } else if (winner === playerSymbol) {
            result.textContent = 'you win!'
            playerScore.textContent = parseInt(playerScore.textContent) + 1
        } else if (winner === botSymbol) {
            result.textContent = 'bot wins!'
            botScore.textContent = parseInt(botScore.textContent) + 1
        }
        result.style.display = 'block'

        if (!playAgain.style.display) {
            playAgain.style.display = 'block'
        }
    }

    /** None of my buisness yet! */
    const sleep = (time) => {
        return new Promise((resolve) => setTimeout(resolve, time))
    }

    const startGame = () => {
        _setUpBoard()
        
        result.textContent = ''
        result.style.display = 'none'

        document.querySelectorAll('.grid').forEach((box) => {
            box.addEventListener('click', (e) => {
                if (!gameBoard.isFull() && !gameBoard.checkWinner()) {
                    if (e.originalTarget.classList[0] === 'box' && e.originalTarget.classList[1] === 'unmarked') {
                        const [ playerRow, playerCol ] = e.target.id.split('').map(item => parseInt(item))
                        gameBoard.placeMarker(playerSymbol, playerRow, playerCol)
                        e.target.textContent = playerSymbol
                        document.getElementById(e.target.id).classList.remove('unmarked')

                        let winner = gameBoard.checkWinner()

                        if (winner || gameBoard.isFull()) {
                            _updateResults(winner)
                        } else {
                            sleep(500).then(() => {
                                let botRow = ''
                                let botCol = ''
                                if (botLevel === 'easy') [ botRow, botCol ] = _easyBot()
                                else if (botLevel === 'medium') [ botRow, botCol ] = _mediumBot()
                                else if (botLevel === 'undefeatable') [ botRow, botCol ] = _undefeatableBot()
                                gameBoard.placeMarker(botSymbol, botRow, botCol)
                                const box = document.getElementById(`${botRow}${botCol}`)
                                box.textContent = botSymbol
                                box.classList.remove('unmarked')
                                winner = gameBoard.checkWinner()
                                if (winner || gameBoard.isFull()) {
                                    _updateResults(winner)
                                }
                            })   
                        }
                    }
                }
            })
        })
    }

    return { count, sleep, startGame }
})()

ticTacToe.startGame()
