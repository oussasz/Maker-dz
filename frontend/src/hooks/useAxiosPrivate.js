import { axiosPrivate } from "../api/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "../store/authStore";

const useAxiosPrivate = () => {
    const refresh = useRefreshToken();
    const { accessToken, logout } = useAuth();

    

    useEffect(() => {
        // --- REQUEST INTERCEPTOR ---
        const requestIntercept = axiosPrivate.interceptors.request.use(
            (config) => {
                if (!config.headers["Authorization"]) {
                    config.headers["Authorization"] = `Bearer ${accessToken}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // --- RESPONSE INTERCEPTOR ---
        const responseIntercept = axiosPrivate.interceptors.response.use(
            (response) => response,
            async (error) => {
                const prevRequest = error?.config;

                // If access token is expired -> try refresh
                if (
                    error?.response?.status === 403 && 
                    !prevRequest?.sent
                ) {
                    prevRequest.sent = true;
                    try {
                        const newAccessToken = await refresh();
                        prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                        return axiosPrivate(prevRequest);
                    } catch (refreshError) {
                        console.error("Refresh token expired or invalid:", refreshError);
                        logout();
                        return Promise.reject(refreshError);
                    }
                }

                // If refresh token also expired => server usually returns 401 or 403
                if (error?.response?.status === 401) {
                    console.warn("Refresh token invalid -> Logging out");
                    logout();
                }

                return Promise.reject(error);
            }
        );

        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        };
    }, [accessToken, refresh, logout]);

    return axiosPrivate;
};

export default useAxiosPrivate;
