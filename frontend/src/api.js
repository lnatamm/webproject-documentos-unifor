import axios from 'axios';

//Create an axios instance with a base URL
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

export default api;