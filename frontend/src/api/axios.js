import axios from "axios";

// Environment variable for API URL
const url = import.meta.env.VITE_API_URL || "https://maker-app-backend-flax.vercel.app";

export default axios.create({
    baseURL: `${url}/api`
});

export const axiosPrivate = axios.create({
    baseURL: `${url}/api`,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});

