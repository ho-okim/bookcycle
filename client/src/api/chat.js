import axios from '../lib/axios.js';

export async function chatList(){
    const res = await axios.get('/chatlist')

    if (res.statusText != "OK") {
        throw new Error("chatList GET fails");
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