// https://www.youtube.com/watch?v=rAUn1Lom6dw

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-button')
    const width = 10
    let nextRandom = 0
    let timerId
    let score = 0
    let ghostPiece;
    const colors = [
        'cyan',
        'pink',
        'magenta',
        'lime',
        'red', 
        'blue',
        'orange'
    ]
    // console.log("squares:", squares);
// The Tetrominoes
const iTet = [
    [width, width+1, width+2, width+3],
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3],
    [1, width+1, width*2+1, width*3+1],
]
const oTet = [
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1]
]
const tTet = [
    [1,width,width+1,width+2],
    [1,width+1,width+2,width*2+1],
    [width,width+1,width+2,width*2+1],
    [1,width,width+1,width*2+1]
]
const sTet = [
    [1, 2, width, width+1],
    [0, width, width+1, width*2+1],
    [1, 2, width, width+1],
    [0, width, width+1, width*2+1]
]
const zTet = [
    [0, 1, width+1, width+2],
    [1, width, width+1,width*2],
    [0, 1, width+1, width*2],
    [1, width, width+1,width*2]
]
const jTet = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
]
const lTet = [
    [width, width+1, width+2, 2],
    [1, width+1, width*2+1, width*2+2],
    [width, width+1, width+2, 2],
    [0, 1, width+1, width*2+1]
]




const theTets = [iTet, oTet, tTet, sTet, zTet, jTet, lTet]

let currentPosition = 4
let currentRotation = 0
console.log("theTets: ", theTets[0][0])
// randomly select a tetro
let random = Math.floor(Math.random()*theTets.length)
console.log("random: ", random)
let current = theTets[random][currentRotation]

// draw the Tetromino and first rotation
function draw() {
    current.forEach(index => {
        console.log("CurrPos: ", currentPosition)
        console.log("Ind: ", index)
        console.log("squ[curr+ind]: ", squares[currentPosition + index])

        squares[currentPosition + index].classList.add("tetro")
        squares[currentPosition + index].style.backgroundColor = colors[random]
    })
    updateGhostPiece();
}

 // Undraw
function undraw() {
    current.forEach(index => {
        console.log("96currPos: ", currentPosition)
        console.log("96Index: ", index)
        squares[currentPosition + index].classList.remove("tetro")
        squares[currentPosition + index].style.backgroundColor = ''
    })
    console.log("101undraw")
}


// Assign functions to keyCodes
function control(e) {
    if(e.keyCode === 37) {
        moveLeft()
    } else if (e.keyCode === 38) {
        rotate()
    } else if (e.keyCode === 39) {
        moveRight()
    } else if (e.keyCode === 40) {
        moveDown() // used to be startMoveDown
    }
}
document.addEventListener('keyup', control)

function moveDown() {
    console.log("119movedown")
    undraw();
    undrawGhostPiece()
    // Check if the Tet has reached the top row
    if (current.some(index => currentPosition + index >= width * (width - 1))) {
        // Tet has reached top row
        console.log("125movedownIFstate")
        gameOver();
        return;
    }
    currentPosition += width;
    console.log("127CurrentPosition: ", currentPosition)
    draw();
    drawGhostPiece();
    freeze();
    console.log("132")
}

// freeze at bottom
function freeze() {
//     if (current.some(index => squares[currentPosition + index + width] === undefined || squares[currentPosition + index + width].classList.contains("taken"))) {
        console.log("Start freeze")
    if (current.some(index => squares[currentPosition + index + width].classList.contains("taken"))) {
        current.forEach(index => squares[currentPosition + index].classList.add("taken"))
        // Start a new tetromino falling
        random = nextRandom
        nextRandom = Math.floor(Math.random() * theTets.length)
        console.log("nextRando: ", nextRandom)
        current = theTets[random][currentRotation]
        currentPosition = 4
        draw()
        displayShape()
        console.log("line 114")
        addScore()
        gameOver()
    }
    console.log("End freeze")
}

