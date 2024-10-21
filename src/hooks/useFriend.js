import { create } from "zustand";
import { friendAccept, friendReject, sendFriend } from "../api/friendApi";
import { notification } from "antd"; // Import notification from antd

const useFriend = create((set) => ({
  fetchPostFriend: async (requesterId, recipientId) => {
    try {
      const res = await sendFriend(requesterId, recipientId);
      if (res.status === 200) {
        notification.success({
          message: "Invitation sent successfully",
          description: "Friend added successfully.",
        });
        console.log("Friend post success", res.data);
      }
    } catch (err) {
      console.error("Error posting friend:", err.response?.data || err.message);
      notification.info({
        message: "Notification",
        description: "You have already sent a friend request to this person.",
      });
    }
  },
  fetchPostAccept: async (requesterId, recipientId) => {
    try {
      const res = await friendAccept(requesterId, recipientId);
      if (res.status === 200) {
        notification.success({
          message: "Add Success",
          description: "Friend accepted successfully.",
        });
      }
      console.log("Friend accept success", res.data);
    } catch (err) {
      console.error("Error accept friend:", err.response?.data || err.message);
      notification.error({
        message: " Accept Failed",
        description: "Could not add friend. Please try again.",
      });
    }
  },
  fetchPostReject: async (requesterId, recipientId) => {
    try {
      const res = await friendReject(requesterId, recipientId);
      if (res.status === 200) {
        notification.success({
          message: "Reject Success",
          description: "Friend reject successfully.",
        });
      }
      console.log("Friend reject success", res.data);
    } catch (err) {
      console.error("Error reject friend:", err.response?.data || err.message);
      notification.error({
        message: " Reject Failed",
        description: "Could not add friend. Please try again.",
      });
    }
  },
}));

export default useFriend;
