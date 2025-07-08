<template>
  <div class="container">
    <button class="back-btn" @click="goHome" title="返回首页">⟵</button>
    <div class="pet" :title="'喵~今天也要加油哦！'"></div>
    <h1 id="mainTitle">要和猫猫捡金币吗？</h1>
    <form id="incomeForm" style="margin-bottom: 10px;" @submit.prevent="onSubmit">
      <div style="margin-bottom: 18px;">
        <label for="hours">工作小时/天</label>
        <input type="number" id="hours" v-model.number="hours" min="1" max="24" step="0.1" required>
      </div>
      <div style="margin-bottom: 18px;">
        <label for="salary">日工资(元)</label>
        <input type="number" id="salary" v-model.number="salary" min="1" step="0.01" required>
      </div>
      <button class="btn" type="submit">开始捡金币啦～</button>
    </form>
    <div class="income" v-show="showIncome" style="font-size:2em;margin-top:10px;">{{ incomeText }}</div>
    <div class="total" v-show="showIncome" style="font-size:1.5em;">{{ totalText }}</div>
    <div style="margin-top:16px;">
      <button class="btn" v-show="showPause" @click="onPause" style="background:linear-gradient(90deg,#7a5cfa 0%,#ffb3c6 100%);margin-right:10px;">休息会</button>
      <button class="btn" v-show="showResume" @click="onResume" style="background:linear-gradient(90deg,#ffb3c6 0%,#7a5cfa 100%);margin-right:10px;">继续</button>
      <button class="btn" v-show="showEnd" @click="onEnd" style="background:linear-gradient(90deg,#ffb86b 0%,#ffb3c6 100%);">结束</button>
    </div>
    <div class="bubble" ref="bubbleRef" style="display:none;position:absolute;left:50%;top:30px;transform:translateX(-50%);z-index:2;"></div>
    <div class="frosted-footer"></div>
  </div>
</template>

// ...existing code...
<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
function goHome() {
  router.push('/')
}
import { ref, onMounted } from 'vue'

const hours = ref(0)
const salary = ref(0)
const total = ref(0)
const running = ref(false)
const showIncome = ref(false)
const showPause = ref(false)
const showResume = ref(false)
const showEnd = ref(false)
const incomeText = ref('')
const totalText = ref('')
const bubbleRef = ref(null)
let timer = null
let incomePerSecond = 0
let bubbleCooldown = 0
let cardTarget = {rx: 0, ry: 0, s: 1, sx: 0, sy: 0}
let cardCurrent = {rx: 0, ry: 0, s: 1, sx: 0, sy: 0}
let cardRAF = null

const finishTexts = [
  '今天的努力都值得被肯定！',
  '你已经很棒啦，记得休息哦~',
  '小猫为你鼓掌喵！',
  '每一份坚持都很珍贵！',
  '收工啦，奖励自己一下吧！',
  '你是最棒的打工人！',
  '明天也要元气满满！',
  '加油，梦想在前方等你！'
]
const bubbleTexts = [
//   '加油！每一秒都很重要~',
//   '喵~你真棒！',
//   '休息一下也很重要哦~',
//   '今天也要元气满满！',
//   '小猫陪你一起努力！',
//   '存钱买喜欢的东西吧！',
//   '要记得喝水哦~',
  '工资+1！',
//   '梦想在前方，冲鸭！'
]

function animateNumber(dom, from, to, duration = 400) {
  dom.style.transition = 'transform 0.3s cubic-bezier(.68,-0.55,.27,1.55)';
  dom.style.transform = 'scale(1.18)';
  setTimeout(() => { dom.style.transform = 'scale(1)'; }, 300);
  const start = Date.now();
  function update() {
    const now = Date.now();
    const progress = Math.min((now - start) / duration, 1);
    const value = from + (to - from) * progress;
    dom.textContent = `累计收入：${value.toFixed(2)} 元`;
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      dom.textContent = `累计收入：${to.toFixed(2)} 元`;
    }
  }
  update();
}

function showBubble(text) {
  const bubble = bubbleRef.value
  if (!bubble) return
  bubble.textContent = text
  bubble.style.display = 'block'
  bubble.style.opacity = '0'
  bubble.style.transition = 'opacity 0.5s'
  setTimeout(() => { bubble.style.opacity = '1' }, 10)
  setTimeout(() => {
    bubble.style.opacity = '0'
    setTimeout(() => {
      bubble.style.display = 'none'
      bubble.style.transition = ''
    }, 700)
  }, 2200)
}

