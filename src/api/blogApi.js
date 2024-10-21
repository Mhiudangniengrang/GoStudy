import axiosClient from "../config/axiosClient";

const getBlog = (userId, pageNumber, pageSize) => {
  return axiosClient.get(`/api/BlogPost/UserPosts`, {
    params: {
      userId: userId,
      pageNumber: pageNumber,
      pageSize: pageSize,
    },
  });
};

const getAllBlog = ({ pageNumber, pageSize }) => {
  return axiosClient.get(`/api/BlogPost/trending`, {
    params: {
      pageNumber: pageNumber,
      pageSize: pageSize || 10,
    },
  });
};

const postBlogUser = (userid, formData) => {
  return axiosClient.post(`/api/BlogPost?userid=${userid}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
const postBlogUserVip = (userid, formData) => {
  return axiosClient.post(`/api/BlogPost/postvip?userid=${userid}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const putBlogUser = (postId, data) => {
  return axiosClient.put(`/api/BlogPost/UpdateBlog`, {
    postId: postId,
    title: data.title,
    content: data.content,
    userId: data.userId,
    images: data.images,
  });
};
const postCommentBlog = (commentData) => {
  return axiosClient.post("/api/BlogPost/comments", commentData);
};
const postLikeBlog = (blogId, userId) => {
  return axiosClient.post(`/api/BlogPost/like/${blogId}?userId=${userId}`);
};

const deleteBlogUser = (postId) => {
  return axiosClient.delete(`/api/BlogPost/${postId}`);
};
export {
  getBlog,
  getAllBlog,
  postBlogUser,
  deleteBlogUser,
  postBlogUserVip,
  putBlogUser,
  postCommentBlog,
  postLikeBlog,
};
