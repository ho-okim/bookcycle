// sql injection 방지용

// 문자, 숫자, _만 허용
const CHAR_REG = /^[\w]*$/;

// 비밀번호
const PASSWORD_REG = /^\S+(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&()_~\[\]\\]).{8,}\S+$/;

// 비밀번호 초기화 인증키용
const RANDOMSTR_REG = /^\S+(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&()_~\[\]\\]).{5,}\S+$/;

module.exports = { CHAR_REG, PASSWORD_REG, RANDOMSTR_REG };