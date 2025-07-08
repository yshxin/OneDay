<template>
  <div class="calc-container">
    <button class="back-btn" @click="goHome" title="返回首页">⟵</button>
    <h1 class="calc-title">计算器</h1>
    <div class="calc-formula" v-if="formula">{{ formula }}</div>
    <div class="calc-screen">{{ display }}</div>
    <div class="calc-btns">
      <button v-for="btn in btns" :key="btn.text" :class="['calc-btn', btn.type, btn.active ? 'active' : '']" @click="onBtn(btn.text)">{{ btn.text }}</button>
    </div>
    <!-- 清除和重置按钮已移除 -->
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
function goHome() { router.push('/') }

const display = ref('0')
const formula = ref('')
let first = null
let op = null
let waiting = false
let lastIsEqual = false
const btns = [
  { text: '7' }, { text: '8' }, { text: '9' }, { text: '÷', type: 'op' },
  { text: '4' }, { text: '5' }, { text: '6' }, { text: '×', type: 'op' },
  { text: '1' }, { text: '2' }, { text: '3' }, { text: '-', type: 'op' },
  { text: '0' }, { text: 'C', type: 'util' }, { text: '=', type: 'eq' }, { text: '+', type: 'op' },
]
function onBtn(t, fromKey) {
  // 按钮动画
  if (!fromKey) animateBtn(t)
  if ('0123456789'.includes(t)) {
    if (waiting || display.value === '0' || lastIsEqual) {
      display.value = t
      waiting = false
      if (lastIsEqual) {
        formula.value = ''
        lastIsEqual = false
      }
    } else {
      display.value += t
    }
    animateScreen()
  } else if ('+−-×÷/'.includes(t)) {
    if (lastIsEqual) {
      formula.value = display.value
      lastIsEqual = false
    }
    if (first !== null && !waiting) {
      calc()
      formula.value = display.value
    } else {
      first = parseFloat(display.value)
      formula.value = display.value
    }
    op = t
    formula.value += t === '−' ? '-' : t
    waiting = true
    animateScreen()
  } else if (t === '=') {
    if (op) {
      formula.value += display.value + '='
      calc()
      formula.value += display.value
    }
    op = null
    lastIsEqual = true
    animateScreen()
  } else if (t === 'C') {
    display.value = '0'
    first = null
    op = null
    waiting = false
    formula.value = ''
    lastIsEqual = false
    animateScreen()
  }
}
function calc() {
  let second = parseFloat(display.value)
  let result = first
  switch (op) {
    case '+': result = first + second; break
    case '-':
    case '−': result = first - second; break
    case '×': result = first * second; break
    case '÷':
    case '/': result = second === 0 ? '喵？除零啦' : first / second; break
  }
  display.value = String(result)
  first = result === '喵？除零啦' ? null : result
  waiting = true
}
function clearAll() {
  display.value = '0'
  waiting = false
  animateScreen()
}
function resetAll() {
  display.value = '0'
  first = null
  op = null
  waiting = false
  animateScreen()
}
function animateBtn(t) {
  const idx = btns.findIndex(b => b.text === t)
  if (idx !== -1) {
    btns[idx].active = true
    setTimeout(() => { btns[idx].active = false }, 180)
  }
}
function animateScreen() {
  const el = document.querySelector('.calc-screen')
  if (el) {
    el.classList.remove('glass-anim')
    void el.offsetWidth // 强制重绘
    el.classList.add('glass-anim')
    setTimeout(() => el.classList.remove('glass-anim'), 220)
  }
}
function handleKey(e) {
  let key = e.key
  if (key === 'Enter') key = '='
  if (key === 'Escape') key = 'C'
  if (key === 'Backspace') { clearAll(); animateBtn('C'); return }
  if ('0123456789'.includes(key)) onBtn(key, true), animateBtn(key)
  if (['+', '-', '*', '/', '×', '÷'].includes(key)) {
    let t = key
    if (t === '*') t = '×'
    if (t === '/') t = '÷'
    onBtn(t, true); animateBtn(t)
  }
  if (key === '=' || key === 'Enter') onBtn('=', true), animateBtn('=')
  if (key.toLowerCase() === 'c') onBtn('C', true), animateBtn('C')
}
onMounted(() => {
  window.addEventListener('keydown', handleKey)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKey)
})
</script>

