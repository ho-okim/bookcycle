import axios from '../lib/axios.js';

async function login(email, password) {
    const res = await axios.post('/login', { email, password });
    
    if (res.statusText !== "OK") {
        throw new Error("로그인 실패");
    }
    const body = res.data;
    return body;
}

export default login;
