import axios from '../lib/axios.js';

// 신고내역 조회
export async function getReport(id) {
    const res = await axios.get(`/report/${id}`);
    
    if (res.statusText !== "OK") {
        throw new Error("신고내역 조회 실패");
    }
    const body = res.data;
    return body;
}

// 신고내역 추가
export async function addReport({
        category_id, 
        user_id, 
        target_id, 
        content
    }) 
    {
    const res = await axios.post('/report', {
        category_id, user_id, target_id, content
    });

    if (res.statusText !== "OK") {
        throw new Error("신고내역 추가 실패");
    }

    const body = res.data;
    return body;
}

// 특정 사용자의 판매목록 조회
export async function editReport(id) {
    let url = `/report/${id}`;
    const res = await axios.get(url);

    if (res.statusText !== "OK") {
        throw new Error("신고내역 수정 실패");
    }
    
    const body = res.data;
    return body;
}

