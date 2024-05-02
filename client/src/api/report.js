import axios from '../lib/axios.js';

// 신고내역 조회
export async function getReport(id) {
    const res = await axios.get(`/report/myreport/${id}`);
    
    if (res.statusText !== "OK") {
        throw new Error("신고내역 조회 실패");
    }
    const body = res.data;
    return body;
}

// 신고내역 추가
export async function addReport(reportForm) {
    const { category, user_id, target_id, content } = reportForm;
    console.log(reportForm)

    const res = await axios.post('/report', {
        category, user_id, target_id, content
    });

    if (res.statusText !== "OK") {
        throw new Error("신고내역 추가 실패");
    }

    const body = res.data;
    return body;
}

// 신고내역 해결 처리
export async function editReport(id) {
    let url = `/report/${id}`;
    const res = await axios.get(url);

    if (res.statusText !== "OK") {
        throw new Error("신고내역 수정 실패");
    }
    
    const body = res.data;
    return body;
}

