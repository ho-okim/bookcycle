import axios from '../lib/axios.js';

// 신고내역 조회
export async function getReport() {
    try {
        const res = await axios.get(`/report/myreport/`);

        if (res.statusText !== "OK") {
            window.location.href = '/error/500';
        }
        const body = res.data;
        return body;
    } catch (error) {
        if (error.response.status == 403) {
            window.location.href = '/login';
        } else if (error.response.status == 401) {
            window.location.href = '/error/401';
        } else {
            window.location.href = '/error/500';
        }
    }
}

// 신고 여부 확인
export async function getReportedOrNot(category, target_id) {
    try {
        let url = `/report/reported?category=${category}&target_id=${target_id}`;
        const res = await axios.get(url);

        if (res.statusText !== "OK") {
            window.location.href = '/error/500';
        }
        const body = res.data[0].size;
        return body;
    } catch (error) {
        if (error.response.status == 403) {
            window.location.href = '/login';
        } else if (error.response.status == 401) {
            window.location.href = '/error/401';
        } else {
            window.location.href = '/error/500';
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
            window.location.href = '/error/500';
        }
    
        const body = res.data;
        return body;
    } catch (error) {
        if (error.response.status == 403) {
            window.location.href = '/login';
        } else {
            window.location.href = '/error/500';
        }
    }
}

// 신고내역 해결 처리 -- 관리자 구현x
export async function editReport(id) {
    try {
        let url = `/report/${id}`;
        const res = await axios.get(url);
    
        if (res.statusText !== "OK") {
            window.location.href = '/error/500';
        }
        
        const body = res.data;
        return body;
    } catch (error) {
        if (error.response.status == 403) {
            window.location.href = '/login';
        } else if (error.response.status == 401) {
            window.location.href = '/error/401';
        } else {
            window.location.href = '/error/500';
        }
    }
}

