import axios from "axios";
// create an axios instance
const service = axios.create({
  baseURL: "/",
  timeout: 60000,
});

// request interceptor
service.interceptors.request.use(
  // request success
  (config) => {
    return config;
  },
  // request fail
  (error) => {
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  // response success
  (response) => {
    return response.data;
  },
  // response fail
  (error) => {
    return Promise.reject(error);
  }
);

export default service;
