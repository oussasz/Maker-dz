import axios from "axios";

// Environment variable for API URL - defaults to cPanel domain
const url = import.meta.env.VITE_API_URL || "https://maker-dz.net";

export default axios.create({
    baseURL: `${url}/api`
});

export const axiosPrivate = axios.create({
    baseURL: `${url}/api`,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});

