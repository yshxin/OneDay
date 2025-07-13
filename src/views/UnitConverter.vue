<template>
  <div class="unit-converter-cute">
    <button class="back-btn" @click="goHome" title="返回首页">⟵</button>
    <h1 class="unit-converter-title">单位换算器</h1>
    <div class="unit-converter-form-vertical">
      <div class="unit-converter-row">
        <label class="unit-converter-label">换算类型</label>
        <select v-model="category" class="unit-converter-select">
          <option v-for="cat in categories" :key="cat.value" :value="cat.value">{{ cat.label }}</option>
        </select>
      </div>
      <div class="unit-converter-row">
        <label class="unit-converter-label">输入数值</label>
        <input v-model.number="inputValue" type="number" class="unit-converter-input" placeholder="输入数值" />
      </div>
      <div class="unit-converter-row unit-converter-row-units">
        <div class="unit-converter-unit-group">
          <label class="unit-converter-label">从</label>
          <select v-model="fromUnit" class="unit-converter-select">
            <option v-for="unit in currentUnits" :key="unit.value" :value="unit.value">{{ unit.label }}</option>
          </select>
        </div>
        <span class="unit-converter-arrow">↓</span>
        <div class="unit-converter-unit-group">
          <label class="unit-converter-label">到</label>
          <select v-model="toUnit" class="unit-converter-select">
            <option v-for="unit in currentUnits" :key="unit.value" :value="unit.value">{{ unit.label }}</option>
          </select>
        </div>
      </div>
    </div>
    <div class="unit-converter-result" :class="{ 'result-animate': showResultAnimate }" @animationend="showResultAnimate = false">
      <span v-if="inputValue !== null && fromUnit && toUnit">{{ inputValue }} {{ getUnitLabel(fromUnit) }} = <b>{{ result }}</b> {{ getUnitLabel(toUnit) }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
function goHome() { router.push('/') }

const showResultAnimate = ref(false)
const category = ref('length')
const inputValue = ref(null)
const fromUnit = ref('m')
const toUnit = ref('km')

const categories = [
  { label: '长度', value: 'length' },
  { label: '重量', value: 'weight' },
  { label: '能量', value: 'energy' },
  { label: '体积', value: 'volume' },
  { label: '计算机', value: 'computer' },
]

const units = {
  length: [
    { label: '米 (m)', value: 'm', factor: 1 },
    { label: '千米 (km)', value: 'km', factor: 1000 },
    { label: '厘米 (cm)', value: 'cm', factor: 0.01 },
    { label: '毫米 (mm)', value: 'mm', factor: 0.001 },
    { label: '英寸 (in)', value: 'in', factor: 0.0254 },
    { label: '英尺 (ft)', value: 'ft', factor: 0.3048 },
    { label: '码 (yd)', value: 'yd', factor: 0.9144 },
    { label: '英里 (mi)', value: 'mi', factor: 1609.344 },
  ],
  weight: [
    { label: '千克 (kg)', value: 'kg', factor: 1 },
    { label: '克 (g)', value: 'g', factor: 0.001 },
    { label: '吨 (t)', value: 't', factor: 1000 },
    { label: '磅 (lb)', value: 'lb', factor: 0.45359237 },
    { label: '盎司 (oz)', value: 'oz', factor: 0.0283495231 },
  ],
  energy: [
    { label: '焦耳 (J)', value: 'J', factor: 1 },
    { label: '千焦 (kJ)', value: 'kJ', factor: 1000 },
    { label: '千卡 (kcal)', value: 'kcal', factor: 4184 },
    { label: '瓦时 (Wh)', value: 'Wh', factor: 3600 },
    { label: '千瓦时 (kWh)', value: 'kWh', factor: 3600000 },
  ],
  volume: [
    { label: '升 (L)', value: 'L', factor: 1 },
    { label: '毫升 (mL)', value: 'mL', factor: 0.001 },
    { label: '立方米 (m³)', value: 'm3', factor: 1000 },
    { label: '加仑 (gal)', value: 'gal', factor: 3.78541 },
    { label: '品脱 (pt)', value: 'pt', factor: 0.473176 },
  ],
  computer: [
    { label: '字节 (B)', value: 'B', factor: 1 },
    { label: '千字节 (KB)', value: 'KB', factor: 1024 },
    { label: '兆字节 (MB)', value: 'MB', factor: 1024 * 1024 },
    { label: '吉字节 (GB)', value: 'GB', factor: 1024 * 1024 * 1024 },
    { label: '太字节 (TB)', value: 'TB', factor: 1024 * 1024 * 1024 * 1024 },
  ],
}

const currentUnits = computed(() => units[category.value])

watch(category, () => {
  fromUnit.value = currentUnits.value[0].value
  toUnit.value = currentUnits.value[1]?.value || currentUnits.value[0].value
})

watch([inputValue, fromUnit, toUnit], ([val, from, to], [oldVal, oldFrom, oldTo]) => {
  if (val !== null && (val !== oldVal || from !== oldFrom || to !== oldTo)) {
    showResultAnimate.value = false
    requestAnimationFrame(() => { showResultAnimate.value = true })
  }
})

const getUnitLabel = (unitValue) => {
  const unit = currentUnits.value.find(u => u.value === unitValue)
  return unit ? unit.label : unitValue
}

const result = computed(() => {
  if (inputValue.value === null || !fromUnit.value || !toUnit.value) return ''
  const from = currentUnits.value.find(u => u.value === fromUnit.value)
  const to = currentUnits.value.find(u => u.value === toUnit.value)
  if (!from || !to) return ''
  return ((inputValue.value * from.factor) / to.factor).toLocaleString(undefined, { maximumFractionDigits: 8 })
})
</script>

<style scoped>

/* 修复卡片不显示问题，简化样式并保证兼容性 */
/* 参考 QrcodeGenerator 页面弹入动画 */
/* 完全参考 QrcodeGenerator 卡片动画和样式 */
.unit-converter-cute {
  width: 100%;
  max-width: 420px;
  margin: 40px auto 0 auto;
  background: rgba(255,248,252,0.92);
  border-radius: 28px;
  box-shadow: 0 8px 32px #f7b5d6cc, 0 1.5px 0 #ffe6f0 inset;
  border: 3px dashed #ffb3c6;
  padding: 36px 36px 28px 36px;
  position: relative;
  min-height: 440px;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: popin 1.2s cubic-bezier(.68,-0.55,.27,1.55);
  box-sizing: border-box;
}
@keyframes popin {
  0% { transform: scale(0.7); opacity: 0; }
  80% { transform: scale(1.08); opacity: 1; }
  100% { transform: scale(1); }
}
@media (max-width: 500px) {
  .unit-converter-cute {
    width: calc(100vw - 12px);
    max-width: 99vw;
    min-height: 80vw;
    border-radius: 14px;
    padding: 12px 4px 10px 4px;
    margin: 10px auto 0 auto;
    box-sizing: border-box;
  }
  .unit-converter-title {
    font-size: 1.2em;
  }
}
@media (max-width: 600px) {
  .unit-converter-cute {
    padding: 18px 4px 18px 4px;
    min-width: 0;
    max-width: 98vw;
  }
}

.unit-converter-title {
  color: #ff7eb9;
  font-size: 2em;
  margin-bottom: 18px;
  font-family: 'ZCOOL KuaiLe', 'Comic Sans MS', '微软雅黑', cursive, sans-serif;
  text-shadow: 0 2px 8px #fff0fa, 0 1px 0 #fff;
  letter-spacing: 2px;
  animation: rainbowText 4s linear infinite alternate;
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
.unit-converter-cute:hover {
  box-shadow: 0 8px 32px #ffb6d5;
}
.unit-converter-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 22px;
  justify-content: center;
}
.unit-converter-icon {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: #ffe0f0;
  box-shadow: 0 2px 8px #ffd6e6;
  transition: transform 0.3s;
}
.unit-converter-header:hover .unit-converter-icon {
  transform: rotate(-12deg) scale(1.1);
}
.unit-converter-form-vertical {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-bottom: 18px;
}
.unit-converter-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 0;
}
.unit-converter-label {
  min-width: 70px;
  color: #d14e7b;
  font-size: 1.08em;
  font-weight: bold;
  letter-spacing: 1px;
}
.unit-converter-select, .unit-converter-input {
  border: none;
  border-radius: 16px;
  padding: 8px 16px;
  font-size: 1.1em;
  background: #fff0f7;
  color: #d14e7b;
  outline: none;
  box-shadow: 0 2px 8px #ffe0f0;
  transition: box-shadow 0.2s, background 0.2s;
}
.unit-converter-select:focus, .unit-converter-input:focus {
  background: #ffe0f0;
  box-shadow: 0 4px 16px #ffd6e6;
}
.unit-converter-row-units {
  justify-content: space-between;
  gap: 18px;
}
.unit-converter-unit-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}
.unit-converter-arrow {
  font-size: 2em;
  color: #ff8ab8;
  font-weight: bold;
  margin: 0 8px;
  transition: transform 0.2s;
  display: flex;
  align-items: center;
}
.unit-converter-row-units:hover .unit-converter-arrow {
  transform: scale(1.2) rotate(10deg);
}
.unit-converter-result {
  margin-top: 18px;
  font-size: 1.25em;
  color: #d14e7b;
  background: #fff0f7;
  border-radius: 18px;
  padding: 14px 18px;
  min-height: 38px;
  box-shadow: 0 2px 8px #ffe0f0;
  text-align: center;
  letter-spacing: 1px;
  transition: box-shadow 0.2s, background 0.2s, transform 0.2s;
}
.result-animate {
  animation: resultPop 0.45s cubic-bezier(.34,1.56,.64,1);
}
@keyframes resultPop {
  0% { transform: scale(0.92) rotate(-3deg); box-shadow: 0 0 0 #ffd6e6; background: #ffe0f0; }
  60% { transform: scale(1.08) rotate(2deg); box-shadow: 0 8px 32px #ffd6e6; background: #fff6fa; }
  100% { transform: scale(1) rotate(0); box-shadow: 0 2px 8px #ffe0f0; background: #fff0f7; }
}
</style>
