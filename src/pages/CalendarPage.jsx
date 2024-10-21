import React from "react";
import { Helmet } from "react-helmet";
import { CalendarView } from "../section/home/view";

function CalendarPage() {
  return (
    <>
      <Helmet>
        <title>Go! Study | Calendar Page</title>
      </Helmet>
      <CalendarView />
    </>
  );
}

export default CalendarPage;