<style scoped>
/* 居中且左右留白，移动端更舒适 */
.calc-container {
  width: 100%;
  max-width: 370px;
  margin: 40px auto 0 auto;
  background: rgba(255,248,252,0.92);
  border-radius: 28px;
  box-shadow: 0 8px 32px #f7b5d6cc, 0 1.5px 0 #ffe6f0 inset;
  border: 3px dashed #ffb3c6;
  padding: 32px 24px 24px 24px;
  position: relative;
  min-height: 480px;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: popin 1.2s cubic-bezier(.68,-0.55,.27,1.55);
  box-sizing: border-box;
}
.calc-title {
  color: #ff7eb9;
  font-size: 2em;
  margin-bottom: 18px;
  font-family: 'ZCOOL KuaiLe', 'Comic Sans MS', '微软雅黑', cursive, sans-serif;
  text-shadow: 0 2px 8px #fff0fa, 0 1px 0 #fff;
  letter-spacing: 2px;
  animation: rainbowText 4s linear infinite alternate;
}
/* 公式显示样式 */
.calc-formula {
  width: 100%;
  min-height: 1.2em;
  color: #bfa2e6;
  font-size: 1.1em;
  text-align: right;
  padding: 0 1em 0.1em 1em;
  font-family: 'Consolas', 'Comic Sans MS', '微软雅黑', cursive, monospace;
  opacity: 0.85;
  user-select: all;
  word-break: break-all;
}
.calc-screen {
  width: 100%;
  min-height: 48px;
  background: linear-gradient(120deg, #fff0f7 60%, #e0f7fa 100%);
  border-radius: 16px;
  margin-bottom: 18px;
  font-size: 2em;
  color: #7a5cfa;
  text-align: right;
  padding: 0.5em 1em;
  box-shadow: 0 2px 8px #ffe0f3, 0 8px 32px #b5eaff22 inset;
  letter-spacing: 1px;
  user-select: all;
  font-family: 'Consolas', 'Comic Sans MS', '微软雅黑', cursive, monospace;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(2.5px) saturate(1.1);
}
.calc-screen::before {
  content: '';
  position: absolute;
  left: 10%;
  top: 0;
  width: 80%;
  height: 60%;
  background: linear-gradient(120deg, #fff8, #fff2 60%, #fff0 100%);
  border-radius: 40% 60% 50% 70%/60% 40% 60% 50%;
  pointer-events: none;
  filter: blur(2px);
  opacity: 0.45;
  z-index: 1;
}
.glass-anim {
  animation: glassPop 0.22s cubic-bezier(.68,-0.55,.27,1.55);
}
@keyframes glassPop {
  0% { box-shadow: 0 2px 8px #ffe0f3, 0 0px 0 #b5eaff22 inset; }
  60% { box-shadow: 0 6px 24px #ffe0f3, 0 16px 48px #b5eaff55 inset; }
  100% { box-shadow: 0 2px 8px #ffe0f3, 0 8px 32px #b5eaff22 inset; }
}
.calc-btn.active {
  animation: btnPop 0.18s cubic-bezier(.68,-0.55,.27,1.55);
}
@keyframes btnPop {
  0% { transform: scale(1) rotate(0); }
  60% { transform: scale(1.13) rotate(-6deg); }
  100% { transform: scale(1) rotate(0); }
}
.calc-ops {
  display: flex;
  gap: 1.2em;
  margin-top: 1.2em;
  justify-content: center;
}
.calc-btns {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  width: 100%;
}
.calc-btn {
  background: linear-gradient(90deg, #ffb3c6 0%, #b5eaff 100%);
  color: #fff;
  border: none;
  border-radius: 16px;
  font-size: 1.3em;
  padding: 0.7em 0;
  box-shadow: 0 2px 8px #f7b5d655;
  cursor: pointer;
  transition: background 0.18s, transform 0.15s;
  font-family: inherit;
  will-change: transform, box-shadow;
  outline: none;
}
.calc-btn.op {
  background: linear-gradient(90deg, #b5eaff 0%, #ffb3c6 100%);
  color: #ff7eb9;
}
.calc-btn.eq {
  background: linear-gradient(90deg, #ffb86b 0%, #ffb3c6 100%);
  color: #fff;
}
.calc-btn.util {
  background: linear-gradient(90deg, #ffe0f3 0%, #b5eaff 100%);
  color: #7a5cfa;
}
.calc-btn:hover {
  transform: scale(1.08) rotate(-3deg);
  box-shadow: 0 8px 24px #ffd6e6, 0 0 0 4px #ffe0f3;
  filter: brightness(1.08);
}
.calc-btn:active {
  transform: scale(0.97);
  filter: brightness(0.97);
}
.back-btn {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 10;
  background: linear-gradient(90deg, #ffb3c6 0%, #b5eaff 100%);
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
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
  transform: scale(1.12) rotate(-8deg);
}
.back-btn:active {
  background: linear-gradient(90deg, #ffb86b 0%, #ffb3c6 100%);
  transform: scale(0.96);
}
@keyframes popin {
  0% { transform: scale(0.7); opacity: 0; }
  80% { transform: scale(1.08); opacity: 1; }
  100% { transform: scale(1); }
}
@keyframes rainbowText {
  0% { color: #ff7eb9; }
  25% { color: #7a5cfa; }
  50% { color: #ffb3c6; }
  75% { color: #ffb86b; }
  100% { color: #ff7eb9; }
}
@media (max-width: 500px) {
  .calc-container {
    width: calc(100vw - 24px);
    max-width: 98vw;
    min-height: 90vh;
    border-radius: 14px;
    padding: 18px 8px 12px 8px;
    margin: 10px auto 0 auto;
    box-sizing: border-box;
  }
  .calc-title {
    font-size: 1.2em;
  }
  .calc-screen {
    font-size: 1.2em;
    min-height: 36px;
    padding: 0.3em 0.7em;
  }
  .calc-btn {
    font-size: 1em;
    border-radius: 12px;
    padding: 0.5em 0;
  }
}
</style>
