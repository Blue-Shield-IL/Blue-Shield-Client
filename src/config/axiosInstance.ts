import axios, { HttpStatusCode } from "axios";

let accessToken: string | null = null;
let refreshPromise: Promise<string> | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

const refreshAccessToken = (): Promise<string> => {
  if (!refreshPromise) {
    refreshPromise = axios
      .post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
        {},
        { withCredentials: true }
      )
      .then(({ data }) => {
        accessToken = data.accessToken;
        return data.accessToken as string;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
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
            const newToken = await refreshAccessToken();
            originalRequest.headers.Authorization = `Bearer ${newToken}`;

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