function petWiggle() {
  const pet = document.querySelector('.pet')
  if (!pet) return
  pet.animate([
    { transform: 'rotate(0deg)' },
    { transform: 'rotate(-10deg)' },
    { transform: 'rotate(10deg)' },
    { transform: 'rotate(0deg)' }
  ], {
    duration: 400,
    iterations: 1
  })
}

function renderCard() {
  const card = document.querySelector('.container')
  if (!card) return
  cardCurrent.rx += (cardTarget.rx - cardCurrent.rx) * 0.13;
  cardCurrent.ry += (cardTarget.ry - cardCurrent.ry) * 0.13;
  cardCurrent.s  += (cardTarget.s  - cardCurrent.s)  * 0.13;
  cardCurrent.sx += (cardTarget.sx - cardCurrent.sx) * 0.13;
  cardCurrent.sy += (cardTarget.sy - cardCurrent.sy) * 0.13;
  card.style.transform = `perspective(900px) rotateX(${cardCurrent.rx}deg) rotateY(${cardCurrent.ry}deg) scale(${cardCurrent.s})`;
  // 立体高光与阴影
  const highlightX = cardCurrent.ry * 2;
  const highlightY = -cardCurrent.rx * 2;
  card.style.boxShadow = `0 8px 32px #f7b5d6cc, 0 1.5px 0 #ffe6f0 inset, ${highlightX}px ${16+highlightY}px 32px 0 #fff6, ${-highlightX}px ${-highlightY}px 24px 0 #ffb3c655`;
  if (Math.abs(cardCurrent.rx-cardTarget.rx)>0.1 || Math.abs(cardCurrent.ry-cardTarget.ry)>0.1 || Math.abs(cardCurrent.s-cardTarget.s)>0.01) {
    cardRAF = requestAnimationFrame(renderCard);
  } else {
    cardRAF = null;
  }
}

function saveToLocal(btnState = 'form') {
  localStorage.setItem('incomePetData', JSON.stringify({
    hours: hours.value,
    salary: salary.value,
    total: total.value,
    btnState
  }))
}

function restoreFromLocal() {
  const saved = localStorage.getItem('incomePetData')
  if (saved) {
    const data = JSON.parse(saved)
    hours.value = data.hours || 0
    salary.value = data.salary || 0
    total.value = data.total || 0
    // 恢复按钮状态
    const btnState = data.btnState || 'form'
    document.getElementById('hours').value = hours.value || ''
    document.getElementById('salary').value = salary.value || ''
    if (btnState === 'running') {
      showResult(true)
    } else if (btnState === 'paused') {
      document.getElementById('mainTitle').textContent = '休息会，继续加油！'
      document.getElementById('incomeForm').style.display = 'block'
      showPause.value = false
      showResume.value = true
      showEnd.value = true
      showIncome.value = true
      incomeText.value = `每秒收入：${(salary.value/(hours.value*3600)).toFixed(6)} 元/秒`
      totalText.value = `累计收入：${total.value.toFixed(2)} 元`
    } else {
      // 默认表单状态
      document.getElementById('incomeForm').style.display = 'block'
      showPause.value = false
      showResume.value = false
      showEnd.value = false
      showIncome.value = false
    }
  }
}

function showResult(isResume = false) {
  document.getElementById('mainTitle').textContent = '捡金币中...'
  incomePerSecond = salary.value / (hours.value * 3600)
  showIncome.value = true
  showPause.value = true
  showResume.value = false
  showEnd.value = true
  incomeText.value = `每秒收入：${incomePerSecond.toFixed(6)} 元/秒`
  totalText.value = `累计收入：${total.value.toFixed(2)} 元`
  document.getElementById('incomeForm').style.display = 'none'
  running.value = true
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  if (!isResume) total.value = 0
  bubbleCooldown = 0
  saveToLocal('running')
  timer = setInterval(() => {
    if (!running.value) return
    const prev = total.value
    total.value += incomePerSecond
    animateNumber(document.querySelector('.total'), prev, total.value)
    petWiggle()
    if (bubbleCooldown <= 0 && Math.random() < 0.18) {
      const text = bubbleTexts[Math.floor(Math.random() * bubbleTexts.length)]
      showBubble(text)
      bubbleCooldown = 4
    } else if (bubbleCooldown > 0) {
      bubbleCooldown--
    }
    saveToLocal('running')
  }, 1000)
}

function onSubmit() {
  if (hours.value <= 0 || salary.value <= 0) {
    alert('请输入有效的工作时间和工资！')
    return
  }
  total.value = 0
  showResult()
}