// Move the tetromino left unless it is at the edge or is blocked
function moveLeft() {
    console.log("158 moveLeft")
    undraw()
    undrawGhostPiece()
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

    if (!isAtLeftEdge) currentPosition -= 1

    if (current.some(index => squares[currentPosition + index].classList.contains("taken"))) {
        currentPosition += 1
    }
    console.log("159currentPosition: ", currentPosition)
    updateGhostPiece(); // update ghost piece position
    draw()
    console.log("171 end moveLeft")
}

// Move the tetromino right
function moveRight() {
    console.log("176 moveRight")
    undraw()
    undrawGhostPiece()
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)

    if (!isAtRightEdge) currentPosition += 1

    if (current.some(index => squares[currentPosition + index].classList.contains("taken"))) {
        currentPosition -= 1
    }
    console.log("174currentPosition: ", currentPosition)
    updateGhostPiece(); // update ghost piece position
    draw()
    console.log("189 moveRight")
}

// Fix rotation of tet at the edge
function isAtRight() {
    console.log("194 isAtRight")
    return current.some(index => (currentPosition + index + 1) % width === 0)
}
function isAtLeft() {
    console.log("198 isAtLeft")
    return current.some(index => (currentPosition + index) % width === 0)
}

function checkRotatedPosition(P) {
    console.log("203checkRot")
    P = P || currentPosition // get current position. Then check if the piece is near the left side.
    if ((P + 1) % width < 4) { // add 1 because the pos ind can be 1 less than where the piece is
        if (isAtRight()) {  // use actual position to check if it's fliped over to right side
            currentPosition += 1 // if so, ad one to wrap it back around
            checkRotatedPosition(P) // check again; pass position from start since long block might need to move more
        }
    }
    else if (P % width > 5) {
        if (isAtLeft()) {
            currentPosition -= 1
            checkRotatedPosition(P)
        }
    }
    console.log("217checkRot")
}
// Rotate the tetromino
function rotate() {
    console.log("221rotate")
    undraw()
    undrawGhostPiece()
    currentRotation++
    if(currentRotation === current.length) { // if rotation goes to 4, go back to 0
        currentRotation =0
    }
    current = theTets[random][currentRotation]
    draw()
    drawGhostPiece()
    console.log("231rotate")
}

// New functions for ghost piece
function isCollision(position) {
    console.log("236isColl")
    console.log("237pos: ", position)
    return current.some(index => squares[position + index].classList.contains('taken'));
}

function calculateGhostPiece() {
    console.log("242calcGhost")
    let ghostPosition = currentPosition;
    while (!isCollision(ghostPosition + width) && ghostPosition < 190) {
        ghostPosition += width;
    }
    ghostPiece = current.map(index => ghostPosition + index);
    console.log("248calcGhost")
}

function drawGhostPiece() {
    console.log("252drawGhost")
    ghostPiece.forEach (index => {
        if (index < width) return;
        squares[index].classList.add("ghost");
        squares[index].style.backgroundColor = ("ghost");
    });
    console.log("258drawGhost")
}

function undrawGhostPiece() {
    console.log("262UndrawGhost")
    ghostPiece.forEach (index => {
        squares[index].classList.remove("ghost");
        squares[index].style.backgroundColor = "";
    });
    console.log("267UndrawGhost")
}

function updateGhostPiece() {
    console.log("271updGhost")
    calculateGhostPiece();
    drawGhostPiece();
}

// Show the up-next tetromino in the mini-grid
const displaySquares = document.querySelectorAll('.mini-grid div')
const displayWidth = 4
const displayIndex = 0


