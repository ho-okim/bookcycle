import axios from '../lib/axios.js';

export async function board(){
    const res = await axios.get('/board')

    if (res.statusText != "OK") {
        throw new Error("get fails");
    } 
    const body = res.data;
    return body;
}

export async function boardWrite(title, content) {
    const res = await axios.post('/boardWrite', { title, content });
    
    if (res.statusText != "OK") {
        throw new Error("post fails");
    } 
    const body = res.data;
    return body;
}

export async function boardDetail(id){
    
    const res = await axios.get(`board/${id}`)

    if (res.statusText != "OK") {
        throw new Error("getDetail fails");
    } 
    const body = res.data;
    // console.log(body)
    return body;
}


