// sanitize-html : XSS 공격을 막기 위한 패키지
const sanitizeHtml = require('sanitize-html');

// 문자열, 객체, 배열이 들어오면 sanitize(소독)을 진행하는 함수
const sanitizeObject = (obj) => {
    if (typeof obj === 'string') { // 문자열
        return sanitizeHtml(obj);
    } else if (Array.isArray(obj)) { // 배열
        return obj.map(item=>sanitizeHtml(item));
    } else if (typeof obj === 'object' && obj !== null) { // 객체
        // 해당 객체의 모든 열거 가능한 properties를 순회
        for(let prop in obj) {
            if(obj.hasOwnProperty(prop)) { // 객체 자신의 속성만 검사
                obj[prop] = sanitizeHtml(obj[prop]);
            }
        }
    }
    return obj;
}

// sanitize middleware
exports.sanitizeMiddleware = (req, res, next) => {
    if (req.query) { // req.query sanitize
        req.query = sanitizeObject(req.query);
    }

    if (req.params) { // req.params sanitize
        req.params = sanitizeObject(req.params);
    }

    if (req.body) { // req.body sanitize
        req.body = sanitizeObject(req.body);
    }

    next();
}
