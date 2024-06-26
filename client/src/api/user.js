import axios from '../lib/axios.js';
import REGEX from '../lib/regex.js';

// 특정 사용자 조회
export async function getUserInfo(userId) {
    try {
        const res = await axios.get(`/user/${userId}`);
    
        if (res.statusText !== "OK") {
            window.location.href = '/error/500';
        }
        const body = res.data;
    
        return body;    
    } catch (error) {
        window.location.href = '/error/500';
    }
}

// 특정 사용자의 판매목록 조회
export async function getUserProductAll(userId, filter) {
    const { sold, category_id } = filter;
    
    let isSold;
    if (sold === true || sold === 'true') {
        isSold = 'NOT NULL';
    } else {
        isSold = 'NULL';
    }    

    let url = `/user/${userId}/productAll?sold=${isSold}&category_id=${category_id}`;

    try {
        const res = await axios.get(url);

        if (res.statusText !== "OK") {
            window.location.href = '/error/500';
        }
        // res.data는 배열
        const body = res.data[0].total;
    
        return body;    
    } catch (error) {
        window.location.href = '/error/500';
    }
}

// 특정 사용자의 판매목록 조회 
export async function getUserProductList(userId, limit, offset, order, filter) {
    const { name, ascend } = order;
    const { sold, category_id } = filter;

    let newName = REGEX.CHAR_REG.test(name) ? name.trim() : 'createdAt';

    let isSold;
    if (sold === true || sold === 'true') {
        isSold = 'NOT NULL';
    } else {
        isSold = 'NULL';
    }

    let url = `/user/${userId}/product?sold=${isSold}&category_id=${category_id}&limit=${limit}&offset=${offset}&name=${newName}&ascend=${ascend}`;

    try {
        const res = await axios.get(url);

        if (res.statusText !== "OK") {
            window.location.href = '/error/500';
        }
        const body = res.data;
    
        return body;
    } catch (error) {
        window.location.href = '/error/500';
    }
}

// 특정 사용자의 review 조회
export async function getUserReviewAll(userId, buyOrSell) {
    let url = `/user/${userId}/reviewAll?type=${buyOrSell}`;
    
    try {
        const res = await axios.get(url);

        if (res.statusText !== "OK") {
            window.location.href = '/error/500';
        }
        
        const body = res.data.total;
        return body;
    } catch (error) {
        window.location.href = '/error/500';
    }
}

// 특정 판매자의 상품에 대한 review 조회
export async function getUserReviewList(userId, buyOrSell, limit, offset, order) {
    const { name, ascend } = order;
    
    let newName = REGEX.CHAR_REG.test(name) ? name.trim() : 'createdAt';

    let url = `/user/${userId}/review?type=${buyOrSell}&limit=${limit}&offset=${offset}&name=${newName}&ascend=${ascend}`;
    
    try {
        const res = await axios.get(url);
    
        if (res.statusText !== "OK") {
            window.location.href = '/error/500';
        }
        const body = res.data;
        return body;
    } catch (error) {
        window.location.href = '/error/500';
    }
}

// 특정 판매자에 대한 review와 review tag 전체 수 조회
export async function getUserReviewTagTotal(userId) {
    let url = `/user/${userId}/reviewTagTotal`;
    
    try {
        const res = await axios.get(url);
    
        if (res.statusText !== "OK") {
            window.location.href = '/error/500';
        }
        const body = res.data;
        return body;
    } catch (error) {
        window.location.href = '/error/500';
    }
}

// 특정 판매자에 대한 review와 review tag 조회
export async function getUserReviewTag(userId, limit, offset) {
    let url = `/user/${userId}/reviewtag?limit=${limit}&offset=${offset}`;

    try {
        const res = await axios.get(url);
    
        if (res.statusText !== "OK") {
            window.location.href = '/error/500';
        }
        const body = res.data;
        return body;
    } catch (error) {
        window.location.href = '/error/500';
    }
}