require('dotenv').config();
const { configDotenv } = require('dotenv');
const { PASSWORD_REG } = require('../lib/regex_server');

// 랜덤 비밀번호 형식 인증문자 생성
function generateRandomString(type) { // 매개변수로 이메일 인증인지 비밀번호 인증인지 받음
    const passwordVerify = process.env.EMAIL_SALT; // 이메일 인증용 salt
    const emailVerify = process.env.PASSWORD_SALT; // 비밀번호 인증용 salt
    const pallete = '9876543210abcdeABCDEfghijpqrstuvwSTUVWXxyzFGHIJKklmnoLMNOPQRYZ!@#$%^&()_~[]';
    const pwdLength = 13;

    let result = '';

    while (!PASSWORD_REG.test(result)) {
        result = '';
        for (let i = 0; i < pwdLength; i++) {
            result += pallete.charAt(Math.random()*(pallete.length-1));
        }
    }
    //console.log(`final result : ${result}`);
    if (type === 'email') {
        result += emailVerify;
    } else if (type === 'password') {
        result += passwordVerify;
    }
    //console.log(`type salt result : ${type} ${result}`);
    return result;
}

module.exports = generateRandomString;