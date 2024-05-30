import axios from '../lib/axios.js';

// 상품 검색 - 20개 제한
export async function searchProduct(keyword) {
    try {
        const res = await axios.get(`/search/product?keyword=${keyword}`);

        if (res.statusText !== 'OK') {
            window.location.href = '/error/500';
        }
    
        const body = res.data;
        return body;    
    } catch (error) {
        window.location.href = '/error/500';
    }
}

// 사용자 검색
export async function searchUser(keyword) {
    try {
        const res = await axios.get(`/search/user?keyword=${keyword}`);

        if (res.statusText !== 'OK') {
            window.location.href = '/error/500';
        }
    
        const body = res.data;
        return body;    
    } catch (error) {
        window.location.href = '/error/500';
    }
}

// 게시판 검색
export async function searchBoard(keyword) {
    try {
        const res = await axios.get(`/search/board?keyword=${keyword}`);

        if (res.statusText !== 'OK') {
            window.location.href = '/error/500';
        }
        const body = res.data;
        return body;    
    } catch (error) {
        window.location.href = '/error/500';
    }
}