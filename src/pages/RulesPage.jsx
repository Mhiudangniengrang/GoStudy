import React from "react";
import { Helmet } from "react-helmet";
import { RulesView } from "../section/rules/view";

function RulesPage() {
  return (
    <>
      <Helmet>
        <title>Go! Study | Rules</title>
      </Helmet>
      <RulesView />
    </>
  );
}

export default RulesPage;
