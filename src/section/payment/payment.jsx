import React, { useEffect, useState } from "react";
import { Input, Button, Typography, Modal } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import payOs from "../assets/payment/payos.png";
import usePayment from "../../hooks/usePayment";
import { Loading } from "../../components";

function generatePaymentRefId() {
  return Math.floor(100000000 + Math.random() * 900000000).toString();
}

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const packageId = location.pathname.split("/").pop();
  const userId = Cookies.get("userId");
  const {
    paymentInfo,
    fetchGetPaymentInfo,
    fetchPostPayment,
    pollPaymentStatus,
  } = usePayment();

  const [total, setTotal] = useState(0);
  const [phone, setPhone] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderCode, setOrderCode] = useState("");
  const [paymentData, setPaymentData] = useState({
    transactionId: 12345,
    amount: 0,
    paymentCurrency: "USD",
    paymentContent: "Payment for online course",
    paymentRefId: generatePaymentRefId(),
    packageID: packageId,
    userId: userId,
    paymentMethod: "Credit Card",
    buyerName: "",
    buyerEmail: "",
    buyerPhone: "",
    title: "Online Course Payment",
    description: "Payment for access to the course.",
  });

  useEffect(() => {
    if (userId && packageId) {
      fetchGetPaymentInfo(userId, packageId)
        .then(() => console.log("Payment info fetched successfully"))
        .catch((error) => console.error("Failed to fetch payment info", error));
    }
  }, [userId, packageId, fetchGetPaymentInfo]);

  useEffect(() => {
    if (paymentInfo && paymentInfo.package && paymentInfo.user) {
      const { price, name } = paymentInfo.package;
      const { fullName, email } = paymentInfo.user;

      setTotal(price);
      setPaymentData((prevData) => ({
        ...prevData,
        amount: price,
        buyerName: fullName,
        buyerEmail: email,
      }));
    }
  }, [paymentInfo]);

  const handlePaymentSubmit = async () => {
    setLoading(true);
    try {
      const updatedPaymentData = {
        ...paymentData,
        buyerPhone: phone,
        amount: total,
      };

      const paymentResponse = await fetchPostPayment(updatedPaymentData);

      if (paymentResponse) {
        const { orderCode, checkoutUrl } = paymentResponse;
        if (orderCode) {
          setOrderCode(orderCode.toString());
          pollPaymentStatus(orderCode.toString(), navigate);
          window.location.href = checkoutUrl;
        }
      } else {
        console.error("Payment response is undefined");
        setLoading(false);
      }
    } catch (error) {
      console.error("Payment submission failed", error);
      setLoading(false);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    if (phone.trim()) {
      setIsModalVisible(false);
      handlePaymentSubmit();
    } else {
      console.error("Phone number is required");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  if (!paymentInfo) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  const packagePrice = paymentInfo?.package?.price || 0;
  const packageName = paymentInfo?.package?.name || "";
  const userEmail = paymentInfo?.user?.email || "";

  return (
    <div className="flex justify-center items-center max-h-screen bg-white">
      <div className=" p-10  max-w-6xl mx-4">
        {loading ? (
          <Loading />
        ) : (
          <div className="flex flex-col md:flex-row">
            <div className="flex-1 mb-6 md:mb-0 md:mr-6">
              <h2 className="text-3xl font-bold mb-4">Let's Make Payment</h2>
              <p className="text-gray-600 mb-8">
                To start your subscription, input your card details to make
                payment. You will be redirected to your bank's authorization
                page.
              </p>
              <div
                className="p-10 flex flex-col justify-center rounded-lg text-black mb-5 h-full max-h-60"
                style={{
                  background: "linear-gradient(#F36F20,#FDC29F, #F0F0F0)",
                }}
              >
                <div className="flex flex-col">
                  <h3 className="text-2xl text-[#71717a]">You're paying,</h3>
                  <p className="text-4xl font-bold mt-2">
                    {packagePrice.toLocaleString()} VND
                  </p>
                </div>
                <div className="flex justify-between mt-4 w-full">
                  <p className="text-lg">{packageName}</p>
                  <p className="text-lg">{packagePrice.toLocaleString()} VND</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <p>Subtotal: </p>
                  <p>{packagePrice.toLocaleString()} VND</p>
                </div>

                <div className="flex justify-between">
                  <p className="font-bold">Total:</p>
                  <p>{total.toLocaleString()} VND</p>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <Typography className="font-bold mb-2">Email</Typography>
              <Input
                placeholder="Email"
                className="mb-4"
                value={userEmail}
                readOnly
              />
              <Typography className="font-bold mb-2">Phone number</Typography>
              <Input
                placeholder="Phone number"
                className="mb-4"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <div className="flex justify-between mb-4">
                <h4 className="font-bold">Payment method</h4>
              </div>
              <div className="flex p-4 rounded-lg">
                <img src={payOs} alt="PayOs" className="w-32 h-32 rounded-md" />
              </div>
              <Button type="primary" onClick={showModal}>
                Pay
              </Button>
            </div>
          </div>
        )}
      </div>
      <Modal
        title="Payment Confirmation"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Are you sure you want to proceed with the payment?</p>
      </Modal>
    </div>
  );
}

export default Payment;
