import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://dev.lemres.de/',
});

export default instance;