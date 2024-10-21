import React from "react";
import { Helmet } from "react-helmet";
import { RoomView } from "../section/room/view";

function RoomPage() {
  return (
    <>
      <Helmet>
        <title>Go! Study | Room</title>
      </Helmet>
      <RoomView />
    </>
  );
}

export default RoomPage;
