import axios from 'axios';

const API = axios.create({ baseURL: `${import.meta.env.VITE_API_URL}/api` });

export const registerUser = (formData) => API.post('/auth/register', formData);