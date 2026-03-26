import axios from 'axios';

const API = axios.create({
  baseURL: 'https://localhost:7143/api'
});

export default API;