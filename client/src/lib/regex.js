const EMAIL_REG = /^\S+[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;

const PASSWORD_REG = /^\S+(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&()_~\[\]\\]).{8,}\S+$/;

const NAME_REG = /^[가-힣\w\d]{2,}$/;

const PHONE_REG = /^([0-9]{3}[-]+[0-9]{4}[-]+[0-9]{4})|([0-9]{3}[0-9]{4}[0-9]{4})$/;

const CHAR_REG = /^[\w]*$/;

const REGEX = {
    EMAIL_REG, PASSWORD_REG, NAME_REG, PHONE_REG, CHAR_REG
}

export default REGEX;