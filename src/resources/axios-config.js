import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://api.wysi727.com/',
});

instance.defaults.withCredentials = true;

export default instance;
