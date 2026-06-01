import axios from 'axios';
import Config from 'react-native-config';

const instance = axios.create({
  baseURL: Config.API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use((config) => {
  // TODO: 인증 토큰 주입 로직 구현
  // const token = await getToken();
  // if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // TODO: 공통 에러 핸들링 (401 토큰 만료, 네트워크 에러 등)
    return Promise.reject(error);
  },
);

export default instance;
