import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  notification,
  message,
  Modal,
  Input,
  Menu,
  Dropdown,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import * as signalR from "@microsoft/signalr";
import home from "../assets/account/home.png";
import roomImg from "../assets/landing/roomimg.png";
import room from "../assets/landing/room.png";
import useAuthen from "../../hooks/useAuthen";
import Cookies from "js-cookie";
import RoomTask from "./roomTask";
import useRoom from "../../hooks/useRoom";
import { BellOutlined } from "@ant-design/icons";
import useUserHome from "../../hooks/useUserHome";
import useFriend from "../../hooks/useFriend";

const RoomUser = () => {
  const navigate = useNavigate();
  const { isAuthenticated, infoUser, fetchUserInfo } = useAuthen();
  const { fetchGetRoom, listRoom, fetchPutUrl } = useRoom();
  const { getAll, fetchGetAll } = useUserHome();
  const { fetchPostAccept, fetchPostReject } = useFriend();
  const avatarUrl = listRoom.user?.profileImage || "";
  const userName = listRoom.user?.fullName || "User";
  const email = infoUser?.email || "Email not available";
  const userId = parseInt(Cookies.get("userId"), 10);

  const [onlineUsers, setOnlineUsers] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [friendRecipients, setFriendRecipients] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tasks, setTasks] = useState([
    "Hoàn thành bài tập lúc 8h",
    "Cố gắng hoàn thành trước 7h tối",
  ]);
  const [currentTask, setCurrentTask] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    if (isAuthenticated && !infoUser.fullName && userId) {
      fetchUserInfo(userId);
    }
    fetchGetRoom(userId);
    fetchGetAll();
  }, [
    isAuthenticated,
    infoUser,
    fetchUserInfo,
    fetchGetRoom,
    fetchGetAll,
    userId,
  ]);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://go-study-chi.vercel.app/userStatusHub")
      .withAutomaticReconnect()
      .build();

    const startConnection = async () => {
      try {
        await connection.start();
        console.log("SignalR connected!");

        await connection.invoke("ConnectWithUserId", userId);

        connection.on("ReceiveOnlineUsers", (onlineUserIds) => {
          setOnlineUsers(onlineUserIds);
          fetchGetAll();
        });

        await connection.invoke("GetOnlineUsers");
      } catch (error) {
        console.error("Error with SignalR:", error);
      }
    };

    startConnection();

    return () => {
      connection
        .stop()
        .catch((error) => console.error("Error stopping SignalR:", error));
    };
  }, [fetchGetAll, userId]);

  const isUserOnline = (userId) => onlineUsers.includes(userId.toString());

  const joinRoom = (roomId, roomName) => {
    const url = `http://localhost:3000/user/room/${roomId}`;
    fetchPutUrl(roomId, url);
    navigate(`/user/room/${roomId}`, { state: { roomName } });
  };

  const notifyLocked = () => {
    notification.error({
      message: "Access Denied",
      description: "You cannot enter this room.",
    });
  };

  const showModal = (task = "", index = null) => {
    setCurrentTask(task);
    setEditIndex(index);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentTask("");
    setEditIndex(null);
  };

  const handleSave = () => {
    if (!currentTask.trim()) {
      message.warning("Task cannot be empty");
      return;
    }

    if (editIndex !== null) {
      const updatedTasks = [...tasks];
      updatedTasks[editIndex] = currentTask;
      setTasks(updatedTasks);
    } else if (tasks.length < 5) {
      setTasks([...tasks, currentTask]);
    }

    handleCancel();
  };

  const handleDelete = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  useEffect(() => {
    if (listRoom) {
      setFriendRequests(
        listRoom.friendRequests?.filter(
          (req) =>
            req !== null &&
            req.status !== "Accepted" &&
            req.status !== "Rejected"
        ) || []
      );
      setFriendRecipients(
        listRoom.friendRecipient?.filter(
          (rec) =>
            rec !== null &&
            rec.status !== "Accepted" &&
            rec.status !== "Rejected"
        ) || []
      );
    }
  }, [listRoom]);

  const acceptFriendRequest = (requesterId, recipientId) => {
    fetchPostAccept(requesterId, recipientId)
      .then(() => {
        setFriendRequests((prev) =>
          prev.map((req) =>
            req.requester.userId === requesterId
              ? { ...req, status: "Accepted" }
              : req
          )
        );

        setFriendRecipients((prev) =>
          prev.map((rec) =>
            rec.recipient.userId === recipientId
              ? { ...rec, status: "Accepted" }
              : rec
          )
        );

        fetchGetRoom(userId);
      })
      .catch((error) => {
        console.error("Error accepting friend request:", error);
        message.error("Failed to accept friend request.");
      });
  };

  const rejectFriendRequest = (requesterId, recipientId) => {
    fetchPostReject(requesterId, recipientId)
      .then(() => {
        setFriendRequests((prev) =>
          prev.filter((req) => req.requester.userId !== requesterId)
        );
        setFriendRecipients((prev) =>
          prev.filter((rec) => rec.recipient.userId !== recipientId)
        );

        fetchGetRoom(userId);
      })
      .catch((error) => {
        console.error("Error rejecting friend request:", error);
        message.error("Failed to reject friend request.");
      });
  };

  const friendRequestMenu = (
    <Menu>
      {[...friendRequests, ...friendRecipients].map((request) => {
        const { requester, recipient } = request;
        const currentUserIsRequester = requester.userId === infoUser.userId;
        const currentUserIsRecipient = recipient.userId === infoUser.userId;

        return (
          <Menu.Item key={request.friendRequestId}>
            <div>
              {currentUserIsRequester ? (
                <>
                  You have sent a friend request to{" "}
                  <strong>{recipient.fullName}</strong>
                </>
              ) : currentUserIsRecipient ? (
                <>
                  <strong>{requester.fullName}</strong> sent you a friend
                  request
                </>
              ) : null}
              <br />
              <div className="flex justify-between items-center">
                <div>
                  <strong>Status:</strong> {request.status}
                </div>
                {currentUserIsRecipient && (
                  <div className="flex space-x-2">
                    <Button
                      color="primary"
                      variant="outlined"
                      onClick={() =>
                        acceptFriendRequest(requester.userId, recipient.userId)
                      }
                    >
                      Accept
                    </Button>
                    <Button
                      danger
                      onClick={() =>
                        rejectFriendRequest(requester.userId, recipient.userId)
                      }
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Menu.Item>
        );
      })}
    </Menu>
  );

  const userRooms = listRoom.userRooms || [];
  const moreRooms = listRoom.otherClassrooms || [];
  const userRoomIds = new Set(userRooms.map((room) => room.classroomId));

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <div className="w-full md:w-1/5 bg-white p-5">
        <div className="bg-gradient-to-t from-[#C8E2FF] to-white p-4 rounded-lg shadow-md text-center w-full h-80 mt-5">
          <div className="flex justify-center">
            <img src={home} alt="Upgrade Icon" />
          </div>
          <h3 className="font-bold text-lg">
            Upgrade to <span className="text-orange-500">PRO</span> for more
            features.
          </h3>
          <Link to="/user/pricing">
            <Button
              size="large"
              className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-full"
            >
              Upgrade
            </Button>
          </Link>
        </div>

        <div className="my-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Avatar size="large" src={avatarUrl} />
              <div className="ml-2">
                <div className="font-bold">{userName}</div>
              </div>
            </div>

            <div className="relative">
              <Dropdown overlay={friendRequestMenu} trigger={["click"]}>
                <BellOutlined className="text-lg cursor-pointer" />
              </Dropdown>
              {friendRequests.length + friendRecipients.length > 0 && (
                <div className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {friendRequests.length + friendRecipients.length}
                </div>
              )}
            </div>
          </div>

          <img src={roomImg} alt="Room Image" className="w-full h-48" />
        </div>

        <RoomTask />
      </div>

      {/* Main Content */}
      <div className="w-full md:w-3/5 p-4">
        <div className="mb-4 p-4 rounded-lg bg-gradient-to-r from-[#5088FF] to-[#DAE5FF] flex items-center">
          <img src={room} alt="Study Image" className="w-32 h-32 mr-4" />
          <div className="space-y-3">
            <h2 className="text-2xl md:text-4xl font-medium text-[#034EA1]">
              Find your study room now!
            </h2>
            <p className="text-[#034EA1]">
              Explore, connect, and excel with Go! Study - your pathway to
              success!
            </p>
          </div>
        </div>

        {/* Your Room Section */}
        <div className="mb-8">
          <h3 className="text-xl font-medium text-[#034EA1] mb-3">Your Room</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userRooms.map((room) => (
              <div
                key={room.classroomId}
                className="bg-gray-100 p-5 space-y-5 rounded-lg shadow-md flex flex-col justify-between"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="space-y-3">
                    <h2 className="text-xl font-bold">{room.name}</h2>
                    <h4 className="text-sm text-gray-500">{room.nickname}</h4>
                  </div>
                </div>
                <button
                  onClick={() => joinRoom(room.classroomId, room.name)}
                  className="bg-blue-500 text-white py-2 rounded"
                >
                  Join
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* More Room Section */}
        <div className="mb-8">
          <h3 className="text-xl font-medium text-[#034EA1] mb-3">More Room</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {moreRooms.map((room) => (
              <div
                key={room.classroomId}
                className="bg-gray-100 p-5 space-y-5 rounded-lg shadow-md flex flex-col justify-between"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="space-y-3">
                    <h2 className="text-xl font-bold">{room.name}</h2>
                    <h4 className="text-sm text-gray-500">
                      {room.nickname || "This room is available."}
                    </h4>
                  </div>
                </div>
                <button
                  onClick={
                    userRoomIds.has(room.classroomId)
                      ? () => joinRoom(room.classroomId, room.name)
                      : notifyLocked
                  }
                  className={`bg-blue-500 text-white py-2 rounded ${
                    userRoomIds.has(room.classroomId)
                      ? ""
                      : "cursor-not-allowed"
                  }`}
                  disabled={!userRoomIds.has(room.classroomId)}
                >
                  {userRoomIds.has(room.classroomId) ? "Join" : "Locked"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-full md:w-1/5 py-6 space-y-8 ">
        {/* New Members Section */}
        <div>
          <div className="flex justify-center mb-5">
            <Avatar
              size="large"
              className="w-24 h-24 md:w-32 md:h-32 mb-3"
              src={avatarUrl}
            />
          </div>
          <div className="text-center">
            <div className="font-bold text-sm md:text-base">{userName}</div>
            <div className="text-gray-500 text-xs md:text-sm">{email}</div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-4">Friend</h2>
          <div className="space-y-2">
            {listRoom.listFriend && listRoom.listFriend.length > 0 ? (
              listRoom.listFriend.map((friend, index) => {
                const participant = friend.myFriend;
                if (!participant) return null;
                const isOnline = isUserOnline(participant.userId);

                return (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center">
                      <Avatar
                        src={
                          participant.profileImage ||
                          "https://via.placeholder.com/240"
                        }
                        alt={participant.fullName || "Unknown"}
                        className="w-8 h-8 md:w-10 md:h-10 rounded-full "
                        size="small"
                      />
                      <div className="ml-2">
                        <span className="font-bold text-md">
                          {participant.fullName || "Unknown"}
                        </span>
                        <p className="text-gray-500 text-md">
                          {participant.email || "No email"}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <span
                        className={`w-3 h-3 rounded-full ${
                          isOnline ? "bg-green-500" : "bg-red-500"
                        }`}
                      ></span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-gray-500">No friends found</div>
            )}
          </div>
        </div>

        {/* Recent Activity Section */}
        <div>
          <h3 className="text-lg font-medium text-[#034EA1]">Members Online</h3>
          <div className="space-y-5 mt-4">
            {getAll && getAll.length > 0 ? (
              getAll
                .filter((user) => isUserOnline(user.userId))
                .map((user) => (
                  <div
                    key={user.userId}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center">
                      <Avatar
                        size="small"
                        src={user.profileImage}
                        alt={`${user.fullName}'s profile`}
                        className="w-8 h-8 md:w-10 md:h-10 rounded-full mr-2"
                      />
                      <div>
                        <span className="font-bold text-xs md:text-sm text-orange-500">
                          {user.fullName}
                        </span>
                        <p className="text-xs md:text-sm text-gray-600">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`w-2 h-2 md:w-3 md:h-3 rounded-full bg-green-500`}
                    ></span>
                  </div>
                ))
            ) : (
              <p>No users found.</p>
            )}
          </div>
        </div>
      </div>

      {/* Task Modal */}
      <Modal
        title={editIndex !== null ? "Edit Task" : "Add Task"}
        open={isModalVisible}
        onOk={handleSave}
        onCancel={handleCancel}
      >
        <Input
          value={currentTask}
          onChange={(e) => setCurrentTask(e.target.value)}
          placeholder="Enter your task"
        />
      </Modal>
    </div>
  );
};

export default RoomUser;
