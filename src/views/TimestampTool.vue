<template>
<div class="ts-container">
  <button class="back-btn" @click="goHome" title="返回首页">⟵</button>
  <h1 class="ts-title">时间戳转换工具</h1>
  <div class="ts-now">
    <span class="ts-now-label">当前时间：</span>
    <b class="ts-now-value">{{ nowStr }}</b>
  </div>
  <div class="ts-card-group">
    <div class="ts-card ts-card-date">
      <div class="ts-card-title">日期转时间戳</div>
      <div class="ts-card-content">
        <el-select v-model="inputMode" class="ts-input-mode-select" style="width: 100%; margin-bottom: 0.7em;" size="large" popper-class="ts-select-popper">
          <el-option label="选择日期（推荐）" value="picker" />
          <el-option label="手动输入" value="manual" />
        </el-select>
        <div v-if="inputMode === 'picker'" class="ts-picker-wrap">
          <el-date-picker
            v-model="dateInputPicker"
            type="datetime"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="选择日期时间"
            class="ts-date-picker"
            popper-class="ts-date-popper"
          />
        </div>
        <el-input
          v-if="inputMode === 'manual'"
          v-model="dateInputManual"
          placeholder="手动输入日期时间"
          class="ts-input ts-input-date ts-input-auto"
          autosize
        />
        <el-button class="ts-btn ts-btn-main ts-btn-block" style="margin-top: 1em;" @click="toTimestamp">转为时间戳</el-button>
      </div>
    </div>
    <div class="ts-card ts-card-ts">
      <div class="ts-card-title">时间戳转日期</div>
      <div class="ts-card-content">
        <el-input
          v-model="tsInput"
          placeholder="输入时间戳（秒/毫秒）"
          class="ts-input ts-input-auto"
          autosize
        />
        <el-button class="ts-btn ts-btn-main" @click="toDate">转为日期</el-button>
      </div>
    </div>
  </div>
  <div class="ts-result" v-if="result">
    <span v-if="result.startsWith('时间戳')">
      <span class="ts-label">{{ result.split('，')[0] }}</span><br />
      <span class="ts-label">{{ result.split('，')[1] }}</span>
    </span>
    <span v-else>{{ result }}</span>
  </div>
</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElInput, ElButton, ElDatePicker, ElSelect, ElOption } from 'element-plus'
import dayjs from 'dayjs'

const router = useRouter()
function goHome() { router.push('/') }

const nowStr = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'))
let timer = null
onMounted(() => {
  timer = setInterval(() => {
    nowStr.value = dayjs().format('YYYY-MM-DD HH:mm:ss')
  }, 1000)
})
onUnmounted(() => { timer && clearInterval(timer) })

const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
const inputMode = ref('picker')
const dateInputPicker = ref(now)
const dateInputManual = ref('')
const tsInput = ref('')
const result = ref('')

function toTimestamp() {
  let value = ''
  if (inputMode.value === 'picker') {
    value = dateInputPicker.value
  } else {
    value = dateInputManual.value
  }
  if (!value) {
    result.value = inputMode.value === 'picker' ? '请选择日期时间' : '请输入日期时间'
    return
  }
  const d = dayjs(value)
  if (!d.isValid()) {
    result.value = '无效日期格式'
    return
  }
  result.value = '时间戳（秒）：' + d.unix() + '，时间戳（毫秒）：' + d.valueOf()
}

function toDate() {
  if (!tsInput.value) {
    result.value = '请输入时间戳'
    return
  }
  let ts = tsInput.value.trim()
  if (/^\d{13}$/.test(ts)) {
    // 毫秒
    result.value = dayjs(Number(ts)).format('YYYY-MM-DD HH:mm:ss')
  } else if (/^\d{10}$/.test(ts)) {
    // 秒
    result.value = dayjs(Number(ts) * 1000).format('YYYY-MM-DD HH:mm:ss')
  } else {
    result.value = '请输入10位或13位数字时间戳'
  }
}
</script>

