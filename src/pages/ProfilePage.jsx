import React from "react";
import { Helmet } from "react-helmet";
import { ProfileView } from "../section/profile/view";

function ProfilePage() {
  return (
    <>
      <Helmet>
        <title>Go!Study | Profile Page</title>
      </Helmet>
      <ProfileView />
    </>
  );
}

export default ProfilePage;
