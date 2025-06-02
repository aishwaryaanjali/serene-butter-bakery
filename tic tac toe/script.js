const board = document.getElementById('board');
const statusText = document.getElementById('status');
let cells, current, gameOver, mode;

function startGame(m) {
  mode = m;
  current = 'X';
  gameOver = false;
  cells = Array(9).fill(null);
  board.innerHTML = '';
  statusText.textContent = getTurnText();

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.addEventListener('click', () => play(i, cell));
    board.appendChild(cell);
  }
}

function play(i, cell) {
  if (cells[i] || gameOver) return;
  cells[i] = current;
  cell.textContent = current;

  const win = checkWin();
  if (win) return finish(win);

  current = current === 'X' ? 'O' : 'X';
  statusText.textContent = getTurnText();

  if (mode === 'computer' && current === 'O') {
    setTimeout(() => {
      const empty = cells.map((v, i) => v ? null : i).filter(i => i !== null);
      const rand = empty[Math.floor(Math.random() * empty.length)];
      play(rand, board.children[rand]);
    }, 300);
  }
}

function getTurnText() {
  if (mode === 'computer') {
    return current === 'X' ? "Your turn" : "Computer's turn";
  } else {
    return current === 'X' ? "Player 1 turn" : "Player 2 turn";
  }
}

function checkWin() {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (let [a, b, c] of lines) {
    if (cells[a] && cells[a] === cells[b] && cells[b] === cells[c])
      return { win: cells[a], line: [a, b, c] };
  }
  return cells.includes(null) ? null : { win: 'Draw', line: [] };
}

function finish(res) {
  gameOver = true;
  for (let i = 0; i < 9; i++) {
    const cell = board.children[i];
    if (res.win === 'Draw') cell.classList.add('lose');
    else if (res.line.includes(i)) cell.classList.add('win');
    else cell.classList.add('lose');
  }

  if (res.win === 'Draw') {
    statusText.textContent = "It's a Draw!";
  } else {
    if (mode === 'computer') {
      statusText.textContent = res.win === 'X' ? "You won!" : "Computer won!";
    } else {
      statusText.textContent = res.win === 'X' ? "Player 1 won!" : "Player 2 won!";
    }
  }
}
