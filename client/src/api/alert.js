import axios from '../lib/axios.js';

// 내 알림 전체 가져오기
export async function getNotification() {

    try {
        const res = await axios.get('/alert');
    
        if (res.statusText !== "OK") {
            window.location.href = '/error/500';
        }

        const body = res.data;

        const unread = body.filter((el)=>(el.read_or_not === 0));
        return {result : body, unread : unread.length };
    }  catch (error) {
        if (error.response.status === 403) {
            window.location.href = '/login';
        } else if (error.response.status === 401) {
            window.location.href = '/error/401';
        } else {
            window.location.href = '/error/500';
        }
    }
}

// 내 알림 최신순 10개 가져오기
export async function getShortNotification() {

    try {
        const res = await axios.get('/alert/short');
    
        if (res.statusText !== "OK") {
            window.location.href = '/error/500';
        }

        const body = res.data;
        return body;
    }  catch (error) {
        if (error.response.status === 403) {
            window.location.href = '/login';
        } else if (error.response.status === 401) {
            window.location.href = '/error/401';
        } else {
            window.location.href = '/error/500';
        }
    }
}

// 알림 읽음
export async function readNotification(id) {

    try {
        const res = await axios.put(`/alert/read/${id}`);

        if (res.statusText !== "OK") {
            window.location.href = '/error/500';
        }
        const body = res.data;
        return body;
    } catch (error) {
        if (error.response.status === 403) {
            window.location.href = '/login';
        } else if (error.response.status === 401) {
            window.location.href = '/error/401';
        } else {
            throw Error(error)
            //window.location.href = '/error/500';
        }
    }
}