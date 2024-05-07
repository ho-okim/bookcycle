// sql injection 방지용

// 문자, 숫자, _만 허용
const CHAR_REG = /^[\w]*$/;

module.exports = { CHAR_REG };