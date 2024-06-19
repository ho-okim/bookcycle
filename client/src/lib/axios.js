// src/lib/axios.js
import axios from 'axios';
axios.defaults.withCredentials = true; // 쿠키 공유 허용

const server = process.env.REACT_APP_SERVER_IP;
const url = server ? `http://${server}/api/` : process.env.PROXY + '/api/';
 
const instance = axios.create({ baseURL : url });

export default instance;
