import axios from '../lib/axios.js';

export async function chatList(){
    const res = await axios.get('/board')

    if (res.statusText != "OK") {
        throw new Error("get fails");
    } 
    const body = res.data;
    return body;
}

export async function boardWrite(title, content) {
    const res = await axios.post('/boardwrite', { title, content });
    
    if (res.statusText != "OK") {
        throw new Error("post fails");
    } 
    const body = res.data;
    body.message = 'success'
    
    return body;
}