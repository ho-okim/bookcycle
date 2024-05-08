// sql injection 방지용

// 문자, 숫자, _만 허용
const CHAR_REG = /^[\w]*$/;

// 비번
const PASSWORD_REG = /^\S+(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&()_~\[\]\\]).{8,}\S+$/;

module.exports = { CHAR_REG, PASSWORD_REG };