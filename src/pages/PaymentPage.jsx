import React from "react";
import { Helmet } from "react-helmet";
import { PaymentView } from "../section/payment/view";

function PaymentPage() {
  return (
    <>
      <Helmet>
        <title>Go! Study | Payment Page</title>
      </Helmet>
      <PaymentView />
    </>
  );
}

export default PaymentPage;