function onPause() {
  document.getElementById('mainTitle').textContent = '休息会，继续加油！'
  running.value = false
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  showPause.value = false
  showResume.value = true
  showEnd.value = true
  document.getElementById('incomeForm').style.display = 'block'
  document.getElementById('hours').value = hours.value
  document.getElementById('salary').value = salary.value
  saveToLocal('paused')
}

function onEnd() {
  running.value = false
  showPause.value = false
  showResume.value = false
  showEnd.value = false
  showIncome.value = true
  incomeText.value = '今日累计收入：'
  totalText.value = `${total.value.toFixed(2)} 元`
  document.getElementById('mainTitle').textContent = '要和猫猫捡金币吗？'
  showBubble(finishTexts[Math.floor(Math.random() * finishTexts.length)])
  saveToLocal('form')
  setTimeout(()=>{
    document.getElementById('incomeForm').style.display = 'block'
  }, 2000)
}

function onResume() {
  document.getElementById('mainTitle').textContent = '和猫猫捡金币啦～'
  document.getElementById('incomeForm').style.display = 'none'
  showPause.value = true
  showResume.value = false
  running.value = true
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  timer = setInterval(() => {
    if (!running.value) return
    const prev = total.value
    total.value += incomePerSecond
    animateNumber(document.querySelector('.total'), prev, total.value)
    petWiggle()
    if (bubbleCooldown <= 0 && Math.random() < 0.18) {
      const text = bubbleTexts[Math.floor(Math.random() * bubbleTexts.length)]
      showBubble(text)
      bubbleCooldown = 4
    } else if (bubbleCooldown > 0) {
      bubbleCooldown--
    }
    saveToLocal('running')
  }, 1000)
  saveToLocal('running')
}

onMounted(() => {
  // 动态渐变动画
  let angle = 120
  let t = 0
  function step() {
    angle += 0.06
    t += 0.008
    document.body.style.setProperty('--bg-angle', angle + 'deg')
    document.body.style.setProperty('--bg-x', (80 + Math.sin(t) * 18) + '%')
    document.body.style.setProperty('--bg-y', (20 + Math.cos(t/1.5) * 18) + '%')
    requestAnimationFrame(step)
  }
  step()

  // 卡片3D跟随动效
  const card = document.querySelector('.container')
  if (card) {
    card.addEventListener('mousemove', function(e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const w = rect.width;
      const h = rect.height;
      const rx = -(y - h/2) / (h/2) * 12;
      const ry =  (x - w/2) / (w/2) * 12;
      cardTarget.rx = rx;
      cardTarget.ry = ry;
      cardTarget.s = 0.985;
      if (!cardRAF) cardRAF = requestAnimationFrame(renderCard);
    });
    card.addEventListener('mouseleave', function() {
      cardTarget.rx = 0;
      cardTarget.ry = 0;
      cardTarget.s = 1;
      if (!cardRAF) cardRAF = requestAnimationFrame(renderCard);
    });
  }

  // 恢复本地数据
  restoreFromLocal()
})
</script>

