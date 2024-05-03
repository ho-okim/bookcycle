// src/lib/axios.js
import axios from 'axios';
axios.defaults.withCredentials = true; // 쿠키 공유 허용

const instance = axios.create({
    baseURL : `http://localhost:10000`
});

export default instance;