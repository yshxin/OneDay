<template>
  <div class="tetris-cute-container">
    <div class="tetris-header">
      <div class="tetris-header-center">
        <h1 class="tetris-title">俄罗斯方块</h1>
      </div>
    </div>
    <div class="tetris-main"> 
      <div class="tetris-board">
        <div
          v-for="(row, y) in displayBoard"
          :key="y"
          class="tetris-row"
        >
          <div
            v-for="(cell, x) in row"
            :key="x"
            :class="['tetris-cell', cell ? 'filled' : '']"
            :style="getCellStyle(cell)"
          ></div>
        </div>
      </div>
      <div class="tetris-info">
        <div>分数：{{ score }}</div>
        <div>下一个：</div>
        <div class="tetris-next">
          <div
            v-for="(row, y) in nextShape"
            :key="y"
            class="tetris-row"
          >
            <div
              v-for="(cell, x) in row"
              :key="x"
              :class="['tetris-cell', cell ? 'filled' : '']"
              :style="getCellStyle(cell)"
            ></div>
          </div>
        </div>
        <div class="tetris-btn-group tetris-btn-group-vertical">
          <button class="cute-btn" @click="startGame" :disabled="started && !paused && !gameOver">开始</button>
          <button class="cute-btn" @click="pauseGame" :disabled="paused || gameOver || !started">暂停</button>
          <button class="cute-btn" @click="resetGame">重新开始</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
function goHome() { router.push('/') }

const ROWS = 20
const COLS = 10
const COLORS = [
  '',
  '#ffb6b9', // I
  '#fcd5ce', // O
  '#b5ead7', // T
  '#c7ceea', // S
  '#ffdac1', // Z
  '#e2f0cb', // J
  '#b5ead7', // L
]
const SHAPES = [
  [],
  [
    [1, 1, 1, 1],
  ],
  [
    [2, 2],
    [2, 2],
  ],
  [
    [0, 3, 0],
    [3, 3, 3],
  ],
  [
    [0, 4, 4],
    [4, 4, 0],
  ],
  [
    [5, 5, 0],
    [0, 5, 5],
  ],
  [
    [6, 0, 0],
    [6, 6, 6],
  ],
  [
    [0, 0, 7],
    [7, 7, 7],
  ],
]

function randomShape() {
  const type = Math.floor(Math.random() * 7) + 1
  return {
    type,
    shape: SHAPES[type].map(row => [...row]),
    x: Math.floor((COLS - SHAPES[type][0].length) / 2),
    y: 0,
  }
}


const board = ref(Array.from({ length: ROWS }, () => Array(COLS).fill(0)))
const current = ref(null)
const next = ref(null)
const score = ref(0)
const interval = ref(null)
const gameOver = ref(false)
const paused = ref(false)
const started = ref(false)

// 计算当前显示的棋盘（包含下落中的方块）
const displayBoard = computed(() => {
  if (!started.value || !current.value) {
    return board.value
  }
  const temp = board.value.map(row => [...row])
  const { shape, x, y } = current.value
  shape.forEach((row, dy) => {
    row.forEach((cell, dx) => {
      if (cell) {
        const ny = y + dy
        const nx = x + dx
        if (ny >= 0 && ny < ROWS && nx >= 0 && nx < COLS) {
          temp[ny][nx] = cell
        }
      }
    })
  })
  return temp
})

function getCellStyle(cell) {
  return cell
    ? {
        background: COLORS[cell],
        borderRadius: '8px',
        border: '2px solid #fff',
        boxShadow: '0 2px 6px #fcd5ce',
      }
    : {}
}

function mergeShapeToBoard(shapeObj, tempBoard = null) {
  const { shape, x, y } = shapeObj
  const b = tempBoard ? tempBoard.map(row => [...row]) : board.value.map(row => [...row])
  shape.forEach((row, dy) => {
    row.forEach((cell, dx) => {
      if (cell && y + dy >= 0 && y + dy < ROWS && x + dx >= 0 && x + dx < COLS) {
        b[y + dy][x + dx] = cell
      }
    })
  })
  return b
}

function isValid(shapeObj) {
  const { shape, x, y } = shapeObj
  for (let dy = 0; dy < shape.length; dy++) {
    for (let dx = 0; dx < shape[0].length; dx++) {
      if (shape[dy][dx]) {
        const nx = x + dx
        const ny = y + dy
        if (
          nx < 0 ||
          nx >= COLS ||
          ny >= ROWS ||
          (ny >= 0 && board.value[ny][nx])
        ) {
          return false
        }
      }
    }
  }
  return true
}

