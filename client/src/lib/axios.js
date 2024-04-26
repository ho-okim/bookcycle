// src/lib/axios.js
import axios from 'axios';
axios.defaults.withCredentials = true

const instance = axios.create({
    baseURL : `http://localhost:10000`
});

export default instance;