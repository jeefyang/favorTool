// import sqlite from "sqlite3"
import { getbookmarks } from "./bookmarks"
/** 上传文件 */
const updateUpload = async (uploadUrl: string, name: string, dbfile: string) => {
    let data = await getbookmarks(dbfile)
    let str = JSON.stringify(data)
    const fileContent = new File([str], name, { type: "" })
    console.log(data)
    const formdata = new FormData()
    formdata.append("file", fileContent)
    const request = new Request(`${uploadUrl}upload?forcefilename=${encodeURI(name)}`, {
        method: "POST",
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        body: formdata
    })
    await fetch(request)
    return true
}

chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((err: any) => console.log(err))
// console.log("xx")
chrome.runtime.onMessage.addListener((req, _sender, sendRes) => {
    // const { action, payload } = req
    console.log(req)
    sendRes("content got!")
})
chrome.runtime.onConnect.addListener((port) => {
    console.log(port)
    if (port.name == "updateload") {
        port.onMessage.addListener(async msg => {
            console.log(msg)
            if (msg.type == "upload") {
                await updateUpload(msg.uploadUrl, msg.name, msg.dbfile)
                port.postMessage(`${new Date(new Date().getTime())}\n收藏夹上传成功`)
            }
            else if (msg.type == "test") {
                let books = await chrome.bookmarks.getTree()
                console.log(books?.[0]?.children?.[0])
            }
            // console.log(a)
        })

    }
    port.onDisconnect.addListener(_msg => {
        console.log("close")
    })
})
