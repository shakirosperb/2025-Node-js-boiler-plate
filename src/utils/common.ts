import { Obj } from "@/interface/common";

// to convert time to number (seconds)
const timeToNumber = (time: string): Number => {
    let sec = 0, min = 0, hr = 0;
    let splitArr = time.split(":")
    if (splitArr.length > 1) {
        hr = parseInt(splitArr[0])
        min = parseInt(splitArr[1])
        sec = splitArr[2] ? parseInt(splitArr[2]) : 0
    } else {
        sec = parseInt(splitArr[0])
    }
    hr = hr * 60 * 60
    min = 60 * min
    sec = sec
    return hr + min + sec
}
const isObjectEmpty = (obj: Obj) => obj && Object.keys(obj).length === 0 && obj.constructor === Object;
const uniqueId=():string=>{
    let now=Date.now()
   let min = Math.ceil(1000);
    let max = Math.floor(999999);
    return now.toString(16)+Math.floor(Math.random() * (max - min + 1) + min).toString(16)
}
export {
    timeToNumber,
    isObjectEmpty,
    uniqueId
}