import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Form, notification } from "antd";
import { GoogleLogin } from "@react-oauth/google";
import { login } from "../../api/authenApi";
import { jwtDecode } from "jwt-decode";
import useAuthen from "../../hooks/useAuthen";
import CryptoJS from "crypto-js";

function Authen() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();
  const { fetchUserInfo, infoUser, login: authenticate } = useAuthen();

  useEffect(() => {
    const handleBeforeUnload = () => {
      Cookies.remove("__token");
      Cookies.remove("userId");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleGoogleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;
    try {
      setIsLoggingIn(true);
      const response = await login(token);
      const newToken = response.data.token.accessToken;
      if (typeof newToken === "string") {
        const decoded = jwtDecode(newToken);
        const userId = decoded.sid;

        const encryptedToken = CryptoJS.AES.encrypt(newToken, "tao").toString();

        Cookies.set("__token", encryptedToken, { expires: 7 });
        Cookies.set("userId", userId, { expires: 7 });

        await fetchUserInfo(userId);
        authenticate();

        notification.success({
          message: "Login Successful",
          description: "You have successfully logged in.",
          duration: 2,
        });

        if (infoUser.specialization && infoUser.specialization.length > 0) {
          navigate("/user/home");
        } else {
          navigate("/user");
        }
      } else {
        throw new Error("Invalid token format received");
      }
    } catch (error) {
      notification.error({
        message: "Login Failed",
        description: "An error occurred during login. Please try again.",
        duration: 2,
      });
      console.error(
        "Error posting token:",
        error.response?.data || error.message
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="p-12 w-[100%] max-w-[28rem]">
      <Form name="google_login" className="space-y-6">
        <Form.Item className="flex justify-center p-5">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              notification.error({
                message: "Login Failed",
                description: "Google Sign-In Error. Please try again.",
                duration: 2,
              });
            }}
          />
        </Form.Item>
      </Form>
    </div>
  );
}

export default Authen;
