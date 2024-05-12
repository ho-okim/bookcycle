import axios from '../lib/axios.js';
import REGEX from '../lib/regex.js';
import { email_check } from './join.js';

// 로그인
export async function login(email, password) {

    // 잘못 넘어온 값 처리
    // let newEmail = REGEX.EMAIL_REG.test(email) ? email : null;
    // let newPwd = REGEX.PASSWORD_REG.test(password) ? password : null;

    const res = await axios.post('/login', { email, password });
    
    if (res.statusText !== "OK") {
        throw new Error("로그인 실패");
    }
    const body = res.data;
    return body;
}

// 현재 로그인한 사용자 가져오기
export async function getLoginUser() {
    try {
        const res = await axios.get('/getLoginUser');

        if (res.statusText !== "OK") {
            throw new Error("로그인 유저 정보 담기 실패");
        }
    
        const body = res.data;
        return body;
    } catch (error) {
        if (error.response.status == 403) {
            console.error('로그인 후 사용 가능');
        } else {
            throw error;
        }
    }
}

// 로그아웃
export async function logout() {
    try {
        const res = await axios.get("/logout");
        const body = res.data;
        return body;
    } catch (error) {
        throw error;
    }
}

// 비번찾기
export async function findpwd(email) {
    try {
        const res = await email_check(email);
        
        if (res === 0) {
            return JSON.stringify({ message : 'no email' });
        } else if (res === 1) {
            try {
                const encodedEmail = encodeURIComponent(email);

                const res = await axios.get(`/password/sendEmail?email=${encodedEmail}`);
                
                if (res.statusText !== "OK") {
                    throw new Error("내부 서버 에러");
                }
                return 'send';
            } catch (error) {
                if (error.response.status == 403) {
                    throw new Error("already logged in");
                } else {
                    throw error;
                }
            }
        } else {
            return JSON.stringify({ message : 'error' });
        }
    } catch (error) {
        if (error.response.status == 403) {
            throw new Error("already logged in");
        } else if (error.response.status == 500) {
            throw new Error("server error");
        } else {
            throw error;
        }
    }
}

// 비번 초기화
export async function resetpwd(formData) {
    const { email, password } = formData;
    
    let password_length = password.length <= 13 ? true : false;
    
    if (password_length) {
        try {
            const res = await axios.post('/password/reset', { email, password });
            
            if (res.statusText != "OK") {
                throw new Error("비밀번호 초기화 실패");
            }

            const body = res.data;
            return body;
        } catch (error) {
            if (error.response.status == 403) {
                throw new Error("already logged in");
            } else if (error.response.status == 400) {
                throw new Error("request failed");
            } else {
                throw error;
            }
        }
    } else {
        return('error');
    }
}