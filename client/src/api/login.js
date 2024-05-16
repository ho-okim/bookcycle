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
        window.location.href = '/error/500';
    }
    const body = res.data;
    return body;
}

// 현재 로그인한 사용자 가져오기
export async function getLoginUser() {
    try {
        const res = await axios.get('/getLoginUser');

        if (res.statusText !== "OK") {
            window.location.href = '/error/500';
        }
    
        const body = res.data;
        return body;
    } catch (error) {
        if (error.response.status == 403) {
            console.error('로그인 후 사용 가능');
        } else {
            window.location.href = '/error/500';
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
        window.location.href = '/error/500';
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
                    window.location.href = '/error/500';
                }
                return 'send';
            } catch (error) {
                if (error.response.status == 403) {
                    window.location.href = '/error/403';
                } else {
                    throw error;
                }
            }
        } else {
            return JSON.stringify({ message : 'error' });
        }
    } catch (error) {
        if (error.response.status == 403) {
            window.location.href = '/error/401';
        } else if (error.response.status == 500) {
            window.location.href = '/error/500';
        } else {
            window.location.href = '/error/500';
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
                window.location.href = '/error/500';
            }

            const body = res.data;
            return body;
        } catch (error) {
            if (error.response.status == 403) {
                window.location.href = '/error/401';
            } else if (error.response.status == 400) {
                window.location.href = '/error/400';
            } else {
                window.location.href = '/error/500';
            }
        }
    } else {
        return('error');
    }
}