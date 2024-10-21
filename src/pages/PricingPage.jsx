import React from "react";
import { Helmet } from "react-helmet";
import { PricingView } from "../section/Pricing/view";

function PricingPage() {
  return (
    <>
      <Helmet>
        <title>Go! Study | Pricing Page</title>
      </Helmet>
      <PricingView />
    </>
  );
}

export default PricingPage;
