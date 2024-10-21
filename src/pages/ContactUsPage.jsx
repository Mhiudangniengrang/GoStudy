import React from "react";
import { Helmet } from "react-helmet";
import { ContactUsView } from "../section/contactus/view";

function ContactUsPage() {
  return (
    <>
      <Helmet>
        <title>Go! Study | Contact-us</title>
      </Helmet>
      <ContactUsView />
    </>
  );
}

export default ContactUsPage;
