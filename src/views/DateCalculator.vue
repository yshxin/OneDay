<template>
  <el-config-provider :locale="zhCn">
    <div class="datecalc-container">
      <button class="back-btn" @click="goHome" title="返回首页">⟵</button>
      <h1 class="datecalc-title">日期计算器</h1>
      <div class="datecalc-form">
        <div class="datecalc-row">
          <label>开始日期：</label>
          <el-date-picker
            v-model="start"
            type="date"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            class="datecalc-input"
            placeholder="选择开始日期"
            style="width: 160px;"
          />
        </div>
        <div class="datecalc-row">
          <label>结束日期：</label>
          <el-date-picker
            v-model="end"
            type="date"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            class="datecalc-input"
            placeholder="选择结束日期"
            style="width: 160px;"
          />
        </div>
        <button class="datecalc-btn" type="button" @click="calcDays">计算天数</button>
      </div>
      <div v-if="result !== null" class="datecalc-result">
        <span v-if="result >= 0">共 <b>{{ result }}</b> 天</span>
        <span v-else>请确保结束日期不早于开始日期~</span>
      </div>
    </div>
  </el-config-provider>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElDatePicker, ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'element-plus/dist/index.css'
import dayjs from 'dayjs'
const router = useRouter()
function goHome() { router.push('/') }

function getTodayStr() {
  return dayjs().format('YYYY-MM-DD')
}
const start = ref(getTodayStr())
const end = ref(getTodayStr())
const result = ref(null)

function calcDays() {
  if (!start.value || !end.value) {
    result.value = null
    return
  }
  // 兼容时区，确保只算日期部分
  const s = new Date(start.value + 'T00:00:00')
  const e = new Date(end.value + 'T00:00:00')
  const diff = Math.round((e - s) / (1000 * 60 * 60 * 24))
  result.value = diff >= 0 ? diff + 1 : -1
}
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
.datecalc-container {
  width: 100%;
  max-width: 420px;
  margin: 40px auto 0 auto;
  background: rgba(255,248,252,0.92);
  border-radius: 28px;
  box-shadow: 0 8px 32px #f7b5d6cc, 0 1.5px 0 #ffe6f0 inset;
  border: 3px dashed #ffb3c6;
  padding: 36px 36px 28px 36px;
  position: relative;
  min-height: 340px;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: popin 1.2s cubic-bezier(.68,-0.55,.27,1.55);
  box-sizing: border-box;
}
.datecalc-title {
  color: #ff7eb9;
  font-size: 2em;
  margin-bottom: 18px;
  font-family: 'ZCOOL KuaiLe', 'Comic Sans MS', '微软雅黑', cursive, sans-serif;
  text-shadow: 0 2px 8px #fff0fa, 0 1px 0 #fff;
  letter-spacing: 2px;
  animation: rainbowText 4s linear infinite alternate;
}
.datecalc-form {
  width: 100%;
  margin-bottom: 1.5em;
  display: flex;
  flex-direction: column;
  gap: 1.2em;
}
.datecalc-row {
  display: flex;
  align-items: center;
  gap: 1em;
}
.datecalc-input {
  border-radius: 16px;
  border: 2px solid #ffb6d5;
  padding: 0.5em 1.2em;
  font-size: 1.1em;
  outline: none;
  transition: box-shadow 0.2s, border-color 0.2s;
  box-shadow: 0 2px 8px #ffe0f3;
  background: #fff0f7;
  color: #d72660;
}
.datecalc-input:focus {
  border-color: #ff69b4;
  box-shadow: 0 0 0 3px #ffe0f3;
}
.datecalc-btn {
  background: linear-gradient(90deg, #ffb3c6 0%, #b5eaff 100%);
  color: #fff;
  border: none;
  border-radius: 16px;
  font-size: 1.1em;
  padding: 0.7em 1.2em;
  box-shadow: 0 2px 8px #f7b5d655;
  cursor: pointer;
  transition: background 0.18s, transform 0.15s;
  font-family: inherit;
  will-change: transform, box-shadow;
  outline: none;
  margin-top: 1.2em;
}
.datecalc-btn:hover {
  transform: scale(1.08);
  box-shadow: 0 8px 24px #ffd6e6, 0 0 0 4px #ffe0f3;
  filter: brightness(1.08);
}
.datecalc-btn:active {
  transform: scale(0.97);
  filter: brightness(0.97);
}
.datecalc-result {
  margin-top: 1.5em;
  color: #a36b9e;
  font-size: 1.2em;
  text-align: center;
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
  .datecalc-container {
    width: calc(100vw - 12px);
    max-width: 99vw;
    min-height: 60vw;
    border-radius: 14px;
    padding: 12px 4px 10px 4px;
    margin: 10px auto 0 auto;
    box-sizing: border-box;
  }
  .datecalc-title {
    font-size: 1.2em;
  }
  .datecalc-input {
    font-size: 1em;
    padding: 0.5em 0.7em;
    width: 100%;
    min-width: 0;
  }
  .datecalc-btn {
    font-size: 1em;
    border-radius: 12px;
    padding: 0.5em 0.7em;
  }
}
</style>
