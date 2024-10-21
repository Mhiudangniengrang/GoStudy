import React from "react";
import { Helmet } from "react-helmet";
import { ContactView } from "../section/contact/view";

function ContactPage() {
  return (
    <>
      <Helmet>
        <title>Go! Study | Contact</title>
      </Helmet>
      <ContactView />
    </>
  );
}

export default ContactPage;
