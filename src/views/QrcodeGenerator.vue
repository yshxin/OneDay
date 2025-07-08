<template>
  <div class="qr-container">
    <button class="back-btn" @click="goHome" title="返回首页">⟵</button>
    <h1 class="qr-title">二维码生成器</h1>
    <div class="qr-form">
      <div class="qr-form-row">
        <textarea
          v-model="text"
          class="qr-input qr-textarea"
          placeholder="请输入链接或任意文本..."
          rows="3"
          :maxlength="maxLen"
          @input="onInput"
        />
      </div>
      <div class="qr-form-row qr-form-row-bottom">
        <select v-model="styleIndex" class="qr-style-select qr-form-btn">
          <option v-for="(s, i) in styles" :key="i" :value="i">{{ s.name }}</option>
        </select>
        <button class="qr-btn qr-form-btn" @click="genQrcode">生成二维码</button>
      </div>
    </div>
    <div v-if="!text" class="qr-tip qr-tip-warn">请输入内容后再生成二维码~</div>
    <div v-else>
      <div v-if="text.length > maxLen" class="qr-tip qr-tip-warn">内容过长，最多支持 {{ maxLen }} 字符，已自动截断~</div>
      <div class="qr-preview" v-if="qrDataUrl">
        <img :src="qrDataUrl" alt="二维码" class="qr-img" />
        <button class="qr-btn download-btn" @click="downloadQrcode">下载二维码</button>
      </div>
      <div v-else class="qr-tip">输入内容后点击生成按钮~</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import * as QRCode from 'qrcode'
const router = useRouter()
function goHome() { router.push('/') }

import { nextTick } from 'vue'
const maxLen = 300
const text = ref('')
const qrDataUrl = ref('')
const styleIndex = ref(0)
const styles = [
  { name: '黑色', dark: '#222', light: '#fff' },
  { name: '少女粉', dark: '#d72660', light: '#fff0f7' },
  { name: '天空蓝', dark: '#3a8ee6', light: '#e0f7fa' },
  { name: '柠檬黄', dark: '#f7b500', light: '#fffbe6' },
  { name: '薄荷绿', dark: '#00c48f', light: '#e0fff6' },
  { name: '薰衣草紫', dark: '#a36b9e', light: '#f9eaff' },
]
function onInput(e) {
  if (text.value.length > maxLen) {
    text.value = text.value.slice(0, maxLen)
  }
}


function genQrcode() {
  if (!text.value) {
    qrDataUrl.value = ''
    return
  }
  const style = styles[styleIndex.value]
  QRCode.toDataURL(text.value, {
    margin: 2,
    width: 240,
    color: {
      dark: style.dark,
      light: style.light
    }
  }, (err, url) => {
    if (!err) qrDataUrl.value = url
  })
}

function downloadQrcode() {
  if (!qrDataUrl.value) return
  const a = document.createElement('a')
  a.href = qrDataUrl.value
  a.download = 'qrcode.png'
  a.click()
}
</script>

<style scoped>
.qr-form-row-bottom {
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.qr-form-btn {
  flex: 1 1 0;
  min-width: 0;
  max-width: 50%;
  box-sizing: border-box;
}
.qr-container {
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
.qr-title {
  color: #ff7eb9;
  font-size: 2em;
  margin-bottom: 18px;
  font-family: 'ZCOOL KuaiLe', 'Comic Sans MS', '微软雅黑', cursive, sans-serif;
  text-shadow: 0 2px 8px #fff0fa, 0 1px 0 #fff;
  letter-spacing: 2px;
  animation: rainbowText 4s linear infinite alternate;
}
.qr-form {
  width: 100%;
  margin-bottom: 1.5em;
  display: flex;
  flex-direction: column;
  gap: 0.7em;
}
.qr-form-row {
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 0.7em;
}
.qr-form-row-align {
  align-items: center;
}
.qr-input {
  border-radius: 20px;
  border: 2px solid #ffb6d5;
  padding: 0.7em 1.2em;
  font-size: 1.1em;
  outline: none;
  transition: box-shadow 0.2s, border-color 0.2s;
  box-shadow: 0 2px 8px #ffe0f3;
  background: #fff0f7;
  color: #d72660;
  width: 100%;
  min-width: 0;
  display: block;
  box-sizing: border-box;
  resize: vertical;
}
.qr-input:focus {
  border-color: #ff69b4;
  box-shadow: 0 0 0 3px #ffe0f3;
}
.qr-textarea {
  min-height: 3.2em;
  max-height: 10em;
  font-family: inherit;
  line-height: 1.6;
}
.qr-style-select {
  border-radius: 16px;
  border: 2px solid #bfa2e6;
  background: #f9eaff;
  color: #a36b9e;
  font-size: 1.05em;
  padding: 0.5em 1em;
  margin-right: 0.7em;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px #ffe0f3;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
}
.qr-style-select:focus {
  border-color: #ff69b4;
  box-shadow: 0 0 0 3px #ffe0f3;
}
.qr-btn {
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
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
}
.qr-tip-warn {
  color: #ff69b4;
  font-weight: bold;
  margin-top: 1.2em;
}
.qr-btn:hover {
  transform: scale(1.08);
  box-shadow: 0 8px 24px #ffd6e6, 0 0 0 4px #ffe0f3;
  filter: brightness(1.08);
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
.qr-btn:active {
  transform: scale(0.97);
  filter: brightness(0.97);
}
.qr-preview {
  margin-top: 1.2em;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.qr-img {
  width: 240px;
  height: 240px;
  border-radius: 18px;
  box-shadow: 0 2px 12px #ffe0f3;
  background: #fff0f7;
  border: 2px solid #ffb3c6;
  margin-bottom: 0.5em;
}
.download-btn {
  margin-top: 0.5em;
  background: linear-gradient(90deg, #b5eaff 0%, #ffb3c6 100%);
  color: #ff7eb9;
  font-size: 1em;
  border-radius: 14px;
  padding: 0.5em 1.2em;
}
.download-btn:hover {
  filter: brightness(1.08);
  box-shadow: 0 8px 24px #ffd6e6, 0 0 0 4px #ffe0f3;
}
.download-btn:active {
  filter: brightness(0.97);
}
.qr-tip {
  color: #bfa2e6;
  margin-top: 2em;
  font-size: 1.1em;
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
  .qr-container {
    width: calc(100vw - 12px);
    max-width: 99vw;
    min-height: 80vw;
    border-radius: 14px;
    padding: 12px 4px 10px 4px;
    margin: 10px auto 0 auto;
    box-sizing: border-box;
  }
  .qr-title {
    font-size: 1.2em;
  }
  .qr-img {
    width: 140px;
    height: 140px;
    border-radius: 10px;
  }
  .qr-input {
    font-size: 1em;
    padding: 0.5em 0.7em;
    width: 100%;
    min-width: 0;
  }
  .qr-textarea {
    min-height: 2.5em;
    max-height: 8em;
  }
  .qr-btn {
    font-size: 1em;
    border-radius: 12px;
    padding: 0.5em 0.7em;
  }
  .qr-style-select {
    font-size: 0.95em;
    border-radius: 10px;
    padding: 0.3em 0.7em;
  }
  .qr-form-row {
    flex-direction: column;
    gap: 0.5em;
  }
  .qr-form-row-align {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
