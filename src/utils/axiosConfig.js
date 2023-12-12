import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000', // Reemplaza con la URL de tu servidor Flask
  timeout: 10000, // Tiempo máximo de espera
});

export default axiosInstance;