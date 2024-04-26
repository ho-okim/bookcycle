import axios from '../lib/axios.js';

export async function login(email, password) {
    const res = await axios.post('/login', { email, password });
    
    if (res.statusText !== "OK") {
        throw new Error("로그인 실패");
    }
    const body = res.data;
    return body;
}

export async function getLoginUser() {
  const res = await axios.get('/getLoginUser');
  
  if (res.statusText !== "OK") {
      throw new Error("로그인 유저 정보 담기 실패");
  }
  
  const body = res.data;
  console.log(body)
  return body;
}