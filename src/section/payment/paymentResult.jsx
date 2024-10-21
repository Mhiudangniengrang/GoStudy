import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "antd"; // Import Ant Design button
import React from "react";

function PaymentResult() {
  const [searchParams] = useSearchParams();
  const orderCode = searchParams.get("orderCode");
  const isSuccess = searchParams.get("success") === "true";
  const isCancelled = searchParams.get("cancelled") === "true";
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate("/user/home");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">
        Payment results
      </h1>

      {isSuccess && (
        <div className="mb-6 p-4 border-2 border-green-400 bg-green-100 rounded-md text-center">
          <p className="text-green-600 text-xl font-medium">
            Successful payment!
          </p>
          <p className="text-gray-700">Order code: {orderCode}</p>
        </div>
      )}

      {isCancelled && (
        <div className="mb-6 p-4 border-2 border-red-400 bg-red-100 rounded-md text-center">
          <p className="text-red-600 text-xl font-medium">
            The transaction was canceled.
          </p>
          <p className="text-gray-700">Order code: {orderCode}</p>
        </div>
      )}

      {!isSuccess && !isCancelled && (
        <p className="text-orange-600 text-xl font-medium">
          Error has occurred during the payment process.
        </p>
      )}

      <Button
        type="primary"
        onClick={handleBackHome}
        className="mt-4"
        size="large"
      >
        Back Home
      </Button>
    </div>
  );
}

export default PaymentResult;
