import axiosClient from "../config/axiosClient";

const getPayment = (userId, packageId) => {
  return axiosClient.get(
    `/api/Payment/checkout?userId=${userId}&packageId=${packageId}`
  );
};
const postPayment = (paymentData) => {
  return axiosClient.post("/api/Payment/Payos", paymentData);
};
const getPaymentCancel = (orderCode) => {
  return axiosClient.get(`/api/Payment/payos-cancel?orderCode=${orderCode}`);
};
const getPaymentStatus = (orderCode) => {
  return axiosClient.get(`/api/Payment/${orderCode}/status`);
};
export { getPayment, postPayment, getPaymentCancel, getPaymentStatus };
