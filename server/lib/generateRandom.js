require('dotenv').config();
const { RANDOMSTR_REG } = require('./regex_server');

// 랜덤 비밀번호 형식 인증문자 생성
function generateRandomString() {
    const passwordVerify = process.env.PASSWORD_SALT; // 비밀번호 인증용 salt
    const pallete = '9876543210abcdeABCDEfghijpqrstuvwSTUVWXxyzFGHIJKklmnoLMNOPQRYZ!@#$%^&()_~[]';
    const strLength = 8;

    let result = '';

    while (!RANDOMSTR_REG.test(result)) {
        result = '';
        for (let i = 0; i < strLength; i++) {
            result += pallete.charAt(Math.random()*(pallete.length-1));
        }
    }
    return result+passwordVerify;
}

// 8자리 난수 생성 코드
function generateRandomNumber() {
    const min = 11111111;
    const max = 99999999;
    const token = Math.floor(Math.random() * (max - min + 1) + min);
    return token;
}

module.exports = {generateRandomString, generateRandomNumber};

