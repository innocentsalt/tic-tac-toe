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

    const playerName = document.querySelector('.player-name')
    playerName.addEventListener('click', () => {
        const newName = prompt('enter your name!', 'PlayerName')
        playerName.textContent = newName
    })

    const botLevelSelector = document.querySelector('.bot-level')
    botLevelSelector.addEventListener('change', (e) => {
        botLevel = document.getElementById('bot-level').value
        console.log(botLevel)
        playerScore.textContent = '0'
        botScore.textContent = '0'
        startGame()
    })

    const result = document.querySelector('.result')

    const restart = document.querySelector('.restart')
    restart.addEventListener('click', () => {
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

    const _sleep = (time) => {
        return new Promise((resolve) => setTimeout(resolve, time))
    }

    const startGame = () => {
        _setUpBoard()
        
        result.textContent = ''
        result.style.display = 'none'

        const gridList = document.querySelectorAll('.grid')
        gridList.forEach((box) => {
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
                            _sleep(500).then(() => {
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

    return { startGame }
})()

ticTacToe.startGame()
