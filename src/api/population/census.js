import request from "utils/request.js"


export function postHjNlData(url,data){
    return request({
        url,
        method:'post',
        data,
    })
}



