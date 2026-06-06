import axios, { HttpStatusCode } from "axios";

let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const createApiInstance = (basePath: string, addToken = true) => {
  const instance = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/${basePath}`,
    withCredentials: true,
  });

  if (addToken) {
    instance.interceptors.request.use(config => {
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      return config;
    });

    instance.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;

        if (
          error.response?.status === HttpStatusCode.Unauthorized &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;

          try {
            const { data } = await axios.post(
              `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
              {},
              { withCredentials: true }
            );
            accessToken = data.accessToken;
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;

            return instance(originalRequest);
          } catch {
            accessToken = null;
            if (window.location.pathname !== "/login") {
              window.location.href = "/login";
            }

            return Promise.reject(error);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  return instance;
};
