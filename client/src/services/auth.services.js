//client/src/services/auth.services.js
import axiosInstance from "../utils/axiosInstance.util.js";

export const login = async (credentials) => {
  const response = await axiosInstance.post("auth/login", credentials);
  return response.data;
};