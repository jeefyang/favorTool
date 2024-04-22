import initSqlJs from "sql.js"
import { type folderType } from "./type.d"

function uint8arrayToBase64(u8Arr: Uint8Array) {
    let CHUNK_SIZE = 0x8000; //arbitrary number
    let index = 0;
    let length = u8Arr.length;
    let result = '';
    let slice;
    while (index < length) {
        slice = u8Arr.subarray(index, Math.min(index + CHUNK_SIZE, length));
        result += String.fromCharCode.apply(null, slice);
        index += CHUNK_SIZE;
    }
    // web image base64图片格式: "data:image/png;base64," + b64encoded;
    // return  "data:image/png;base64," + btoa(result);
    return btoa(result);
}

const rebuildBookmarks = (data: folderType, books, imgdblist, urldblist) => {
    for (let i = 0; i < books.children.length; i++) {
        let c = books.children[i]
        // 文件夹
        if (c.children) {
            let d: folderType = {
                type: "folder",
                name: c.title,
                children: []
            }
            if (!data.children) {
                data.children = []
            }
            data.children.push(d)
            rebuildBookmarks(d, c, imgdblist, urldblist)
            continue
        }
        // console.log(c.id, c.title, c.url)
        let dburl = urldblist.find(d => d[1] == c.url)
        let base64 = ""
        try {
            let dbimg = imgdblist.find(d => d[1] == dburl[2])
            base64 = `data:image/jpeg;base64,${uint8arrayToBase64(dbimg[3])}`
        }
        catch {
            console.warn("无法找到图标", [c.id, c.title, c.url])
        }
        let d: folderType = {
            type: "url",
            icon: base64,
            url: c.url,
            name: c.title
        }
        if (!data.children) {
            data.children = []
        }
        data.children.push(d)

    }
}

export const getbookmarks = async (dbfile: string) => {

    let data: folderType = {
        name: "收藏夹栏",
        type: "folder",
        children: []
    }
    console.log(data)
    const bookmarks = await chrome.bookmarks.getTree()
    if (!bookmarks || !bookmarks[0].children) {
        return data
    }
    let books = bookmarks[0].children[0]

    const sqlPromise = initSqlJs({
        locateFile: file => `https://sql.js.org/dist/${file}`
    });
    const dataPromise = fetch(dbfile).then(s => s.arrayBuffer())
    const [SQL, buf] = await Promise.all([sqlPromise, dataPromise])
    const db = new SQL.Database(new Uint8Array(buf));
    const imgcontents = db.exec("SELECT * FROM favicon_bitmaps");
    const urlcontents = db.exec("SELECT * FROM icon_mapping");
    // const row = stmt.getAsObject();
    console.log(books)
    console.log(imgcontents[0].columns)
    console.log(imgcontents[0].values)
    console.log(urlcontents[0].columns)
    console.log(urlcontents[0].values)
    console.log(books)
    rebuildBookmarks(data, books, imgcontents[0].values, urlcontents[0].values)
    return data
}

export const toBinary = (str: string) => {
    var result: number[] = [];
    for (var i = 0; i < str.length; i++) {
        result.push(str.charCodeAt(i));
    }
    return result
}