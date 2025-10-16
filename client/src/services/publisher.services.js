//client/src/services/publisher.services.js
import axiosInstance from "../utils/axiosInstance.util.js";

export const signupPublisher = async (userData) => {
  const response = await axiosInstance.post("publisher/signup", userData);
  return response.data;
};