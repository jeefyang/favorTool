<script setup lang="ts">
// import HelloWorld from './components/HelloWorld.vue'

// import sqlite from "sqlite3"
// import initSqlJs from "./sql-wasm"

import { ref, onMounted } from "vue"



const getUrl = (u: string) => {
  return `file:///C:/Users/${u}/AppData/Local/Microsoft/Edge/User Data/Default/Favicons`
}

const getfilename = () => {
  let date = new Date()
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  return `favorites_${year}_${month}_${day}.json`
}

const updateFilename = async (v: boolean) => {
  if (v) {
    fixUploadFilename.value = fixUploadFilenameCache.value
  }
  if (!fixUploadFilename.value) {
    uploadFilename.value = getfilename()
    return uploadFilename.value
  }
  else {
    uploadFilename.value = `${fixUploadFilename.value}.json`
  }
  if (v) {
    await saveLocalStorage()
  }
  return uploadFilename.value
}

const user = ref("administrator")
const iconUrl = ref(getUrl(user.value))
const uploadUrl = ref("")
const msg = ref("当前状态")
const uploadFilename = ref(getfilename())
const fixUploadFilenameCache = ref("")
const fixUploadFilename = ref("")

const saveLocalStorage = async () => {
  console.log("xxxx")
  await chrome.storage.local.set({
    user: user.value,
    iconUrl: iconUrl.value,
    uploadUrl: uploadUrl.value,
    fixUploadFilename: fixUploadFilename.value

  })
  return
}

const loadLocalStorage = async () => {
  let storage = await chrome.storage.local.get(['user', 'iconUrl', "uploadUrl", "fixUploadFilename"])
  console.log(storage)
  if (storage.user != undefined) {
    user.value = storage.user
  }
  if (storage.iconUrl != undefined) {
    iconUrl.value = storage.iconUrl
  }
  if (storage.uploadUrl != undefined) {
    uploadUrl.value = storage.uploadUrl
  }
  if (storage.fixUploadFilename != undefined) {
    fixUploadFilenameCache.value = storage.fixUploadFilename
    fixUploadFilename.value = storage.fixUploadFilename
  }

  await updateFilename(false)

  return
}

onMounted(async () => {

  await loadLocalStorage()
  return
})

let port = chrome.runtime.connect({ name: "updateload" })

const testUser = async () => {
  let url = getUrl(user.value)

  try {
    await fetch(url)
    msg.value = `用户名:${user.value}的图标路径存在`

  }
  catch {
    msg.value = `用户名:${user.value}的图标路径不存在!!!`
  }
}

const userUpdateIconUrl = async () => {
  let url = getUrl(user.value)
  iconUrl.value = url
  await saveLocalStorage()
  msg.value = `图片路径更新成功\n${url}`
}

const updateUpload = async () => {
  msg.value = "开始执行程序!"
  let name = await updateFilename(false)
  msg.value = `${name} 文件已经生成,开始上传!`
  port.postMessage({ type: "upload", uploadUrl: uploadUrl.value, name: name, dbfile: iconUrl.value })
msg.value = `${name} 文件正在上传!`
}

// const ontest = () => {
//   port.postMessage({ type: "test" })
// }

port.onMessage.addListener((m) => {

  msg.value = m
})

</script>

<template>
  <div>
    <div>用户名:</div>
    <input type="text" v-model="user">
  </div>
  <div>
    <div>图标db路径:</div>
    <input type="text" v-model="iconUrl">
  </div>
  <div>
    <button @click="testUser">用户名测试</button>
  </div>
  <div>
    <button @click="userUpdateIconUrl">用户名更新图标路径</button>
  </div>
  <div>上传文件名称:</div>
  <div>
    <input type="text" v-model="fixUploadFilenameCache" @change="updateFilename(true)">
  </div>
  <div>{{ uploadFilename }}</div>
  <div>
    <div>上传外网路径:</div>
    <input type="text" v-model="uploadUrl" @change="saveLocalStorage">
  </div>
  <div>
    <button @click="updateUpload">更新上传</button>
    <!-- <button @click="ontest">测试</button> -->
  </div>
  <div>{{ msg }}</div>
</template>

<style scoped>
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

div {
  white-space: pre-line;
}
</style>
