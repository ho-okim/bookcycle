import axios from '../lib/axios.js';


export async function mypage(email, password) {
    const res = await axios.get('/mypage/1');
    
    if (res.statusText !== "OK") {
        throw new Error("mypage 로딩 실패");
    }
    const body = res.data;
    console.log('hi')
    console.log(body)
    return body;
}

export async function buyList(email, password) {
    const res = await axios.get('/getProductAll');
    
    if (res.statusText !== "OK") {
        throw new Error("mypage 로딩 실패");
    }
    const body = res.data;
    return body;
}