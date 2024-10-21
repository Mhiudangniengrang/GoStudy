import { Helmet } from "react-helmet";
import { AuthenView } from "../section/authen/view";

function Authentication() {
  return (
    <>
      <Helmet>
        <title> GO! Study | Login </title>
      </Helmet>
      <AuthenView />
    </>
  );
}

export default Authentication;
