import { create } from "zustand";
import {
  getPayment,
  getPaymentCancel,
  postPayment,
  getPaymentStatus,
} from "../api/payment";
import { notification } from "antd";

// Zustand store
const usePayment = create((set) => ({
  paymentInfo: null,

  fetchGetPaymentInfo: async (userId, packageId) => {
    try {
      const res = await getPayment(userId, packageId);
      if (res && res.status === 200) {
        set({ paymentInfo: res.data });
      }
    } catch (err) {
      console.log("Error fetching payment info", err);
    }
  },

  postPaymentInfo: {},

  fetchPostPayment: async (paymentData) => {
    try {
      const res = await postPayment(paymentData);
      console.log("Payment Post Response:", res);

      if (res && res.status === 200) {
        set({ paymentInfo: res.data });
        console.log("Payment info updated after post:", res.data);
        return {
          qrCode: res.data.qrCode,
          orderCode: res.data.orderCode,
          checkoutUrl: res.data.checkoutUrl, 
        };
      } else {
        console.error("Unexpected status code:", res.status);
      }
    } catch (err) {
      console.error("Error posting payment info", err);
    }
  },

  paymentCancel: null,
  fetchPaymentCancel: async (orderCode) => {
    try {
      const res = await getPaymentCancel(orderCode);
      if (res && res.status === 200) {
        set({ paymentCancel: res.data });
        console.log("delete", res);
        notification.success({
          message: res.data,
        });
      }
    } catch (err) {
      console.log("Error fetching payment cancel info", err);
    }
  },

  pollPaymentStatus: async (orderCode, onSuccess) => {
    const intervalId = setInterval(async () => {
      try {
        const res = await getPaymentStatus(orderCode); // Call API to get payment status
        if (res && res.status === 200 && res.data.status === "PAID") {
          clearInterval(intervalId); // Stop polling when payment is successful
          notification.success({
            message: "Payment Successful!",
          });
          onSuccess(); // Call the success handler
        } else if (res.data.status === "Canceled") {
          clearInterval(intervalId); // Stop polling if payment failed
          notification.error({
            message: "Payment Failed",
          });
        }
      } catch (err) {
        console.log("Error fetching payment status", err);
      }
    }, 5000); 
  },
}));

export default usePayment;
