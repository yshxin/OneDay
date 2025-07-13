
<script setup>

import { ref, computed, onMounted } from 'vue'
import bbaocat from '../public/bbaocat.svg'
import calcCute from '../public/calc-cute.svg'
import qrcodeCute from '../public/qrcode-cute.svg'

const search = ref('')
const tools = ref([
  { name: '和猫猫捡金币', desc: '可爱猫猫陪你计时赚金币', path: '/income-pet-girl', img: bbaocat },
  { name: '计算器', desc: '基础加减乘除，萌萌哒', path: '/calculator', img: calcCute },
  { name: '二维码生成', desc: '将链接和文本转为可爱二维码', path: '/qrcode', img: qrcodeCute },
  { name: '日期计算器', desc: '计算两个日期间的天数', path: '/date-calc', img: qrcodeCute },
  { name: '时间戳转换', desc: '日期与时间戳互转，支持实时显示', path: '/timestamp-tool', img: calcCute },
  { name: '俄罗斯方块', desc: '可爱风格的经典俄罗斯方块游戏', path: '/tetris', img: bbaocat },
  { name: '单位换算', desc: '长度、重量、能量、体积、计算机单位可爱换算', path: '/unit-converter', img: bbaocat },
])

const filteredTools = computed(() =>
  tools.value.filter(tool =>
    tool.name.includes(search.value) || tool.desc.includes(search.value)
  )
)

import { useRouter } from 'vue-router'
const router = useRouter()
function goTool(path) {
  router.push(path)
}

// 移除常见元素默认样式
onMounted(() => {
  const style = document.createElement('style')
  style.innerHTML = `
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    table {
      border-collapse: collapse;
      border-spacing: 0;
    }
    ul, ol {
      list-style: none;
    }
    a {
      text-decoration: none;
      color: inherit;
    }
    button, input, textarea, select {
      font: inherit;
      background: none;
      border: none;
      outline: none;
    }
  `
  document.head.appendChild(style)
})
</script>

<template>
  <div class="tool-page">
    <template v-if="$route.path === '/'">
      <h1 class="cute-title">🌸 工具集合</h1>
      <div class="search-bar">
        <input v-model="search" placeholder="🔍 搜索工具..." class="cute-input" />
      </div>
      <div class="tool-table">
        <div class="tool-grid">
          <div v-for="tool in filteredTools" :key="tool.name" class="tool-card" @click="goTool(tool.path)">
            <div class="tool-icon">
              <img v-if="tool.img" :src="tool.img" :alt="tool.name" class="tool-img" />
            </div>
            <div class="tool-info">
              <div class="tool-name">{{ tool.name }}</div>
              <div class="tool-desc">{{ tool.desc }}</div>
            </div>
          </div>
          <div v-if="filteredTools.length === 0" class="empty-tip">没有找到相关工具~</div>
        </div>
      </div>
    </template>
    <router-view v-else />
  </div>
</template>

<style scoped>
.tool-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  min-height: 100vh;
  z-index: 0;
  /* 动态渐变背景 */
  background: linear-gradient(270deg, #fff6fa, #ffe0f3, #f9eaff, #e0f7fa, #fff6fa);
  background-size: 400% 400%;
  animation: gradientMove 12s ease infinite;
  padding: 2.5rem 2rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  box-sizing: border-box;
  overflow-y: auto;
}

@keyframes gradientMove {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@media (max-width: 600px) {
  .tool-page {
    padding: 1.2rem 0.3rem 1.2rem 0.3rem;
  }
  .cute-title {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  .tool-table {
    font-size: 0.95em;
  }
  th, td {
    padding: 0.5em 0.4em;
  }
  .cute-input {
    font-size: 1em;
    padding: 0.5em 1em;
  }
}
.cute-title {
  text-align: center;
  font-size: 2.6rem;
  color: #ff69b4;
  font-family: 'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', cursive;
  margin-bottom: 1.5rem;
  letter-spacing: 2px;
}
.search-bar {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}
.cute-input {
  border-radius: 20px;
  border: 2px solid #ffb6d5;
  padding: 0.7em 1.5em;
  font-size: 1.1em;
  outline: none;
  transition: box-shadow 0.2s, border-color 0.2s;
  box-shadow: 0 2px 8px #ffe0f3;
  background: #fff0f7;
  color: #d72660;
}
.cute-input:focus {
  border-color: #ff69b4;
  box-shadow: 0 0 0 3px #ffe0f3;
}
.tool-table {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
.tool-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
}
.tool-card {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 2px 12px #ffe0f3;
  padding: 1.2rem 1rem 1rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.18s cubic-bezier(.34,1.56,.64,1), box-shadow 0.18s, background 0.18s, filter 0.18s;
  position: relative;
  min-height: 120px;
  will-change: transform, box-shadow, filter;
  animation: cardPop 0.7s cubic-bezier(.34,1.56,.64,1);
}
.tool-card:hover {
  transform: scale(1.08) rotate(-3deg) translateY(-6px);
  box-shadow: 0 12px 36px #ffd6e6, 0 0 0 4px #ffe0f3;
  background: #fff6fa;
  filter: brightness(1.07) saturate(1.2);
}
.tool-card:active {
  transform: scale(0.97) rotate(1deg) translateY(2px);
  box-shadow: 0 2px 8px #ffd6e6;
  filter: brightness(0.98);
}
@keyframes cardPop {
  0% { transform: scale(0.92) rotate(-6deg); opacity: 0; }
  60% { transform: scale(1.04) rotate(2deg); opacity: 1; }
  100% { transform: scale(1) rotate(0); opacity: 1; }
}
.tool-icon {
  font-size: 2.2em;
  margin-bottom: 0.7em;
  animation: bounce 1.2s infinite alternate;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 54px;
}
.tool-img {
  width: 48px;
  height: 48px;
  object-fit: contain;
  border-radius: 16px;
  box-shadow: 0 2px 8px #ffe0f3;
  background: #fff0f7;
  transition: transform 0.18s;
}
.tool-card:hover .tool-img {
  transform: scale(1.13) rotate(-6deg);
}
.tool-info {
  text-align: center;
}
.tool-name {
  font-size: 1.15em;
  font-weight: bold;
  color: #d72660;
  margin-bottom: 0.3em;
}
.tool-desc {
  font-size: 0.98em;
  color: #a36b9e;
}
@keyframes bounce {
  0% { transform: translateY(0); }
  100% { transform: translateY(-8px) scale(1.1); }
}
.empty-tip {
  text-align: center;
  color: #ff69b4;
  margin-top: 2rem;
  font-size: 1.2em;
}
</style>

<style scoped>
html, body, #app {
  width: 100vw;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  /* 保持透明，背景由 .tool-page 控制 */
  background: transparent;
}
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
