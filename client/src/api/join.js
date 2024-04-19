import axios from '../lib/axios.js';

// 이메일 중복체크
export async function email_check(email) {
    const url = `/email?email=${email}`;
    const res = await axios.get(url);
    
    if (res.statusText != "OK") {
        throw new Error("DB에 email 조회 실패");
    }
    const body = res.data.length;
    return body;
}

// 회원가입
export async function join({
        email, 
        password, 
        username, 
        nickname, 
        phone_number, 
        profile_image, 
        verification
    }) 
    {

    const res = await axios.post('/join', {
        email, password, username, nickname, phone_number, profile_image, verification
    });
    
    if (res.statusText != "OK") {
        throw new Error("회원가입 실패");
    }
    
    const body = res.data;
    return body;
}

