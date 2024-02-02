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
    const colors = [
        'orange', 
        'red', 
        'purple',
        'green',
        'blue'
    ]


    // console.log("squares:", squares);
// The Tetrominoes
const jTet = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
]

const zTet = [
    [1, width, width+1, width+2],
    [1, width+1, width+2, width*2+1],
    [width, width+1, width+2, width*2+1],
    [1, width, width+1,width*2+1]
]

const tTet = [
    [1,width,width+1,width+2],
    [1,width+1,width+2,width*2+1],
    [width,width+1,width+2,width*2+1],
    [1,width,width+1,width*2+1]
    ]

const oTet = [
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1]
]

const iTet = [
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3],
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3],
]

const theTets = [jTet, zTet, tTet, oTet, iTet]


let currentPosition = 4
let currentRotation = 0
// randomly select a tetro
let random = Math.floor(Math.random()*theTets.length)
console.log("random: ", random)
let current = theTets[random][currentRotation]
console.log("theTets: ", theTets[0][0])


// draw the Tetromino and first rotation
function draw() {
    current.forEach(index => {
        console.log("CurrPos: ", currentPosition)
        console.log("Ind: ", index)
        console.log("squ[curr+ind]: ", squares[currentPosition + index])
        const nextPos = currentPosition + index;
        if (nextPos < squares.length) {
            squares[nextPos].classList.add("tetro");
            squares[nextPos].style.backgroundColor = colors[random];
        }
        // squares[currentPosition + index].classList.add("tetro")
        // squares[currentPosition + index].style.backgroundColor = colors[random]
    })
}

 // Undraw
function undraw() {
    current.forEach(index => {
        squares[currentPosition + index].classList.remove("tetro")
        squares[currentPosition + index].style.backgroundColor = ''
    })
}

// make the tetromino move down every second; invoked when browser loads
// timerId = setInterval(moveDown, 500)

// Variable to store the interval ID for continuous drop
let moveDownInterval;

// Function to start moving down continuously
function startMoveDown() {
    clearInterval(timerId); // Clear the previous timerID
    clearInterval(moveDownInterval);
    moveDownInterval = setInterval(moveDown, 100); 
}

function stopMoveDown() {
    clearInterval(moveDownInterval);
    if (!timerId) {
        timerId = setInterval(moveDown, 500); // Reset the timer
    }
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
        startMoveDown()
    }
}
document.addEventListener('keyup', control)

// Event listener for keydown event
document.addEventListener('keydown', control);

// Attach stopMoveDown function to keyup event to stop movement when key released
document.addEventListener('keyup', (e) => {
    if (e.key === 40) {
        stopMoveDown();
    }
})
// move down function
function moveDown() {
    undraw();
    currentPosition += width;
    console.log("CurrentPosition: ", currentPosition)
    draw();
    freeze();
}

// freeze at bottom
function freeze() {
    if (current.some(index => squares[currentPosition + index + width] === undefined || squares[currentPosition + index + width].classList.contains("taken"))) {

    // if (current.some(index => squares[currentPosition + index + width].classList.contains("taken"))) {
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
}

// Move the tetromino left unless it is at the edge or is blocked
function moveLeft() {
    undraw()
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

    if (!isAtLeftEdge) currentPosition -= 1

    if (current.some(index => squares[currentPosition + index].classList.contains("taken"))) {
        currentPosition += 1
    }
    draw()
}

// Move the tetromino right
function moveRight() {
    undraw()
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)

    if (!isAtRightEdge) currentPosition += 1

    if (current.some(index => squares[currentPosition + index].classList.contains("taken"))) {
        currentPosition -= 1
    }
    draw()
}

// Rotate the tetromino
function rotate() {
    undraw()
    currentRotation++
    if(currentRotation === current.length) { // if rotation goes to 4, go back to 0
        currentRotation =0
    }
    current = theTets[random][currentRotation]
    draw()
}

// Show the up-next tetromino in the mini-grid
const displaySquares = document.querySelectorAll('.mini-grid div')
const displayWidth = 4
const displayIndex = 0


// The Tetros without rotations
const upNextTetro = [
    [1, displayWidth+1, displayWidth*2+1, 2], // jTet
    [1, displayWidth, displayWidth+1, displayWidth+2], // zTet
    [1,displayWidth,displayWidth+1,displayWidth+2], // tTet
    [0, 1, displayWidth, displayWidth+1], // oTet
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] // iTet
]
// Display the next shape in the mini-grid display
function displayShape() {
    //remove any trace of a tetromino form the entire grid
    displaySquares.forEach(square => {
      square.classList.remove('tetro')
      square.style.backgroundColor = ''
    })
    upNextTetro[nextRandom].forEach( index => {
      displaySquares[displayIndex + index].classList.add('tetro')
      displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
    })
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
// Remove the row from the squares array
function removeRow(rowIndex) {
    const removedRow = squares.splice(rowIndex, width);
    // Remove styles
    removedRow.forEach(square => {
        square.classList.remove('taken', 'tetro');
        square.style.backgroundColor = '';
    })
    // Prepend a new row at the beginning of the squares array
    squares = removedRow.concat(squares);
    squares.forEach(cell => grid.appendChild(cell));
}

// Add score
function addScore() {
    for (let i = 0; i < 199; i += width) {
        // Every square that makes a row
        const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9] 
        // If every square in the row is taken
        if(row.every(index => squares[index].classList.contains('taken'))) {
            score += 10; // Add to the score
            scoreDisplay.innerHTML = score;
            removeRow(i);
            // Remove the row
        }
    }
}

// Game over
function gameOver() {
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        scoreDisplay.innerHTML = 'end'
        clearInterval(timerId)
    }
}
}) // Ends the event listener line 1 