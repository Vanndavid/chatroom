import axios from 'axios';

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // e.g. http://chat.localhost/api
  timeout: 10000,
});

http.interceptors.request.use(config => {
  const token = localStorage.getItem('token'); // if you add auth later
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

http.interceptors.response.use(
  res => res,
  err => Promise.reject(err)
);

export default http;
