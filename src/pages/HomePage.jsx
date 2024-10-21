import React from "react";
import { Helmet } from "react-helmet";
import { HomeView } from "../section/home/view";

function HomePage() {
  return (
    <>
      <Helmet>
        <title> Go! Study | Home</title>
      </Helmet>
      <HomeView />
    </>
  );
}

export default HomePage;
