// src/lib/axios.js
import axios from 'axios';
axios.defaults.withCredentials = true; // 쿠키 공유 허용

const server = process.env.REACT_APP_SERVER_IP

const instance = axios.create({
    baseURL : `https://${server}/api/`
});

export default instance;