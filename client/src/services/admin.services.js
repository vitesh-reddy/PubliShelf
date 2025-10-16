//client/src/services/admin.services.js
import axiosInstance from "../utils/axiosInstance.util.js";

export const getDashboardData = async () => {
  const response = await axiosInstance.get("admin/dashboard");
  return response.data;
};

export const banPublisher = async (publisherId) => {
  const response = await axiosInstance.delete(`admin/publishers/${publisherId}/ban`);
  return response.data;
};

// Placeholder for approve/reject (implement once backend endpoints added)
export const approvePublisher = async (publisherId) => {
  const response = await axiosInstance.post(`admin/publishers/${publisherId}/approve`);
  return response.data;
};

export const rejectPublisher = async (publisherId) => {
  const response = await axiosInstance.post(`admin/publishers/${publisherId}/reject`);
  return response.data;
};