// The Tetros without rotations
const upNextTetro = [
    [displayWidth, displayWidth+1, displayWidth+2, displayWidth+3], //itet
    [0, 1, displayWidth, displayWidth+1], // oTet
    [1,displayWidth,displayWidth+1, displayWidth+2], // tTet
    [1, 2, displayWidth, displayWidth+1], //sTet
    [0, 1, displayWidth+1, displayWidth+2], // zTet
    [1, displayWidth+1, displayWidth*2+1, 2], // jTet
    [displayWidth, displayWidth+1,displayWidth+2, 2] // lTet
  
]
// Display the next shape in the mini-grid display
function displayShape() {
    //remove any trace of a tetromino form the entire grid
    console.log("296dispSh")
    displaySquares.forEach(square => {
      square.classList.remove('tetro')
      square.style.backgroundColor = ''
    })
    upNextTetro[nextRandom].forEach( index => {
      displaySquares[displayIndex + index].classList.add('tetro')
      displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
    })
    console.log("305dispSh")
  }


// Add start/pause button functionality
startBtn.addEventListener('click', () => {
    if (timerId) {
        clearInterval(timerId)
        timerId = null
    } else {
        draw()
        timerId = setInterval(moveDown, 500)
        nextRandom = Math.floor(Math.random() * theTets.length)
        displayShape()
    }
})

// Recalculate and redraw ghost piece
function updateGhostPieceAfterClearingRow() {
    console.log("324")
    undrawGhostPiece();
    for (let i = 0; i < 199; i+= width) {
        // Every square that makes a row
        const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];
        // If every row taken
        if (row.every(index => squares[index].classList.contains('taken'))) {
            score += 10; // Add to the score
            scoreDisplay.innerHTML = score;
            row.forEach(index => {
                squares[index].classList.remove('taken')
                squares[index].classList.remove('tetro')
                squares[index].style.backgroundColor = '';
        })
        const squaresRemoved = squares.splice(i, width)
            squares = squaresRemoved.concat(squares)
            squares.forEach(cell => grid.appendChild(cell))
            // Remove the row
            console.log("310Row complete")
            if (i < width) {
                // Adjust the currentPosition only if the row is at the bottom
                currentPosition -= width;
            }
            calculateGhostPiece();
            drawGhostPiece();
        }
    }
    currentPosition -= width; // Adjust the current position to account for cleared row
    calculateGhostPiece();
    drawGhostPiece();
    console.log("354")
}

// Add score
function addScore() {
    console.log("359addScore")
    for (let i = 0; i < 199; i += width) {
        // Every square that makes a row
        const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9] 
        // If every square in the row is taken
        if(row.every(index => squares[index].classList.contains('taken'))) {
            score += 10; // Add to the score
            scoreDisplay.innerHTML = score;
            row.forEach(index => {
                squares[index].classList.remove('taken')
                squares[index].classList.remove('tetro')
                squares[index].style.backgroundColor = ''
            })
            const squaresRemoved = squares.splice(i, width)
            squares = squaresRemoved.concat(squares)
            squares.forEach(cell => grid.appendChild(cell))
            // Remove the row
            console.log("342Row complete")
            updateGhostPieceAfterClearingRow();
        }
    }
    console.log("380addScore")
}
function gameOver() {
    console.log("383gameOver")
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        scoreDisplay.innerHTML = 'end'
        clearInterval(timerId)
    }
    console.log("388gameOver")
}
// Game over
// function gameOver() {
//     console.log("358currPos: ", currentPosition)
//     // console.log("359ind: ", index)
//     console.log("360width: ", width)
//     // console.log("361bool: ", squares[currentPosition + index].classList.contains('taken'))
//     // if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
//         // if(current.some(index => (currentPosition + index) < width || squares[currentPosition + index].classList.contains('taken'))) {
//     if(current.some(index => {
//         const position = currentPosition + index;
//         console.log("366currPos: ", currentPosition)
//         console.log("367ind: ", index)
//         console.log("369pos: ", position)
//         console.log("370width: ", width)
//         console.log("369ret: ", position < width || squares[currentPosition + index].classList.contains('taken'))
//         return position < width || squares[currentPosition + index].classList.contains('taken');
//     })) {
//         console.log("371")
//         scoreDisplay.innerHTML = 'end'
//         clearInterval(timerId)
//         console.log("374")
//     }
//     console.log("376")
// }
}) // Ends the event listener line 1 




