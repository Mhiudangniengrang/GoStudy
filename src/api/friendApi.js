import axiosClient from "../config/axiosClient";

const sendFriend = (requesterId, recipientId) => {
  return axiosClient.post("/api/User/SendFriendRequest", null, {
    params: {
      requesterId,
      recipientId,
    },
  });
};
const friendAccept = (requesterId, recipientId) => {
  return axiosClient.post(
    `/api/User/friendrequests/accept/${requesterId}/${recipientId}`
  );
};
const friendReject = (requesterId, recipientId) => {
  return axiosClient.post(
    `/api/User/friendrequests/reject/${requesterId}/${recipientId}`
  );
};

export { sendFriend, friendAccept, friendReject };
