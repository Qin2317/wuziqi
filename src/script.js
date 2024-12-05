// 获取canvas元素、重新开始按钮以及游戏提示信息div元素
const canvas = document.getElementById("chessboard");
const ctx = canvas.getContext("2d");
const restartBtn = document.getElementById("restartBtn");
const messageDiv = document.getElementById("message");

// 棋盘的行列数
const ROWS = 15;
const COLS = 15;
// 每个格子的大小
const CELL_SIZE = canvas.width / ROWS;

// 二维数组来记录棋盘状态，0表示空，1表示黑子，2表示白子
let chessboard = new Array(ROWS).fill(0).map(() => new Array(COLS).fill(0));

// 当前轮到的玩家，1表示黑子，2表示白子，初始为黑子
let currentPlayer = 1;

// 绘制棋盘
function drawBoard() {
  for (let i = 0; i < ROWS; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * CELL_SIZE);
    ctx.lineTo(canvas.width, i * CELL_SIZE);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(i * CELL_SIZE, 0);
    ctx.lineTo(i * CELL_SIZE, canvas.height);
    ctx.stroke();
  }
}

// 绘制棋子
function drawChess(x, y, color) {
  ctx.beginPath();
  ctx.arc(
    x * CELL_SIZE + CELL_SIZE / 2,
    y * CELL_SIZE + CELL_SIZE / 2,
    CELL_SIZE / 2 - 5,
    0,
    2 * Math.PI
  );
  ctx.fillStyle = color;
  ctx.fill();
}

// 判断是否五子连珠（横向检查）
function checkRow(x, y, player) {
  let count = 0;
  for (let col = Math.max(0, y - 4); col <= Math.min(COLS - 1, y + 4); col++) {
    if (chessboard[x][col] === player) {
      count++;
      if (count === 5) return true;
    } else {
      count = 0;
    }
  }
  return false;
}

// 判断是否五子连珠（纵向检查）
function checkCol(x, y, player) {
  let count = 0;
  for (let row = Math.max(0, x - 4); row <= Math.min(ROWS - 1, x + 4); row++) {
    if (chessboard[row][y] === player) {
      count++;
      if (count === 5) return true;
    } else {
      count = 0;
    }
  }
  return false;
}

// 判断是否五子连珠（正斜线检查）
function checkDiagonal1(x, y, player) {
  let count = 0;
  for (let offset = -4; offset <= 4; offset++) {
    let row = x + offset;
    let col = y + offset;
    if (
      row >= 0 &&
      row < ROWS &&
      col >= 0 &&
      col < COLS &&
      chessboard[row][col] === player
    ) {
      count++;
      if (count === 5) return true;
    } else {
      count = 0;
    }
  }
  return false;
}

// 判断是否五子连珠（反斜线检查）
function checkDiagonal2(x, y, player) {
  let count = 0;
  for (let offset = -4; offset <= 4; offset++) {
    let row = x + offset;
    let col = y - offset;
    if (
      row >= 0 &&
      row < ROWS &&
      col >= 0 &&
      col < COLS &&
      chessboard[row][col] === player
    ) {
      count++;
      if (count === 5) return true;
    } else {
      count = 0;
    }
  }
  return false;
}

// 检查是否获胜
function checkWin(x, y, player) {
  return (
    checkRow(x, y, player) ||
    checkCol(x, y, player) ||
    checkDiagonal1(x, y, player) ||
    checkDiagonal2(x, y, player)
  );
}

// 鼠标点击事件处理函数
function handleClick(event) {
  let x = Math.floor(event.offsetX / CELL_SIZE);
  let y = Math.floor(event.offsetY / CELL_SIZE);
  if (chessboard[x][y] === 0) {
    // 根据当前轮到的玩家绘制棋子并更新棋盘状态
    let color = currentPlayer === 1 ? "black" : "white";
    drawChess(x, y, color);
    chessboard[x][y] = currentPlayer;
    if (checkWin(x, y, currentPlayer)) {
      messageDiv.textContent =
        currentPlayer === 1 ? "黑子获胜！" : "白子获胜！";
      canvas.removeEventListener("click", handleClick);
    } else {
      // 切换当前轮到的玩家
      currentPlayer = currentPlayer === 1 ? 2 : 1;
      messageDiv.textContent =
        currentPlayer === 1 ? "轮到黑子下棋" : "轮到白子下棋";
    }
  }
}

// 重新开始按钮点击事件处理函数
function restartGame() {
  // 清空棋盘
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // 重置棋盘状态数组
  chessboard = new Array(ROWS).fill(0).map(() => new Array(COLS).fill(0));
  // 重置当前轮到的玩家为黑子
  currentPlayer = 1;
  // 重新绘制棋盘
  drawBoard();
  messageDiv.textContent = "轮到黑子下棋";
  // 重新添加点击事件，使游戏可以继续进行
  canvas.addEventListener("click", handleClick);
}

canvas.addEventListener("click", handleClick);
restartBtn.addEventListener("click", restartGame);
messageDiv.textContent = "轮到黑子下棋";

// 初始化，绘制棋盘
drawBoard();
