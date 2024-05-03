import axios from '../lib/axios.js';

// 신고내역 조회
export async function getReport() {
    try {
        const res = await axios.get(`/report/myreport/`);

        if (res.statusText !== "OK") {
            throw new Error("신고내역 조회 실패");
        }
        const body = res.data;
        return body;
    } catch (error) {
        if (error.response.status == 403) {
            throw new Error("login needed");
        } else if (error.response.status == 401) {
            throw new Error("not allowed");
        } else {
            throw error;
        }
    }
}

// 신고내역 추가
export async function addReport(reportForm) {
    try {
        const { category, user_id, target_id, content, ownerId } = reportForm;

        const res = await axios.post('/report', {
            category, user_id, target_id, content, ownerId
        });
    
        if (res.statusText !== "OK") {
            throw new Error("신고내역 추가 실패");
        }
    
        const body = res.data;
        return body;
    } catch (error) {
        if (error.response.status == 403) {
            throw new Error("login needed");
        } else {
            throw error;
        }
    }
}

// 신고내역 해결 처리
export async function editReport(id) {
    try {
        let url = `/report/${id}`;
        const res = await axios.get(url);
    
        if (res.statusText !== "OK") {
            throw new Error("신고내역 수정 실패");
        }
        
        const body = res.data;
        return body;
    } catch (error) {
        if (error.response.status == 403) {
            throw new Error("login needed");
        } else if (error.response.status == 401) {
            throw new Error("not allowed");
        } else {
            throw error;
        }
    }
}

