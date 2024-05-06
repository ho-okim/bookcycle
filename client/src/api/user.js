import axios from '../lib/axios.js';

// 특정 사용자 조회
export async function getUserInfo(userId) {
    const res = await axios.get(`/user/${userId}`);
    
    if (res.statusText !== "OK") {
        throw new Error("사용자정보 조회 실패");
    }
    const body = res.data;
    return body;
}

// 특정 사용자의 판매목록 조회
export async function getUserProductAll(userId, filter) {
    const { sold, category_id } = filter;
    
    let isSold;
    if (sold === true || sold === 'true') {
        isSold = 1;
    } else if (sold === false || sold === 'false') {
        isSold = 0;
    } else {
        isSold = 'null';
    }    

    let url = `/user/${userId}/productAll?sold=${isSold}&category_id=${category_id}`;
    const res = await axios.get(url);

    if (res.statusText !== "OK") {
        throw new Error("판매목록 조회 실패");
    }
    // res.data는 배열
    const body = res.data[0].total;

    return body;
}

// 특정 사용자의 판매목록 조회 
export async function getUserProductList(userId, limit, offset, order, filter) {
    const { name, ascend } = order;
    const { sold, category_id } = filter;
    
    let isSold;
    if (sold === true || sold === 'true') {
        isSold = 1;
    } else if (sold === false || sold === 'false') {
        isSold = 0;
    } else {
        isSold = 'null';
    }

    let url = `/user/${userId}/product?sold=${isSold}&category_id=${category_id}&limit=${limit}&offset=${offset}&name=${name}&ascend=${ascend}`;

    const res = await axios.get(url);

    if (res.statusText !== "OK") {
        throw new Error("판매목록 조회 실패");
    }
    const body = res.data;

    return body;
}

// 특정 사용자의 상품에 대한 review 조회
export async function getUserReviewAll(userId) {
    let url = `/user/${userId}/reviewAll`;
    const res = await axios.get(url);

    if (res.statusText !== "OK") {
        throw new Error("구매후기 조회 실패");
    }
    // res.data는 배열
    const body = res.data[0].total;

    return body;
}

// 특정 판매자의 상품에 대한 review 조회
export async function getUserReviewList(userId, limit, offset, order) {
    const { name, ascend } = order;
    let url = `/user/${userId}/review?limit=${limit}&offset=${offset}&name=${name}&ascend=${ascend}`;
    const res = await axios.get(url);
    
    if (res.statusText !== "OK") {
        throw new Error("구매후기 조회 실패");
    }
    const body = res.data;
    return body;
}

// 특정 판매자에 대한 review와 review tag 전체 수 조회
export async function getUserReviewTagTotal(userId) {
    let url = `/user/${userId}/reviewTagTotal`;
    const res = await axios.get(url);
    
    if (res.statusText !== "OK") {
        throw new Error("리뷰 조회 실패");
    }
    const body = res.data;
    return body;
}

// 특정 판매자에 대한 review와 review tag 조회
export async function getUserReviewTag(userId, limit, offset) {
    let url = `/user/${userId}/reviewtag?limit=${limit}&offset=${offset}`;

    const res = await axios.get(url);
    
    if (res.statusText !== "OK") {
        throw new Error("리뷰 조회 실패");
    }
    const body = res.data;
    return body;
}