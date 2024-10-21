import React from "react";
import { Helmet } from "react-helmet";
import { FocusSpaceView } from "../section/focusRoom/view";

function FocusPage() {
  return (
    <>
      <Helmet>
        <title>Go! Study | Focus Page</title>
      </Helmet>
      <FocusSpaceView />
    </>
  );
}

export default FocusPage;
