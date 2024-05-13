import axios, { AxiosError, AxiosInstance } from "axios";
import { toast } from "react-toastify";

class Http {
  instance: AxiosInstance;
  constructor() {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_SERVER_URL,
      timeout: 10000,
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    this.instance.interceptors.response.use(
      function (response) {
        return response;
      },
      function (error: AxiosError) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: any | undefined = error.response?.data;
        const message =
          data?.message || error.code === "ECONNABORTED"
            ? "Error from server, please try again"
            : error.message;
        if (error.response?.status === 401) {
          localStorage.setItem("user", "null");
          window.location.href = "/";
        } else {
          toast.error(message);
        }

        return Promise.reject(error);
      }
    );
  }
}

export const http = new Http().instance;
