import axios from 'axios';


const baseURL = import.meta.env.VITE_API_BASE_URL;

const axiosClient = axios.create({
  baseURL,
});

axiosClient.interceptors.response.use((response) => response, (error) => {
  throw error;
});

export default axiosClient;