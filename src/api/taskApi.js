import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

export const taskApi = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const authService = {
  register: (data) =>
    taskApi.post(`/auth/register?roleName=${data.role}`, data),

  login: (data) =>
    taskApi.post("/auth/login", data),

  forgotPassword: (email) =>
    taskApi.post("/auth/forgot-password", { email }),

  resetPassword: (data) =>
    taskApi.post("/auth/reset-password", data),
};

export default taskApi;