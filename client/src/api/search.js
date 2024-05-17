import axios from '../lib/axios.js';

// 상품 검색
export async function searchProduct(keyword) {
    const res = await axios.get(`/search/product?keyword=${keyword}`);

    if (res.statusText !== 'OK') {
        window.location.href = '/error/500';
    }

    const body = res.data;
    return body;
}

// 사용자 검색
export async function searchUser(keyword) {
    const res = await axios.get(`/search/user?keyword=${keyword}`);

    if (res.statusText !== 'OK') {
        window.location.href = '/error/500';
    }

    const body = res.data;
    return body;
}

// 게시판 검색
export async function searchBoard(keyword) {
    const res = await axios.get(`/search/board?keyword=${keyword}`);

    if (res.statusText !== 'OK') {
        window.location.href = '/error/500';
    }
    const body = res.data;
    return body;
}