import axios from '../lib/axios.js';

// 특정 사용자 조회
export async function getUserInfo(user_id) {
    const res = await axios.get(`/user/${user_id}`);
    
    if (res.statusText !== "OK") {
        throw new Error("사용자정보 조회 실패");
    }
    const body = res.data;
    return body;
}

// 특정 사용자의 판매목록 조회
export async function getUserProductList(user_id) {
    const res = await axios.get(`/user/product/${user_id}`);

    if (res.statusText !== "OK") {
        throw new Error("판매목록 조회 실패");
    }
    const body = res.data;

    return body;
}

// 특정 판매자의 상품에 대한 review 조회
export async function getUserReviewList(user_id) {
    const res = await axios.get(`/user/review/${user_id}`);
    
    if (res.statusText !== "OK") {
        throw new Error("구매후기 조회 실패");
    }
    const body = res.data;
    return body;
}

// 특정 판매자에 대한 review와 review tag 조회
export async function getUserReviewTag(user_id) {
    const res = await axios.get(`/user/reviewtag/${user_id}`);
    
    if (res.statusText !== "OK") {
        throw new Error("리뷰 조회 실패");
    }
    const body = res.data;
    return body;
}

