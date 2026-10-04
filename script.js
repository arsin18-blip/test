let field = document.querySelector('.field')
let restarter = document.querySelector('.restarter')

let size_x = 16
let size_y = 16

let total = 256
let mines = 40
let board = []
let game_over = false
let open_pols = 0



function start() {
    board = []
    game_over = false
    open_pols = 0
    for (let r = 0; r < size_y; r++) {
        let row = []
        for (let c = 0; c < size_x; c++) {
            let cell = {
                r:r, c:c,
                mine: false,
                revealed: false,
                flagged:  false,
                count: 0,
                element: null
            }
            
            const el = document.createElement('div')
            el.classList.add('cell')

            el.addEventListener('click', () => clickCell(cell))
            el.addEventListener('contextmenu', (e) => {
                e.preventDefault()
                flagCell(cell)
            })

            field.appendChild(el)
            cell.element = el
            row.push(cell)
        }
        board.push(row)
    }
    let placed = 0
    while (placed < mines) {
        let r = Math.floor(Math.random() * size_y)
        let c = Math.floor(Math.random() * size_x)
        if (!board[r][c].mine) {
            board[r][c].mine = true
            placed++
        }
    }
    for (let r = 0; r < size_y; r++) {
        for (let c = 0; c < size_x; c++) {
            if (board[r][c].mine) continue
            let count = 0
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    let nr = r + dr, nc = c + dc
                    if (nr >= 0 && nr < size_y && nc >= 0 && nc < size_x && board[nr][nc].mine) {
                        count ++
                    }
                }
            }
            board[r][c].count = count
        }
    }
}

function clickCell(cell) {
    if (game_over || cell.revealed || cell.flagged) return

    if (cell.mine) {
        cell.element.classList.add('mine')
        cell.element.textContent = '💣'
        game_over = true
        revealMines()
        alert('Вы проиграли:(:(')
        return
    }

    restarter.innerHTML = `<img src="img/logo.png" alt="">`
    setTimeout(() => {
    restarter.innerHTML = `<img src="img/pickaxe.png" alt="">`}, 500
    )
    reveal(cell)

    if (open_pols === (size_x * size_y) - mines) {
        alert('Вы победили!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
        game_over = true
    }
}

function reveal(cell) {
    if (cell.revealed || cell.flagged) return
    cell.revealed = true
    open_pols++
    cell.element.classList.add('open')

    if (cell.count > 0) {
        cell.element.textContent = cell.count
    } else {
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                let nr = cell.r + dr, nc = cell.c + dc
                if (nr >= 0 && nr < size_y && nc >= 0 && nc < size_x) {
                    reveal(board[nr][nc])
                }
            }
        }
    }
}

function flagCell(cell) {
    if ( game_over || cell.revealed) return
    cell.flagged = !cell.flagged

    if (cell.flagged) {
        cell.element.classList.add('flagged')
        cell.element.textContent = '🚩'
    } else {
        cell.element.classList.remove('flagged')
        cell.element.textContent = ''
    }
}

function revealMines() {
    for (let r = 0; r < size_y; r++) {
        for (let c = 0; c < size_x; c++) {
            if (board[r][c].mine) {
                board[r][c].element.textContent = '💣'
                board[r][c].element.classList.add('mine')
            }
        }
    }
}

start()



restarter.addEventListener('click', function() {
    location.reload()
})