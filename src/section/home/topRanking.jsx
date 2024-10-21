import React, { useEffect, useState } from "react";
import useUserHome from "../../hooks/useUserHome";
import Cookies from "js-cookie";
import { Avatar, Button, Modal, notification } from "antd";
import * as signalR from "@microsoft/signalr";
import useFriend from "../../hooks/useFriend";
import useRoom from "../../hooks/useRoom";

function TopRanking({ friends }) {
  const userId = Cookies.get("userId");
  const { getAll, fetchGetAll } = useUserHome();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { fetchPostFriend } = useFriend();
  const [sentRequests, setSentRequests] = useState(new Set());

  useEffect(() => {
    fetchGetAll();

    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7173/userStatusHub")
      .withAutomaticReconnect()
      .build();

    const startConnection = async () => {
      try {
        await connection.start();
        console.log("SignalR connected for TopRanking!");

        await connection.invoke("ConnectWithUserId", parseInt(userId, 10));

        connection.on("ReceiveOnlineUsers", (onlineUserIds) => {
          setOnlineUsers(onlineUserIds);
          console.log("Online users received in TopRanking:", onlineUserIds);

          fetchGetAll();
        });

        await connection.invoke("GetOnlineUsers");
      } catch (error) {
        console.error("Error with SignalR in TopRanking:", error);
      }
    };

    startConnection();

    return () => {
      connection
        .stop()
        .then(() => console.log("SignalR connection stopped in TopRanking"))
        .catch((error) => console.error("Error stopping SignalR:", error));
    };
  }, [fetchGetAll, userId]);

  const isUserOnline = (userId) => {
    return onlineUsers.includes(userId.toString());
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedUser(null);
  };

  const handleAddFriend = async () => {
    if (selectedUser) {
      const recipientId = selectedUser.userId;
      const requesterId = parseInt(userId, 10);

      if (requesterId === recipientId) {
        console.error("Requester and recipient cannot be the same person.");
        return;
      }

      if (sentRequests.has(recipientId)) {
        notification.info({
          message: "Notification",
          description: "You have already sent a friend request to this person.",
        });
        handleModalClose();
        return;
      }

      try {
        console.log(
          "Sending friend request from",
          requesterId,
          "to",
          recipientId
        );

        await fetchPostFriend(requesterId, recipientId);

        setSentRequests((prev) => new Set(prev).add(recipientId));

        console.log("Friend request sent to:", selectedUser.fullName);
        handleModalClose();
      } catch (error) {
        console.error("Error sending friend request:", error);
      }
    }
  };

  return (
    <div className="w-[22rem]">
      <div className="flex justify-between">
        <h2 className="font-bold mb-4 text-lg text-[#F36F20]">Member Online</h2>
      </div>
      <div className="space-y-2">
        {getAll && getAll.length > 0 ? (
          getAll
            .filter(
              (user) =>
                isUserOnline(user.userId) &&
                user.userId !== parseInt(userId, 10) &&
                !friends.includes(user.userId) // Exclude friends
            )
            .map((user) => (
              <div
                key={user.userId}
                className="bg-[#EEE6E2] p-4 rounded-lg flex justify-between items-center shadow-md cursor-pointer"
                onClick={() => handleUserClick(user)}
              >
                <div className="flex items-center">
                  <Avatar
                    src={user.profileImage}
                    alt={`${user.fullName}'s profile`}
                    className="w-10 h-10 rounded-full mr-2"
                  />
                  <div>
                    <span className="font-bold text-md text-orange-500">
                      {user.fullName}
                    </span>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className={`w-3 h-3 rounded-full bg-green-500`}></span>
                </div>
              </div>
            ))
        ) : (
          <p>No users found.</p>
        )}
      </div>

      {selectedUser && (
        <Modal
          title="User Details"
          open={isModalVisible}
          onCancel={handleModalClose}
          footer={[
            <Button key="cancel" onClick={handleModalClose}>
              Cancel
            </Button>,
            <Button key="add-friend" type="primary" onClick={handleAddFriend}>
              Add Friend
            </Button>,
          ]}
        >
          <div className="flex items-center">
            <Avatar
              src={selectedUser.profileImage}
              alt={`${selectedUser.fullName}'s profile`}
              size={64}
              className="mr-4"
            />
            <div>
              <h3 className="text-lg font-bold">{selectedUser.fullName}</h3>
              <p className="text-sm text-gray-600">{selectedUser.email}</p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default TopRanking;