function rotate(shape) {
  const n = shape.length
  const m = shape[0].length
  const newShape = Array.from({ length: m }, () => Array(n).fill(0))
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < m; x++) {
      newShape[x][n - 1 - y] = shape[y][x]
    }
  }
  return newShape
}

function drop() {
  if (gameOver.value || paused.value || !started.value) return
  const nextPos = { ...current.value, y: current.value.y + 1 }
  if (isValid(nextPos)) {
    current.value.y++
  } else {
    // 固定到棋盘
    board.value = mergeShapeToBoard(current.value)
    clearLines()
    spawnNext()
    if (!isValid(current.value)) {
      gameOver.value = true
      clearInterval(interval.value)
      alert('游戏结束！')
    }
  }
}

function move(dx) {
  if (gameOver.value) return
  const nextPos = { ...current.value, x: current.value.x + dx }
  if (isValid(nextPos)) {
    current.value.x += dx
  }
}

function rotateCurrent() {
  if (gameOver.value) return
  const rotated = rotate(current.value.shape)
  const nextPos = { ...current.value, shape: rotated }
  if (isValid(nextPos)) {
    current.value.shape = rotated
  }
}

function hardDrop() {
  if (gameOver.value) return
  while (isValid({ ...current.value, y: current.value.y + 1 })) {
    current.value.y++
  }
  drop()
}

function clearLines() {
  let lines = 0
  board.value = board.value.filter(row => {
    if (row.every(cell => cell)) {
      lines++
      return false
    }
    return true
  })
  while (board.value.length < ROWS) {
    board.value.unshift(Array(COLS).fill(0))
  }
  if (lines) score.value += lines * 100
}

function spawnNext() {
  current.value = {
    ...next.value,
    shape: next.value.shape.map(row => [...row]),
    x: Math.floor((COLS - next.value.shape[0].length) / 2),
    y: 0,
  }
  next.value = randomShape()
}

function resetGame() {
  started.value = false
  board.value = Array.from({ length: ROWS }, () => Array(COLS).fill(0))
  current.value = null
  next.value = null
  score.value = 0
  gameOver.value = false
  paused.value = false
  clearInterval(interval.value)
}

function startGame() {
  if (interval.value) clearInterval(interval.value)
  if (gameOver.value) return
  if (!started.value) {
    started.value = true
    board.value = Array.from({ length: ROWS }, () => Array(COLS).fill(0))
    current.value = randomShape()
    next.value = randomShape()
    score.value = 0
    gameOver.value = false
    paused.value = false
  }
  paused.value = false
  interval.value = setInterval(drop, 500)
}

function pauseGame() {
  paused.value = true
  clearInterval(interval.value)
}

function handleKey(e) {
  if (gameOver.value || paused.value || !started.value) return
  if (e.key === 'ArrowLeft') move(-1)
  else if (e.key === 'ArrowRight') move(1)
  else if (e.key === 'ArrowDown') drop()
  else if (e.key === 'ArrowUp') rotateCurrent()
  else if (e.key === ' ') hardDrop()
}

onMounted(() => {
  window.addEventListener('keydown', handleKey)
})
onUnmounted(() => {
  window.removeEventListener('keydown', handleKey)
  clearInterval(interval.value)
})

const nextShape = computed(() => {
  if (!started.value || !next.value) return []
  return next.value.shape
})
</script>

