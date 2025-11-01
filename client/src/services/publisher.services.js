//client/src/services/publisher.services.js
import axiosInstance from "../utils/axiosInstance.util.js";

export const getDashboard = async () => {
  const response = await axiosInstance.get("publisher/dashboard");
  return response.data;
};

export const signupPublisher = async (userData) => {
  const response = await axiosInstance.post("publisher/signup", userData);
  return response.data;
};

export const publishBook = async (formData) => {
  const response = await axiosInstance.post("publisher/publish-book", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const sellAntique = async (formData) => {
  const response = await axiosInstance.post("publisher/sell-antique", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};