<style scoped>
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
  font-size: 1.5em;
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
.container {
  background: rgba(255, 248, 252, 0.85);
  backdrop-filter: blur(10px) saturate(1.2);
  border-radius: 32px;
  box-shadow: 0 8px 32px #f7b5d6cc, 0 1.5px 0 #ffe6f0 inset;
  padding: 48px 36px 38px 36px;
  margin-top: 70px;
  text-align: center;
  width: 370px;
  position: relative;
  overflow: visible;
  border: 3px dashed #ffb3c6;
  transition: box-shadow 0.4s cubic-bezier(.22,1,.36,1), transform 0.35s cubic-bezier(.22,1,.36,1);
  animation: popin 1.5s cubic-bezier(.68,-0.55,.27,1.55);
  will-change: transform, box-shadow;
}
@keyframes popin {
  0% { transform: scale(0.7); opacity: 0; }
  80% { transform: scale(1.08); opacity: 1; }
  100% { transform: scale(1); }
}
.pet {
  width: 110px;
  height: 110px;
  margin: 0 auto 12px auto;
  background: url('https://img.icons8.com/clouds/2x/cat.png') no-repeat center/contain;
  border-radius: 50%;
  box-shadow: 0 4px 16px #ffb3c655, 0 0 0 8px #ffe6f0;
  animation: bounce 3.2s infinite, petGlow 4.5s infinite alternate;
  position: relative;
  z-index: 2;
}
@keyframes bounce {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-22px) scale(1.08); }
}
@keyframes petGlow {
  0% { box-shadow: 0 4px 16px #ffb3c655, 0 0 0 8px #ffe6f0; }
  100% { box-shadow: 0 8px 32px #ffb3c6aa, 0 0 0 16px #ffe6f055; }
}
.pet::after {
  content: '';
  display: block;
  position: absolute;
  left: 50%;
  bottom: -18px;
  width: 60px;
  height: 18px;
  background: radial-gradient(ellipse at center, #ffd6e6 60%, #fff0 100%);
  border-radius: 50%;
  transform: translateX(-50%);
  opacity: 0.7;
  z-index: 1;
}
h1 {
  color: #ff7eb9;
  font-size: 2em;
  margin-bottom: 22px;
  margin-top: 0;
  letter-spacing: 2px;
  text-shadow: 0 2px 8px #fff0fa, 0 1px 0 #fff;
  font-family: 'ZCOOL KuaiLe', 'Comic Sans MS', '微软雅黑', cursive, sans-serif;
  animation: rainbowText 4s linear infinite alternate;
}
@keyframes rainbowText {
  0% { color: #ff7eb9; }
  25% { color: #7a5cfa; }
  50% { color: #ffb3c6; }
  75% { color: #ffb86b; }
  100% { color: #ff7eb9; }
}
label {
  color: #7a5cfa;
  font-size: 1.08em;
  margin-right: 10px;
  margin-bottom: 8px;
  display: inline-block;
}
input[type="number"] {
  border: 2px solid #ffb3c6;
  border-radius: 12px;
  padding: 8px 16px;
  font-size: 1.08em;
  width: 110px;
  margin-bottom: 18px;
  outline: none;
  transition: border 0.2s;
}
input[type="number"]:focus {
  border: 2px solid #7a5cfa;
}
.btn {
  background: linear-gradient(90deg, #ffb3c6 0%, #7a5cfa 100%);
  color: #fff;
  border: none;
  border-radius: 16px;
  padding: 10px 32px;
  font-size: 1.08em;
  margin: 18px 0 0 0;
  cursor: pointer;
  box-shadow: 0 2px 8px #f7b5d655;
  transition: background 0.2s, transform 0.1s;
}
.btn:active {
  transform: scale(0.97);
}
.income {
  margin-top: 32px;
  font-size: 2.1em;
  color: #ff7eb9;
  font-weight: bold;
  letter-spacing: 1px;
  text-shadow: 0 2px 8px #fff0fa, 0 1px 0 #fff;
  animation: popin 1.5s cubic-bezier(.68,-0.55,.27,1.55);
}
.total {
  margin-top: 18px;
  font-size: 1.4em;
  color: #7a5cfa;
  text-shadow: 0 2px 8px #fff0fa, 0 1px 0 #fff;
  animation: popin 1.5s cubic-bezier(.68,-0.55,.27,1.55);
}
.tip {
  color: #ffb3c6;
  font-size: 1.05em;
  margin-top: 22px;
  font-family: 'ZCOOL KuaiLe', 'Comic Sans MS', '微软雅黑', cursive, sans-serif;
  letter-spacing: 1px;
  text-shadow: 0 1px 0 #fff;
  animation: popin 2s cubic-bezier(.68,-0.55,.27,1.55);
}
.bubble {
  background:#fff0fa;
  border-radius:16px;
  padding:8px 18px;
  color:#ff7eb9;
  font-size:1.1em;
  box-shadow:0 2px 8px #f7b5d655,0 0 0 4px #ffe6f0;
  border:2px solid #ffb3c6;
  animation: bubblePop 2.2s cubic-bezier(.68,-0.55,.27,1.55);
}
@keyframes bubblePop {
  0% { transform: scale(0.7) translateY(-10px); opacity: 0; }
  60% { transform: scale(1.08) translateY(-2px); opacity: 1; }
  100% { transform: scale(1) translateY(0); opacity: 1; }
}
@media (max-width: 500px) {
  html, body, #app {
    height: 100%;
    min-height: 100vh;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    width: 100vw;
    min-height: 100vh;
    overflow-x: hidden;
  }
  .container {
    width: calc(100vw - 24px);
    min-height: calc(100vh - 24px);
    box-sizing: border-box;
    padding: 20px 8px 16px 8px;
    margin: 12px auto 0 auto;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    background-clip: padding-box;
  }
  .pet {
    width: 80px;
    height: 80px;
  }
  h1 {
    font-size: 1.3em;
  }
}
</style>
