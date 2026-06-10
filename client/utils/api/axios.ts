import axios from "axios";
import { defaultApiRoute } from "../contants";

export const defaultAxios = axios.create({ baseURL: defaultApiRoute, withCredentials: true });

defaultAxios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('gridreply::token');

        if (token) {
            config.headers.Authorization = `Barer ${token}`;
        }

        return config;
    }
)