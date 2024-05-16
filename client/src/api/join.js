import axios from '../lib/axios.js';

// 이메일 중복체크
export async function email_check(email) {
    try {
        const encodedEmail = encodeURIComponent(email);

        const url = `/email?email=${encodedEmail}`;
        
        const res = await axios.get(url);

        if (res.statusText != "OK") {
            window.location.href = '/error/500';
        }
        const body = res.data[0].size;
        return body;
    } catch (error) {
        if (error.response.status == 403) {
            window.location.href = '/error/403';
        } else {
            window.location.href = '/error/500';
        }
    }
}

// 회원가입
export async function join(formData) {
    let { email, password, username, nickname, phone_number } = formData;
    email = email.trim();
    username = username.trim();
    nickname = nickname.trim();
    phone_number = phone_number.trim().replaceAll('-', '');

    let email_length = email.length <= 50 ? true : false;
    let password_length = password.length <= 13 ? true : false;
    let username_length = username.length <= 13 ? true : false;
    let nickname_length = nickname.length <= 13 ? true : false;
    let phone_number_length = phone_number.length <= 13 ? true : false;

    if (email_length && password_length && username_length && nickname_length && phone_number_length) {
        try {
            const res = await axios.post('/join', {
                email, password, username, nickname, phone_number
            });
        
            if (res.statusText != "OK") {
                window.location.href = '/error/500';
            }

            const body = res.data;
            return body;
        } catch (error) {
            if (error.response.status == 403) {
                window.location.href = '/error/403';
            } else {
                window.location.href = '/error/500';
            }
        }
    } else {
        return('error');
    }
}
