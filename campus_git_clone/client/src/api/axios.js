import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:5000', // Adjust if backend runs on different port
});

export default instance;
