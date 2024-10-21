import React, { useEffect } from "react";
import { useParams, useLocation } from "react-router";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { v4 } from "uuid";
import { Card, Typography } from "antd";
// Use the uploaded image path here
import room from "../assets/account/rom.png";

const { Title, Text } = Typography;

function RoomZego() {
  const { roomId } = useParams();
  const location = useLocation();
  const { roomName } = location.state || {};

  useEffect(() => {
    const appId = 1614184009;
    const serverSecret = "c42344d0535d67ca2c28c13f4a4ac72a";
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appId,
      serverSecret,
      roomId,
      v4(),
      "You"
    );

    const ui = ZegoUIKitPrebuilt.create(kitToken);
    ui.joinRoom({
      container: document.getElementById("meeting-container"),
      sharedLinks: [
        {
          name: "Copy link",
          url:
            window.location.protocol +
            "//" +
            window.location.host +
            window.location.pathname,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.VideoConference,
      },
    });

    return () => {
      ui.destroy();
    };
  }, [roomId]);

  return (
    <div
      style={{
        backgroundImage: `url(${room})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        height: "117vh", // Set height to cover the full viewport
      }}
    >
      <div id="meeting-container" style={{ height: "100%" }}></div>
    </div>
  );
}

export default RoomZego;
