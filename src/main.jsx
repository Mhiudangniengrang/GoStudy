import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import App from "./App.jsx";
import "./index.css";
import Loading from "./components/Loading.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="785556433218-hemsa8v3gk1c3o4io181as1bsvjh2hhe.apps.googleusercontent.com">
      <BrowserRouter>
        <Suspense fallback={<Loading />}>
          <App />
        </Suspense>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