<style scoped>
.tetris-cute-container {
  max-width: 700px;
  margin: 32px auto;
  background: #fff6f6;
  border-radius: 32px;
  box-shadow: 0 8px 32px #ffe0e0;
  padding: 32px 24px 24px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Comic Sans MS', 'Chalkboard SE', 'PingFang SC', sans-serif;
}
.tetris-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  position: relative;
}
.tetris-header-center {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.back-btn {
  position: static;
  margin-right: 12px;
}

.back-btn {
  position: fixed;
  top: 24px;
  left: 24px;
  z-index: 100;
  background: linear-gradient(90deg, #ffb3c6 0%, #b5eaff 100%);
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 38px;
  height: 38px;
  font-size: 1.3em;
  box-shadow: 0 2px 8px #f7b5d655;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, transform 0.18s;
  outline: none;
}
.back-btn:hover {
  background: linear-gradient(90deg, #b5eaff 0%, #ffb3c6 100%);
  transform: scale(1.12);
}
.back-btn:active {
  background: linear-gradient(90deg, #ffb86b 0%, #ffb3c6 100%);
  transform: scale(0.96);
}
.tetris-logo {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #ffe0e0;
  box-shadow: 0 2px 8px #fcd5ce;
  transition: transform 0.2s;
}
.tetris-logo:hover {
  transform: rotate(-10deg) scale(1.1);
}
.tetris-title {
  font-size: 2.1rem;
  color: #ff69b4;
  font-family: 'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', cursive;
  font-weight: bold;
  letter-spacing: 2px;
  margin-right: 12px;
}
.back-btn {
  position: absolute;
  top: 18px;
  left: 18px;
  z-index: 10;
  background: linear-gradient(90deg, #ffb3c6 0%, #b5eaff 100%);
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 38px;
  height: 38px;
  font-size: 1.3em;
  box-shadow: 0 2px 8px #f7b5d655;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, transform 0.18s;
  outline: none;
}
.back-btn:hover {
  background: linear-gradient(90deg, #b5eaff 0%, #ffb3c6 100%);
  transform: scale(1.12);
}
.back-btn:active {
  background: linear-gradient(90deg, #ffb86b 0%, #ffb3c6 100%);
  transform: scale(0.96);
}
.tetris-btn-group {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 18px;
  margin-bottom: 8px;
  justify-content: center;
}
.tetris-btn-group-vertical {
  flex-direction: column;
  align-items: stretch;
  gap: 18px;
}
.tetris-main {
  display: flex;
  gap: 32px;
}
.tetris-board {
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px #fcd5ce;
  padding: 12px;
}
.tetris-row {
  display: flex;
}
.tetris-cell {
  width: 28px;
  height: 28px;
  margin: 2px;
  background: #f8f8f8;
  border-radius: 8px;
  border: 1.5px solid #ffe0e0;
  transition: background 0.2s, transform 0.1s;
}
.tetris-cell.filled {
  animation: pop 0.2s;
  transform: scale(1.08) rotate(-2deg);
}
@keyframes pop {
  0% { transform: scale(0.7); }
  100% { transform: scale(1.08) rotate(-2deg); }
}
.tetris-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  background: #fff0f6;
  border-radius: 16px;
  padding: 16px 24px;
  min-width: 120px;
  box-shadow: 0 2px 8px #fcd5ce;
}
.tetris-info-center {
  align-items: center;
  justify-content: center;
  min-height: 320px;
  background: #fff0f6;
  border-radius: 16px;
  box-shadow: 0 2px 8px #fcd5ce;
  margin: 32px auto 0 auto;
  padding: 32px 24px 24px 24px;
  display: flex;
  flex-direction: column;
}
.tetris-next {
  margin-top: 8px;
  background: #fff;
  border-radius: 8px;
  padding: 8px;
  box-shadow: 0 1px 4px #fcd5ce;
}
.cute-btn {
  background: linear-gradient(90deg, #ffb6b9 0%, #fcd5ce 100%);
  color: #fff;
  border: none;
  border-radius: 16px;
  padding: 8px 24px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 2px 8px #fcd5ce;
  transition: background 0.2s, transform 0.1s;
  width: 100%;
  min-width: 120px;
  box-sizing: border-box;
}
.cute-btn:hover {
  background: linear-gradient(90deg, #fcd5ce 0%, #ffb6b9 100%);
  transform: scale(1.08) rotate(-2deg);
}
.tetris-tip {
  margin-top: 18px;
  color: #ffb6b9;
  font-size: 15px;
  text-align: center;
  letter-spacing: 1px;
}
.back-btn {
  position: absolute;
  top: 18px;
  left: 18px;
  z-index: 10;
  background: linear-gradient(90deg, #ffb3c6 0%, #b5eaff 100%);
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 38px;
  height: 38px;
  font-size: 1.3em;
  box-shadow: 0 2px 8px #f7b5d655;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, transform 0.18s;
  outline: none;
}
.back-btn:hover {
  background: linear-gradient(90deg, #b5eaff 0%, #ffb3c6 100%);
  transform: scale(1.12);
}
.back-btn:active {
  background: linear-gradient(90deg, #ffb86b 0%, #ffb3c6 100%);
  transform: scale(0.96);
}
</style>
