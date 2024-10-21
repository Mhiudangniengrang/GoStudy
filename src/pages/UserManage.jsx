import { Helmet } from "react-helmet";
import { UserInfoView } from "../section/user/view";

function UserManage() {
  return (
    <>
      <Helmet>
        <title> FAMS | User Management </title>
      </Helmet>
      <UserInfoView />
    </>
  );
}

export default UserManage;
