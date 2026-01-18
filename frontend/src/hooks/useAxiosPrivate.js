import { axiosPrivate } from "../api/axios";
import { useEffect, useRef } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "../store/authStore";

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const { accessToken, refreshToken, logout } = useAuth();
  const refreshPromiseRef = useRef(null);

  const getFreshAccessToken = async () => {
    if (!refreshPromiseRef.current) {
      refreshPromiseRef.current = refresh()
        .then((newToken) => newToken)
        .finally(() => {
          refreshPromiseRef.current = null;
        });
    }
    return refreshPromiseRef.current;
  };

  useEffect(() => {
    // --- REQUEST INTERCEPTOR ---
    const requestIntercept = axiosPrivate.interceptors.request.use(
      async (config) => {
        if (!config.headers["Authorization"]) {
          let token = accessToken;

          // If no access token but refresh token exists, refresh before request
          if (!token && refreshToken) {
            try {
              token = await getFreshAccessToken();
            } catch (refreshError) {
              console.error("Unable to refresh token:", refreshError);
              logout();
              return Promise.reject(refreshError);
            }
          }

          if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // --- RESPONSE INTERCEPTOR ---
    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;

        if (
          (error?.response?.status === 401 ||
            error?.response?.status === 403) &&
          !prevRequest?.sent
        ) {
          prevRequest.sent = true;
          try {
            const newAccessToken = await getFreshAccessToken();
            prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            return axiosPrivate(prevRequest);
          } catch (refreshError) {
            console.error("Refresh token expired or invalid:", refreshError);
            logout();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      },
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [accessToken, refreshToken, refresh, logout]);

  return axiosPrivate;
};

export default useAxiosPrivate;