<style scoped>
/* 代码示例区 */
.ts-code-section {
  margin-top: 2.5em;
  background: #fff8fc;
  border-radius: 22px;
  box-shadow: 0 2px 12px #f7b5d655;
  padding: 1.5em 1.2em 1.2em 1.2em;
  max-width: 700px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.ts-code-title {
  color: #ff7eb9;
  font-size: 1.18em;
  font-weight: bold;
  margin-bottom: 1.1em;
  letter-spacing: 1px;
  text-shadow: 0 1px 0 #fff;
}
.ts-code-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1.2em;
  width: 100%;
  justify-content: center;
}
.ts-code-block {
  background: linear-gradient(120deg, #fff0fa 60%, #b5eaff 100%);
  border-radius: 16px;
  box-shadow: 0 2px 8px #f7b5d655;
  border: 1.5px solid #ffb3c6;
  padding: 1em 1.1em 0.7em 1.1em;
  min-width: 180px;
  max-width: 260px;
  flex: 1 1 180px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 0.5em;
  font-size: 1em;
  position: relative;
  transition: box-shadow 0.18s, transform 0.15s;
}
.ts-code-block:hover {
  box-shadow: 0 8px 24px #ffd6e6, 0 0 0 4px #ffe0f3;
  transform: scale(1.04) rotate(-2deg);
}
.ts-code-lang {
  font-weight: bold;
  color: #7a5cfa;
  margin-bottom: 0.5em;
  font-size: 1.08em;
  display: flex;
  align-items: center;
  gap: 0.3em;
}
.ts-code-pre {
  background: #fff0fa;
  border-radius: 10px;
  padding: 0.6em 0.7em;
  font-family: 'JetBrains Mono', 'Consolas', 'Menlo', monospace;
  font-size: 0.98em;
  color: #a36b9e;
  white-space: pre-wrap;
  word-break: break-all;
  margin: 0;
}
/* 输入框内容自适应宽度/高度 */
.ts-input-auto .el-input__inner {
  min-width: 80px;
  width: auto;
  max-width: 100%;
  transition: width 0.2s;
}
.ts-input-auto .el-textarea__inner {
  min-height: 38px;
  max-height: 200px;
  transition: height 0.2s;
}
/* 输入模式选择器样式 */
.ts-input-mode-select {
  border-radius: 12px !important;
  background: #fff8fc !important;
  box-shadow: 0 1px 4px #ffd6e655 !important;
  border: 1.5px solid #ffb3c6 !important;
  font-size: 1.08em;
  margin-bottom: 0.7em;
  --el-select-input-color: #ff7eb9;
  --el-select-border-color-hover: #ffb3c6;
  --el-select-border-color-active: #ff7eb9;
  --el-select-bg-color: #fff8fc;
  --el-select-input-focus-border-color: #ffb3c6;
  --el-select-input-focus-box-shadow: 0 0 0 2px #ffe0f3;
  --el-select-placeholder-color: #bfa6c9;
  --el-select-dropdown-bg-color: #fff0fa;
  --el-select-dropdown-border-color: #ffb3c6;
}

/* 下拉弹窗样式 */
.ts-select-popper {
  border-radius: 16px !important;
  box-shadow: 0 4px 24px #ffd6e6cc !important;
  border: 2px solid #ffb3c6 !important;
  background: #fff0fa !important;
  padding: 0.3em 0;
}
.ts-select-popper .el-select-dropdown__item {
  font-size: 1.08em;
  color: #ff7eb9;
  border-radius: 10px;
  margin: 0.1em 0.5em;
  transition: background 0.18s, color 0.18s, transform 0.15s;
}
.ts-select-popper .el-select-dropdown__item.selected,
.ts-select-popper .el-select-dropdown__item.is-hover {
  background: linear-gradient(90deg, #ffb3c6 0%, #b5eaff 100%);
  color: #fff;
  transform: scale(1.06);
}

/* 容器和标题 */
.ts-container {
  width: 100%;
  max-width: 660px;
  margin: 40px auto 0 auto;
  background: rgba(255,248,252,0.96);
  border-radius: 36px;
  box-shadow: 0 8px 32px #f7b5d6cc, 0 1.5px 0 #ffe6f0 inset;
  border: 3px dashed #ffb3c6;
  padding: 44px 44px 38px 44px;
  position: relative;
  min-height: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: popin 1.2s cubic-bezier(.68,-0.55,.27,1.55);
  box-sizing: border-box;
}
.ts-title {
  color: #ff7eb9;
  font-size: 2.1em;
  margin-bottom: 18px;
  font-family: 'ZCOOL KuaiLe', 'Comic Sans MS', '微软雅黑', cursive, sans-serif;
  text-shadow: 0 2px 8px #fff0fa, 0 1px 0 #fff;
  letter-spacing: 2px;
  animation: rainbowText 4s linear infinite alternate;
}
/* 当前时间 */
.ts-now {
  color: #7a5cfa;
  font-size: 1.08em;
  margin-bottom: 1.5em;
  font-family: 'Consolas', 'Comic Sans MS', '微软雅黑', cursive, monospace;
  display: flex;
  align-items: center;
  gap: 0.3em;
}
.ts-now-label {
  font-weight: 500;
  opacity: 0.8;
}
.ts-now-value {
  font-size: 1.13em;
  color: #ff7eb9;
  letter-spacing: 1px;
}
/* 卡片分组 */
.ts-card-group {
  display: flex;
  gap: 18px;
  width: 100%;
  justify-content: center;
  margin-bottom: 1.2em;
  flex-wrap: wrap;
}
.ts-card {
  background: linear-gradient(120deg, #fff0fa 60%, #b5eaff 100%);
  border-radius: 26px;
  box-shadow: 0 2px 12px #f7b5d655, 0 1.5px 0 #ffe6f0 inset;
  border: 2px solid #ffb3c6;
  padding: 28px 26px 22px 26px;
  min-width: 260px;
  max-width: 320px;
  flex: 1 1 260px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 0.5em;
  transition: box-shadow 0.18s, transform 0.15s;
  position: relative;
}
.ts-card-title {
  color: #ff7eb9;
  font-size: 1.13em;
  font-weight: bold;
  margin-bottom: 0.7em;
  letter-spacing: 1px;
  text-shadow: 0 1px 0 #fff;
}
.ts-card-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.7em;
  align-items: stretch;
}
.ts-card-content-flex {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 1em;
  width: 100%;
}
.ts-picker-wrap {
  min-width: 0;
  flex: 1.2 1 0;
  display: flex;
  align-items: stretch;
  position: relative;
  z-index: 2;
}
.ts-date-picker {
  width: 100%;
  min-width: 120px;
  border-radius: 12px !important;
  background: #fff8fc !important;
  box-shadow: 0 1px 4px #ffd6e655;
  z-index: 2;
  height: 38px;
  line-height: 38px;
  border: 1.5px solid #ffb3c6 !important;
  display: flex;
  align-items: center;
}
.ts-date-picker .el-input__wrapper {
  border-radius: 12px !important;
  background: #fff8fc !important;
  min-height: 38px;
  box-shadow: none !important;
  border: none !important;
  padding: 0 10px;
  font-size: 1em;
}
.ts-date-picker .el-input__inner {
  height: 38px;
  line-height: 38px;
  font-size: 1em;
  background: transparent !important;
}
.ts-input-date {
  flex: 1 1 0;
  min-width: 0;
  margin-left: 0;
  border-radius: 12px !important;
  background: #fff8fc !important;
  z-index: 1;
  height: 38px;
  font-size: 1em;
}
.ts-btn-main {
  margin-top: 1em;
  height: 38px;
  min-width: 90px;
  opacity: 1 !important;
  z-index: 3;
  position: relative;
  align-self: center;
  transition: transform 0.18s, box-shadow 0.18s;
}
.ts-btn-main:hover {
  transform: scale(1.12) rotate(-6deg);
  box-shadow: 0 8px 24px #ffd6e6, 0 0 0 4px #ffe0f3;
}
.ts-btn-main:active {
  transform: scale(0.97);
}
.ts-btn-block {
  width: 100%;
  margin-left: 0;
}
/* 优化 el-date-picker 弹窗样式 */
.ts-date-popper {
  border-radius: 16px !important;
  box-shadow: 0 4px 24px #ffd6e6cc !important;
  border: 2px solid #ffb3c6 !important;
  background: #fff8fc !important;
  z-index: 9999 !important;
}
.ts-btn {
  background: linear-gradient(90deg, #ffb3c6 0%, #b5eaff 100%) !important;
  color: #fff !important;
  border-radius: 16px !important;
  font-size: 1.08em;
  padding: 0.5em 1.2em;
  box-shadow: 0 2px 8px #f7b5d655;
  transition: background 0.18s, transform 0.15s;
  font-family: inherit;
  outline: none;
  border: none;
}
.ts-btn:hover {
  transform: scale(1.08);
  box-shadow: 0 8px 24px #ffd6e6, 0 0 0 4px #ffe0f3;
  filter: brightness(1.08);
}
.ts-btn:active {
  transform: scale(0.97);
  filter: brightness(0.97);
}
/* 结果区 */
.ts-result {
  margin-top: 1.7em;
  color: #a36b9e;
  font-size: 1.18em;
  text-align: center;
  word-break: break-all;
  background: #fff0fa;
  border-radius: 16px;
  padding: 0.7em 1.2em;
  min-width: 180px;
  box-shadow: 0 2px 8px #f7b5d655;
  display: inline-block;
}
.ts-label {
  color: #7a5cfa;
  font-weight: 500;
  font-size: 1em;
}
/* 返回按钮 */
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
@media (max-width: 700px) {
  .ts-container {
    max-width: 99vw;
    min-height: 60vw;
    border-radius: 18px;
    padding: 14px 2vw 10px 2vw;
    margin: 10px auto 0 auto;
    box-sizing: border-box;
  }
  .ts-title {
    font-size: 1.15em;
  }
  .ts-now {
    font-size: 1em;
  }
  .ts-btn {
    font-size: 1em;
    border-radius: 12px;
    padding: 0.5em 0.7em;
  }
  .ts-card {
    min-width: 140px;
    max-width: 99vw;
    padding: 12px 6px 10px 6px;
    border-radius: 12px;
  }
  .ts-card-title {
    font-size: 1em;
  }
  .ts-card-content-flex {
    flex-direction: column;
    gap: 0.5em;
  }
  .ts-btn-block {
    width: 100%;
    margin-left: 0;
    margin-top: 0.5em;
  }
  .ts-picker-wrap, .ts-input-date {
    width: 100%;
    min-width: 0;
  }
  .ts-date-picker {
    min-width: 0;
    font-size: 0.98em;
    border-radius: 8px !important;
  }
  .ts-result {
    font-size: 1em;
    border-radius: 10px;
    padding: 0.5em 0.7em;
    min-width: 120px;
  }
}
</style>
