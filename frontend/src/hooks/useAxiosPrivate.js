import { axiosPrivate } from "../api/axios";
import { useEffect, useRef } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "../store/authStore";

const decodeJwtPayload = (token) => {
  try {
    const payload = token.split(".")[1];
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      "=",
    );
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
};

const isTokenExpired = (token, skewSeconds = 30) => {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return true;
  const now = Math.floor(Date.now() / 1000);
  return payload.exp - skewSeconds <= now;
};

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
        let token = accessToken;

        // If token exists but is expired/near expiry, refresh before request
        if (token && isTokenExpired(token)) {
          try {
            token = await getFreshAccessToken();
          } catch (refreshError) {
            console.error("Unable to refresh token:", refreshError);
            logout();
            return Promise.reject(refreshError);
          }
        }

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
            if (!refreshToken) {
              logout();
              return Promise.reject(error);
            }
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
